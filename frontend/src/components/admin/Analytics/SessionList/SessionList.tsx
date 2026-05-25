import type { AdminSessionRow } from '../../../../types/Admin';

import StatusPill from '../StatusPill/StatusPill';

/**
 * Props for the SessionList component.
 */
type SessionListProps = {
    // Sessions to display in the list.
    sessions: AdminSessionRow[];

    // Currently selected session.
    selectedSession: AdminSessionRow | null;

    // Callback fired when the admin selects a session.
    onSelectSession: (session: AdminSessionRow) => void;
};

/**
 * Displays recent/admin-visible session rows.
 * Clicking a session selects it for the details panel.
 */
export default function SessionList({
    sessions,
    selectedSession,
    onSelectSession,
}: SessionListProps) {
    if (sessions.length === 0) {
        return <p className="admin-empty-text">No sessions found.</p>;
    }

    return (
        <div className="admin-session-list">
            {sessions.map((session) => (
                <button
                    className={
                        selectedSession?.sessionId === session.sessionId
                            ? 'admin-session-card admin-session-card--active'
                            : 'admin-session-card'
                    }
                    key={session.sessionId}
                    type="button"
                    onClick={() => onSelectSession(session)}
                >
                    <div>
                        <strong>{session.displayName}</strong>
                        <span>{session.courseTitle}</span>
                    </div>

                    <StatusPill status={session.status} />
                </button>
            ))}
        </div>
    );
}
