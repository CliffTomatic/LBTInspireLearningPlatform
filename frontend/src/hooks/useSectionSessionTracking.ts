import { useEffect, useState } from 'react';
import type {
    StartSessionRequest,
    StartSessionResponse,
} from '../types/Api/Session';

import {
    startSession,
    sendHeartbeat,
    endSession,
} from '../services/sessionService';

// TODO: Have HeartbeatMs stored as a global state from API/config.

type UseSectionSessionTrackingOptions = {
    sessionTarget: StartSessionRequest | null;
    heartbeatMs?: number;
};

type UseSectionSessionTrackingResult = {
    sessionInfo: StartSessionResponse | null;
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
    const [sessionInfo, setSessionInfo] = useState<StartSessionResponse | null>(
        null,
    );

    const [isSessionStarting, setIsSessionStarting] = useState(false);

    const [sessionError, setSessionError] = useState<string | null>(null);

    /**
     * Starts and ends the session.
     *
     * This runs whenever sessionTarget changes.
     * Example:
     * /learn/wifi-basics/what-is-wifi
     * -> starts session for section 1
     *
     * Then user clicks another section:
     * /learn/wifi-basics/fix-slow-wifi
     * -> cleanup ends old session
     * -> effect starts new session
     */
    useEffect(() => {
        let activeSession: StartSessionResponse | null = null;
        let didCancel = false;

        async function beginSession() {
            try {
                if (!sessionTarget) {
                    return;
                }

                setIsSessionStarting(true);
                setSessionError(null);

                const newSession = await startSession(sessionTarget);

                // Prevents Async Overlap
                if (didCancel) {
                    await endSession({
                        sessionId: newSession.sessionId,
                        sectionLogId: newSession.sectionLogId,
                        inactiveSecondsDelta: 0, // TODO: Pass in Actual Delta
                    });
                    return;
                }
                activeSession = newSession;
                setSessionInfo(newSession);
            } catch {
                setSessionInfo(null);
                setSessionError('Could not start learning session.');
            } finally {
                if (!didCancel) {
                    setIsSessionStarting(false);
                }
            }
        }

        beginSession();

        // Clean-up
        return () => {
            didCancel = true;

            if (activeSession) {
                endSession({
                    sessionId: activeSession.sessionId,
                    sectionLogId: activeSession.sectionLogId,
                    inactiveSecondsDelta: 0, // TODO: Pass in Actual Delta
                });
            }

            setSessionInfo(null);
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

    return {
        sessionInfo,
        isSessionStarting,
        sessionError,
    };
}
