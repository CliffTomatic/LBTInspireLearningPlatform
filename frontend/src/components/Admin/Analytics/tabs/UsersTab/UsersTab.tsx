import type { AdminUserRow } from '../../../../../types/Admin';

import ProgressBar from '../../ProgressBar/ProgressBar';
import { formatSeconds } from '../../../../../utils/admin/analytics/adminAnalyticsFormatters';
import StatusPill from '../../StatusPill/StatusPill';

/**
 * Props for the UsersTab component.
 */
type UsersTabProps = {
    // User analytics rows shown in the users table.
    users: AdminUserRow[];
};

/**
 * Displays learner analytics such as enrollment count, completion count,
 * average progress, watch time, and status.
 *
 * @param users - User analytics rows.
 * @returns The users tab content.
 */
export default function UsersTab({ users }: UsersTabProps) {
    return (
        <section className="admin-panel">
            <div className="admin-panel__header">
                <h2 className="admin-panel__title">Users</h2>
                <p className="admin-panel__subtitle">
                    Learner progress, enrollments, completion, and total active
                    watch time.
                </p>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Enrolled</th>
                            <th>Completed</th>
                            <th>Avg Progress</th>
                            <th>Watch Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <p className="admin-empty-text">
                                        No users found.
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.userId}>
                                    <td>{user.displayName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.enrolledCourses}</td>
                                    <td>{user.completedCourses}</td>
                                    <td>
                                        <ProgressBar
                                            value={user.averageProgressPercent}
                                        />
                                    </td>
                                    <td>
                                        {formatSeconds(user.totalActiveSeconds)}
                                    </td>
                                    <td>
                                        <StatusPill status={user.status} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
