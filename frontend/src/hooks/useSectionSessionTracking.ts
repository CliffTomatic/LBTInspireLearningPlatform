import { useEffect, useRef, useState } from 'react';
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

    useEffect(() => {
        sessionInfoRef.current = sessionInfo;
    }, [sessionInfo]);

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

                const activeSession = await activateSession({
                    ...sessionTarget,
                    inactiveSecondsDelta: 0,
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
    }, [sessionTarget]);

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
            sendHeartbeat({
                sessionId: currentSession.sessionId,
                sectionLogId: currentSession.sectionLogId,
                inactiveSecondsDelta: 0, // TODO: Pass in Actual Delta
            });
        }, heartbeatMs);

        // Clean-up : timer
        return () => {
            window.clearInterval(intervalId);
        };
    }, [sessionInfo, heartbeatMs]);

    /**
     * End session only when the page/hook truly unmounts.
     *
     * This does NOT run on every sectionTarget change because the dependency
     * array is empty.
     */
    useEffect(() => {
        return () => {
            const currentSession = sessionInfoRef.current;

            if (!currentSession) {
                return;
            }

            endSession({
                sessionId: currentSession.sessionId,
                sectionLogId: currentSession.sectionLogId,
                inactiveSecondsDelta: 0,
            }).catch(() => {
                // Best-effort cleanup.
            });
        };
    }, []);

    return {
        sessionInfo,
        isSessionStarting,
        sessionError,
    };
}
