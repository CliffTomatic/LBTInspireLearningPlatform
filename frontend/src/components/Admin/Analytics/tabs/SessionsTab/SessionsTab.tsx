import type { AdminSessionRow } from '../../../../../types/Admin';

import SessionDetails from '../../SessionDetails/SessionDetails';
import SessionList from '../../SessionList/SessionList';

/**
 * Props for the SessionsTab component.
 */
type SessionsTabProps = {
    // Session rows shown in the session list.
    sessions: AdminSessionRow[];

    // Currently selected session for the details panel.
    selectedSession: AdminSessionRow | null;

    // Callback fired when an admin selects a session.
    onSelectSession: (session: AdminSessionRow) => void;
};

/**
 * Displays session analytics and a detail panel for the selected session.
 *
 * @param sessions - Session rows.
 * @param selectedSession - Currently selected session.
 * @param onSelectSession - Session selection handler.
 * @returns The sessions tab content.
 */
export default function SessionsTab({
    sessions,
    selectedSession,
    onSelectSession,
}: SessionsTabProps) {
    return (
        <section className="admin-session-layout">
            <div className="admin-panel">
                <div className="admin-panel__header">
                    <h2 className="admin-panel__title">Sessions</h2>
                    <p className="admin-panel__subtitle">
                        Click a row to inspect timing and heartbeat status.
                    </p>
                </div>

                <SessionList
                    sessions={sessions}
                    selectedSession={selectedSession}
                    onSelectSession={onSelectSession}
                />
            </div>

            <div className="admin-panel">
                <div className="admin-panel__header">
                    <h2 className="admin-panel__title">Session Details</h2>
                    <p className="admin-panel__subtitle">
                        Active time, inactive time, course, section, and latest
                        heartbeat.
                    </p>
                </div>

                {selectedSession ? (
                    <SessionDetails session={selectedSession} />
                ) : (
                    <p className="admin-empty-text">
                        Select a session to view details.
                    </p>
                )}
            </div>
        </section>
    );
}
