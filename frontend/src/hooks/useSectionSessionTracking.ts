import { useCallback, useEffect, useRef, useState } from 'react';
import type {
    ActivateSectionRequest,
    ActivateSectionResponse,
} from '../types/Api/Session';

import {
    activateSession,
    sendHeartbeat,
    endSession,
} from '../services/sessionService';

// TODO: Have HeartbeatMs stored as a global state from API/config.
// TODO: Update activity tracking to work with videos.

type UseSectionSessionTrackingOptions = {
    sessionTarget: ActivateSectionRequest | null;
    heartbeatMs?: number;
};

type UseSectionSessionTrackingResult = {
    sessionInfo: ActivateSectionResponse | null;
    isSessionStarting: boolean;
    sessionError: string | null;
};

/**
 * Tracks the user's current learning session for one section.
 *
 * What this hook does:
 * 1. Starts a new backend session when sessionTarget changes.
 * 2. Stores the returned sessionId and sectionLogId in sessionInfo.
 * 3. Sends heartbeat requests every heartbeatMs.
 * 4. Ends the active session when the user leaves or changes sections.
 *
 * Important:
 * - sessionInfo is created by POST /api/sessions/start.
 * - sessionInfo is updated only after the backend successfully starts a session.
 * - Heartbeat depends on sessionInfo because it needs sessionId + sectionLogId.
 */
export function useSectionSessionTracking({
    sessionTarget,
    heartbeatMs = 15000,
}: UseSectionSessionTrackingOptions): UseSectionSessionTrackingResult {
    // Backend Response
    const [sessionInfo, setSessionInfo] =
        useState<ActivateSectionResponse | null>(null);

    const [isSessionStarting, setIsSessionStarting] = useState(false);
    const [sessionError, setSessionError] = useState<string | null>(null);

    const sessionInfoRef = useRef<ActivateSectionResponse | null>(null);

    // User activity
    const IDLE_TIMEOUT_MS = 60_000;

    const inactiveMsBufferRef = useRef(0);
    const lastAccountedAtRef = useRef<number | null>(null);
    const lastActivityAtRef = useRef<number | null>(null);
    const isWindowInactiveRef = useRef(false);

    useEffect(() => {
        const now = Date.now();

        lastAccountedAtRef.current = now;
        lastActivityAtRef.current = now;

        isWindowInactiveRef.current =
            document.visibilityState !== 'visible' || !document.hasFocus();
    }, []);

    useEffect(() => {
        sessionInfoRef.current = sessionInfo;
    }, [sessionInfo]);

    // Helper Functions

    // Calculate active/inactivity of client
    const commitActivityTime = useCallback(() => {
        const now = Date.now();

        if (
            lastAccountedAtRef.current === null ||
            lastActivityAtRef.current === null
        ) {
            lastAccountedAtRef.current = now;
            lastActivityAtRef.current = now;
            return;
        }

        const from = lastAccountedAtRef.current;

        if (now <= from) {
            return;
        }

        if (isWindowInactiveRef.current) {
            inactiveMsBufferRef.current += now - from;
        } else {
            const idleStartedAt = lastActivityAtRef.current + IDLE_TIMEOUT_MS;

            if (now > idleStartedAt) {
                const inactiveStartedAt = Math.max(from, idleStartedAt);

                inactiveMsBufferRef.current += now - inactiveStartedAt;
            }
        }

        lastAccountedAtRef.current = now;
    }, []);

    // Calculate inactive seconds
    const getActivityDelta = useCallback(() => {
        commitActivityTime();

        const inactiveSecondsDelta = Math.floor(
            inactiveMsBufferRef.current / 1000,
        );

        inactiveMsBufferRef.current -= inactiveSecondsDelta * 1000;

        console.log('Activity delta:', {
            inactiveSecondsDelta,
            visibility: document.visibilityState,
            hasFocus: document.hasFocus(),
            isWindowInactive: isWindowInactiveRef.current,
            lastActivityAt: lastActivityAtRef.current,
        });

        return {
            inactiveSecondsDelta,
        };
    }, [commitActivityTime]);

    /**
     * Update user's window state
     */
    const updateWindowInactiveStatus = useCallback(() => {
        commitActivityTime();

        const isInactive =
            document.visibilityState !== 'visible' || !document.hasFocus();

        isWindowInactiveRef.current = isInactive;

        if (!isInactive) {
            lastActivityAtRef.current = Date.now();
        }
    }, [commitActivityTime]);

    // * Effects

    /**
     * Starts and ends the session.
     * Creates new sectionLog.
     *
     * This runs whenever sessionTarget changes.
     *
     * Important:
     * This should NOT end the session in cleanup.
     * Cleanup runs on section/course changes too.
     */
    useEffect(() => {
        let didCancel = false;

        async function activateCurrentSection() {
            try {
                if (!sessionTarget) {
                    return;
                }

                setIsSessionStarting(true);
                setSessionError(null);

                const { inactiveSecondsDelta } = getActivityDelta();

                const activeSession = await activateSession({
                    ...sessionTarget,
                    inactiveSecondsDelta: inactiveSecondsDelta,
                });

                if (didCancel) {
                    return;
                }

                setSessionInfo(activeSession);
            } catch {
                if (!didCancel) {
                    setSessionInfo(null);
                    setSessionError('Could not activate section.');
                }
            } finally {
                if (!didCancel) {
                    setIsSessionStarting(false);
                }
            }
        }

        activateCurrentSection();

        return () => {
            didCancel = true;
        };
    }, [sessionTarget, getActivityDelta]);

    /**
     * Track user activity.
     */
    useEffect(() => {
        function markActive() {
            commitActivityTime();

            lastActivityAtRef.current = Date.now();

            if (document.visibilityState === 'visible' && document.hasFocus()) {
                isWindowInactiveRef.current = false;
            }
        }

        window.addEventListener('mousemove', markActive);
        window.addEventListener('keydown', markActive);
        window.addEventListener('click', markActive);
        window.addEventListener('scroll', markActive);
        window.addEventListener('touchstart', markActive);

        return () => {
            window.removeEventListener('mousemove', markActive);
            window.removeEventListener('keydown', markActive);
            window.removeEventListener('click', markActive);
            window.removeEventListener('scroll', markActive);
            window.removeEventListener('touchstart', markActive);
        };
    }, [commitActivityTime]);

    // blur/focus/visibility
    useEffect(() => {
        window.addEventListener('blur', updateWindowInactiveStatus);
        window.addEventListener('focus', updateWindowInactiveStatus);
        document.addEventListener(
            'visibilitychange',
            updateWindowInactiveStatus,
        );

        return () => {
            window.removeEventListener('blur', updateWindowInactiveStatus);
            window.removeEventListener('focus', updateWindowInactiveStatus);
            document.removeEventListener(
                'visibilitychange',
                updateWindowInactiveStatus,
            );
        };
    }, [updateWindowInactiveStatus]);

    /**
     * Sends heartbeat requests while a session is active.
     *
     * This runs after sessionInfo exists.
     * sessionInfo comes from startSession().
     */
    useEffect(() => {
        if (!sessionInfo) {
            return;
        }
        const currentSession = sessionInfo;

        const intervalId = window.setInterval(() => {
            const { inactiveSecondsDelta } = getActivityDelta();

            sendHeartbeat({
                sessionId: currentSession.sessionId,
                sectionLogId: currentSession.sectionLogId,
                inactiveSecondsDelta: inactiveSecondsDelta,
            }).catch(() => {
                setSessionError('Could not send heartbeat.');
            });
        }, heartbeatMs);

        // Clean-up : timer
        return () => {
            window.clearInterval(intervalId);
        };
    }, [sessionInfo, heartbeatMs, getActivityDelta]);

    /**
     * End session only when the page/hook truly unmounts.
     *
     * This does NOT run on every sectionTarget change because the dependency
     * array is empty.
     */
    useEffect(() => {
        return () => {
            const currentSession = sessionInfoRef.current;

            const { inactiveSecondsDelta } = getActivityDelta();

            if (!currentSession) {
                return;
            }

            endSession({
                sessionId: currentSession.sessionId,
                sectionLogId: currentSession.sectionLogId,
                inactiveSecondsDelta: inactiveSecondsDelta,
            }).catch(() => {
                // Best-effort cleanup.
            });
        };
    }, [getActivityDelta]);

    return {
        sessionInfo,
        isSessionStarting,
        sessionError,
    };
}
