import type { AdminCourseRow } from '../../../../../types/Admin';

import ProgressBar from '../../ProgressBar/ProgressBar';
import { formatSeconds } from '../../../../../utils/admin/analytics/adminAnalyticsFormatters';

/**
 * Props for the CoursesTab component.
 */
type CoursesTabProps = {
    // Course analytics rows shown in the courses table.
    courses: AdminCourseRow[];
};

/**
 * Displays course analytics such as enrollments, completions, average progress,
 * total watch time, and active sessions.
 *
 * @param courses - Course analytics rows.
 * @returns The courses tab content.
 */
export default function CoursesTab({ courses }: CoursesTabProps) {
    return (
        <section className="admin-panel">
            <div className="admin-panel__header">
                <h2 className="admin-panel__title">Courses</h2>
                <p className="admin-panel__subtitle">
                    Compare course engagement, completion, and session activity.
                </p>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Slug</th>
                            <th>Enrolled</th>
                            <th>Completed</th>
                            <th>Avg Progress</th>
                            <th>Total Watch Time</th>
                            <th>Active Sessions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <p className="admin-empty-text">
                                        No courses found.
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course.courseId}>
                                    <td>{course.courseTitle}</td>
                                    <td>{course.courseSlug}</td>
                                    <td>{course.enrolledUsers}</td>
                                    <td>{course.completedUsers}</td>
                                    <td>
                                        <ProgressBar
                                            value={
                                                course.averageProgressPercent
                                            }
                                        />
                                    </td>
                                    <td>
                                        {formatSeconds(
                                            course.totalActiveSeconds,
                                        )}
                                    </td>
                                    <td>{course.activeSessions}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
