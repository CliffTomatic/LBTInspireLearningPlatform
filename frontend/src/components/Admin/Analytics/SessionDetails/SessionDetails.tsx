import type { AdminSessionRow } from '../../../../types/Admin';

import DetailRow from '../DetailRow/DetailRow';

import {
    formatDateTime,
    formatSeconds,
} from '../../../../utils/admin/analytics/adminAnalyticsFormatters';

/**
 * Props for the SessionDetails component.
 */
type SessionDetailsProps = {
    /**
     * Selected session to display in the details panel.
     */
    session: AdminSessionRow;
};

/**
 * Displays detailed information for one selected session.
 *
 * @param props - Component props.
 * @param props.session - Session row selected by the admin.
 * @returns A session detail panel.
 */
export default function SessionDetails({ session }: SessionDetailsProps) {
    return (
        <div className="admin-details">
            <DetailRow label="User" value={session.displayName} />
            <DetailRow label="Course" value={session.courseTitle} />
            <DetailRow label="Section" value={session.sectionTitle} />

            <DetailRow
                label="Started"
                value={formatDateTime(session.startedAt)}
            />

            <DetailRow
                label="Last Heartbeat"
                value={formatDateTime(session.lastHeartbeatAt)}
            />

            <DetailRow
                label="Ended"
                value={
                    session.endedAt
                        ? formatDateTime(session.endedAt)
                        : 'Still open'
                }
            />

            <DetailRow
                label="Active Time"
                value={formatSeconds(session.activeSeconds)}
            />

            <DetailRow
                label="Inactive Time"
                value={formatSeconds(session.inactiveSeconds)}
            />

            <DetailRow label="Status" value={session.status} />
        </div>
    );
}
