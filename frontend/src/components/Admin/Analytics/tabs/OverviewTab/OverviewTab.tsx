import type {
    AdminCourseRow,
    AdminSessionRow,
} from '../../../../../types/Admin';

import ProgressBar from '../../ProgressBar/ProgressBar';
import SessionDetails from '../../SessionDetails/SessionDetails';
import SessionList from '../../SessionList/SessionList';

/**
 * Props for the OverviewTab component.
 */
type OverviewTabProps = {
    // Course rows shown in the course performance table.
    courses: AdminCourseRow[];

    // Recent session rows shown in the overview panel.
    sessions: AdminSessionRow[];

    // Currently selected session for the detail panel.
    selectedSession: AdminSessionRow | null;

    // Callback fired when an admin selects a session.
    onSelectSession: (session: AdminSessionRow) => void;
};

/**
 * Displays the admin overview tab with course performance and recent sessions.
 *
 * @param courses - Course analytics rows.
 * @param sessions - Recent session rows.
 * @param selectedSession - Currently selected session.
 * @param onSelectSession - Session selection handler.
 * @returns The overview tab content.
 */
export default function OverviewTab({
    courses,
    sessions,
    selectedSession,
    onSelectSession,
}: OverviewTabProps) {
    return (
        <section className="admin-overview-grid">
            <div className="admin-panel">
                <div className="admin-panel__header">
                    <h2 className="admin-panel__title">Course Performance</h2>
                    <p className="admin-panel__subtitle">
                        Enrollment, completion, progress, and active sessions.
                    </p>
                </div>

                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Enrolled</th>
                                <th>Completed</th>
                                <th>Avg Progress</th>
                                <th>Active</th>
                            </tr>
                        </thead>

                        <tbody>
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <p className="admin-empty-text">
                                            No course data found.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.courseId}>
                                        <td>{course.courseTitle}</td>
                                        <td>{course.enrolledUsers}</td>
                                        <td>{course.completedUsers}</td>
                                        <td>
                                            <ProgressBar
                                                value={
                                                    course.averageProgressPercent
                                                }
                                            />
                                        </td>
                                        <td>{course.activeSessions}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="admin-panel">
                <div className="admin-panel__header">
                    <h2 className="admin-panel__title">Recent Sessions</h2>
                    <p className="admin-panel__subtitle">
                        Latest learner activity and session status.
                    </p>
                </div>

                <SessionList
                    sessions={sessions.slice(0, 5)}
                    selectedSession={selectedSession}
                    onSelectSession={onSelectSession}
                />

                {selectedSession && (
                    <SessionDetails session={selectedSession} />
                )}
            </div>
        </section>
    );
}
