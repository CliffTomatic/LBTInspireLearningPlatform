import { useEffect, useMemo, useState } from 'react';

import { getAdminDashboard } from '../../../services/adminApi';

import type {
    AdminCourseRow,
    AdminDashboardResponse,
    AdminSessionRow,
    AdminSummary,
    AdminUserRow,
} from '../../../types/Admin';

import './AdminAnalytics.css';

type AdminTab = 'overview' | 'users' | 'courses' | 'sessions';

const tabs: { id: AdminTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'courses', label: 'Courses' },
    { id: 'sessions', label: 'Sessions' },
];

const emptySummary: AdminSummary = {
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeSessions: 0,
    totalSessions: 0,
    completedCourses: 0,
    totalActiveSeconds: 0,
    totalInactiveSeconds: 0,
    averageProgressPercent: 0,
};

export default function AdminAnalytics() {
    const [dashboard, setDashboard] = useState<AdminDashboardResponse>({
        summary: emptySummary,
        users: [],
        courses: [],
        recentSessions: [],
    });

    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSession, setSelectedSession] =
        useState<AdminSessionRow | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let didCancel = false;

        async function loadDashboard() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const rawData = await getAdminDashboard();
                const normalizedDashboard = normalizeDashboard(rawData);

                if (!didCancel) {
                    setDashboard(normalizedDashboard);
                    setSelectedSession(
                        normalizedDashboard.recentSessions[0] ?? null,
                    );
                }
            } catch (error) {
                if (!didCancel) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : 'Could not load admin dashboard.';

                    console.error('Admin dashboard failed to load:', error);

                    setDashboard({
                        summary: emptySummary,
                        users: [],
                        courses: [],
                        recentSessions: [],
                    });

                    setSelectedSession(null);
                    setErrorMessage(message);
                }
            } finally {
                if (!didCancel) {
                    setIsLoading(false);
                }
            }
        }

        loadDashboard();

        return () => {
            didCancel = true;
        };
    }, []);

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredUsers = useMemo(() => {
        return dashboard.users.filter((user) =>
            userMatchesSearch(user, normalizedSearch),
        );
    }, [dashboard.users, normalizedSearch]);

    const filteredCourses = useMemo(() => {
        return dashboard.courses.filter((course) =>
            courseMatchesSearch(course, normalizedSearch),
        );
    }, [dashboard.courses, normalizedSearch]);

    const filteredSessions = useMemo(() => {
        return dashboard.recentSessions.filter((session) =>
            sessionMatchesSearch(session, normalizedSearch),
        );
    }, [dashboard.recentSessions, normalizedSearch]);

    if (isLoading) {
        return (
            <main className="admin-page">
                <div className="admin-page__state-card">
                    Loading admin dashboard...
                </div>
            </main>
        );
    }

    return (
        <main className="admin-page">
            {errorMessage && (
                <div className="admin-page__error-banner">
                    <strong>Dashboard warning:</strong> {errorMessage}
                </div>
            )}

            <section className="admin-page__header">
                <div>
                    <p className="admin-page__eyebrow">Admin Dashboard</p>
                    <h1 className="admin-page__title">Platform Analytics</h1>
                    <p className="admin-page__subtitle">
                        Track learners, course progress, enrollments, active
                        sessions, and watch-time behavior.
                    </p>
                </div>

                <div className="admin-page__header-actions">
                    <span className="admin-page__live-pill">
                        {dashboard.summary.activeSessions} active now
                    </span>
                </div>
            </section>

            <div className="admin-page__content">
                <section className="admin-summary-grid">
                    <SummaryCard
                        label="Total Users"
                        value={dashboard.summary.totalUsers.toString()}
                    />
                    <SummaryCard
                        label="Courses"
                        value={dashboard.summary.totalCourses.toString()}
                    />
                    <SummaryCard
                        label="Enrollments"
                        value={dashboard.summary.totalEnrollments.toString()}
                    />
                    <SummaryCard
                        label="Active Sessions"
                        value={dashboard.summary.activeSessions.toString()}
                    />
                    <SummaryCard
                        label="Avg. Progress"
                        value={`${dashboard.summary.averageProgressPercent}%`}
                    />
                    <SummaryCard
                        label="Active Watch Time"
                        value={formatSeconds(
                            dashboard.summary.totalActiveSeconds,
                        )}
                    />
                </section>

                <section className="admin-toolbar">
                    <div className="admin-tabs">
                        {tabs.map((tab) => (
                            <button
                                className={
                                    activeTab === tab.id
                                        ? 'admin-tabs__button admin-tabs__button--active'
                                        : 'admin-tabs__button'
                                }
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSearchTerm('');
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab !== 'overview' && (
                        <label className="admin-search">
                            <span className="admin-search__label">Search</span>
                            <input
                                className="admin-search__input"
                                type="search"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder={getSearchPlaceholder(activeTab)}
                            />
                        </label>
                    )}
                </section>

                {activeTab === 'overview' && (
                    <OverviewTab
                        courses={dashboard.courses}
                        sessions={dashboard.recentSessions}
                        selectedSession={selectedSession}
                        onSelectSession={setSelectedSession}
                    />
                )}

                {activeTab === 'users' && <UsersTab users={filteredUsers} />}

                {activeTab === 'courses' && (
                    <CoursesTab courses={filteredCourses} />
                )}

                {activeTab === 'sessions' && (
                    <SessionsTab
                        sessions={filteredSessions}
                        selectedSession={selectedSession}
                        onSelectSession={setSelectedSession}
                    />
                )}
            </div>
        </main>
    );
}

type SummaryCardProps = {
    label: string;
    value: string;
};

function SummaryCard({ label, value }: SummaryCardProps) {
    return (
        <article className="admin-summary-card">
            <p className="admin-summary-card__label">{label}</p>
            <strong className="admin-summary-card__value">{value}</strong>
        </article>
    );
}

type OverviewTabProps = {
    courses: AdminCourseRow[];
    sessions: AdminSessionRow[];
    selectedSession: AdminSessionRow | null;
    onSelectSession: (session: AdminSessionRow) => void;
};

function OverviewTab({
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

type UsersTabProps = {
    users: AdminUserRow[];
};

function UsersTab({ users }: UsersTabProps) {
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

type CoursesTabProps = {
    courses: AdminCourseRow[];
};

function CoursesTab({ courses }: CoursesTabProps) {
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

type SessionsTabProps = {
    sessions: AdminSessionRow[];
    selectedSession: AdminSessionRow | null;
    onSelectSession: (session: AdminSessionRow) => void;
};

function SessionsTab({
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

type SessionListProps = {
    sessions: AdminSessionRow[];
    selectedSession: AdminSessionRow | null;
    onSelectSession: (session: AdminSessionRow) => void;
};

function SessionList({
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

type SessionDetailsProps = {
    session: AdminSessionRow;
};

function SessionDetails({ session }: SessionDetailsProps) {
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

type DetailRowProps = {
    label: string;
    value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
    return (
        <div className="admin-details__row">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

type ProgressBarProps = {
    value: number;
};

function ProgressBar({ value }: ProgressBarProps) {
    const safeValue = clampNumber(value, 0, 100);

    return (
        <div className="admin-progress">
            <div
                className="admin-progress__fill"
                style={{ width: `${safeValue}%` }}
            />
            <span>{safeValue}%</span>
        </div>
    );
}

type StatusPillProps = {
    status: string;
};

function StatusPill({ status }: StatusPillProps) {
    const normalizedStatus = status.trim().toLowerCase() || 'inactive';

    return (
        <span className={`admin-status admin-status--${normalizedStatus}`}>
            {status || 'Inactive'}
        </span>
    );
}

function userMatchesSearch(user: AdminUserRow, search: string) {
    if (!search) {
        return true;
    }

    return (
        user.displayName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.status.toLowerCase().includes(search)
    );
}

function courseMatchesSearch(course: AdminCourseRow, search: string) {
    if (!search) {
        return true;
    }

    return (
        course.courseTitle.toLowerCase().includes(search) ||
        course.courseSlug.toLowerCase().includes(search)
    );
}

function sessionMatchesSearch(session: AdminSessionRow, search: string) {
    if (!search) {
        return true;
    }

    return (
        session.displayName.toLowerCase().includes(search) ||
        session.courseTitle.toLowerCase().includes(search) ||
        session.sectionTitle.toLowerCase().includes(search) ||
        session.status.toLowerCase().includes(search)
    );
}

function getSearchPlaceholder(tab: AdminTab) {
    if (tab === 'users') {
        return 'Search users, emails, or status...';
    }

    if (tab === 'courses') {
        return 'Search courses or slugs...';
    }

    return 'Search sessions, users, courses, or status...';
}

function formatSeconds(totalSeconds: number) {
    const safeSeconds = Math.max(Number(totalSeconds) || 0, 0);

    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
}

function formatDateTime(value: string | null) {
    if (!value) {
        return 'N/A';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'N/A';
    }

    return date.toLocaleString();
}

function normalizeDashboard(rawData: unknown): AdminDashboardResponse {
    const root = asRecord(rawData);

    const summary = normalizeSummary(
        getRecordValue(root, 'summary', 'Summary'),
    );

    const users = getArrayValue(root, 'users', 'Users').map(normalizeUserRow);

    const courses = getArrayValue(root, 'courses', 'Courses').map(
        normalizeCourseRow,
    );

    const recentSessions = getArrayValue(
        root,
        'recentSessions',
        'RecentSessions',
    ).map(normalizeSessionRow);

    return {
        summary,
        users,
        courses,
        recentSessions,
    };
}

function normalizeSummary(rawSummary: unknown): AdminSummary {
    const summary = asRecord(rawSummary);

    return {
        totalUsers: getNumberValue(summary, 'totalUsers', 'TotalUsers'),
        totalCourses: getNumberValue(summary, 'totalCourses', 'TotalCourses'),
        totalEnrollments: getNumberValue(
            summary,
            'totalEnrollments',
            'TotalEnrollments',
        ),
        activeSessions: getNumberValue(
            summary,
            'activeSessions',
            'ActiveSessions',
        ),
        totalSessions: getNumberValue(
            summary,
            'totalSessions',
            'TotalSessions',
        ),
        completedCourses: getNumberValue(
            summary,
            'completedCourses',
            'CompletedCourses',
        ),
        totalActiveSeconds: getNumberValue(
            summary,
            'totalActiveSeconds',
            'TotalActiveSeconds',
        ),
        totalInactiveSeconds: getNumberValue(
            summary,
            'totalInactiveSeconds',
            'TotalInactiveSeconds',
        ),
        averageProgressPercent: getNumberValue(
            summary,
            'averageProgressPercent',
            'AverageProgressPercent',
        ),
    };
}

function normalizeUserRow(rawUser: unknown): AdminUserRow {
    const user = asRecord(rawUser);

    return {
        userId: getStringValue(user, 'userId', 'UserId'),
        displayName:
            getStringValue(user, 'displayName', 'DisplayName') ||
            'Unknown User',
        email: getStringValue(user, 'email', 'Email'),
        enrolledCourses: getNumberValue(
            user,
            'enrolledCourses',
            'EnrolledCourses',
        ),
        completedCourses: getNumberValue(
            user,
            'completedCourses',
            'CompletedCourses',
        ),
        averageProgressPercent: getNumberValue(
            user,
            'averageProgressPercent',
            'AverageProgressPercent',
        ),
        totalActiveSeconds: getNumberValue(
            user,
            'totalActiveSeconds',
            'TotalActiveSeconds',
        ),
        lastSeenAt:
            getNullableStringValue(user, 'lastSeenAt', 'LastSeenAt') ?? null,
        status: getStringValue(user, 'status', 'Status') || 'Inactive',
    };
}

function normalizeCourseRow(rawCourse: unknown): AdminCourseRow {
    const course = asRecord(rawCourse);

    return {
        courseId: getNumberValue(course, 'courseId', 'CourseId'),
        courseSlug: getStringValue(course, 'courseSlug', 'CourseSlug'),
        courseTitle:
            getStringValue(course, 'courseTitle', 'CourseTitle') ||
            'Untitled Course',
        enrolledUsers: getNumberValue(course, 'enrolledUsers', 'EnrolledUsers'),
        completedUsers: getNumberValue(
            course,
            'completedUsers',
            'CompletedUsers',
        ),
        averageProgressPercent: getNumberValue(
            course,
            'averageProgressPercent',
            'AverageProgressPercent',
        ),
        totalActiveSeconds: getNumberValue(
            course,
            'totalActiveSeconds',
            'TotalActiveSeconds',
        ),
        activeSessions: getNumberValue(
            course,
            'activeSessions',
            'ActiveSessions',
        ),
    };
}

function normalizeSessionRow(rawSession: unknown): AdminSessionRow {
    const session = asRecord(rawSession);

    return {
        sessionId:
            getStringValue(session, 'sessionId', 'SessionId') ||
            crypto.randomUUID(),
        userId: getStringValue(session, 'userId', 'UserId'),
        displayName:
            getStringValue(session, 'displayName', 'DisplayName') ||
            'Unknown User',
        courseId: getNumberValue(session, 'courseId', 'CourseId'),
        courseTitle:
            getStringValue(session, 'courseTitle', 'CourseTitle') ||
            'Unknown Course',
        sectionTitle:
            getStringValue(session, 'sectionTitle', 'SectionTitle') ||
            'Course Progress',
        startedAt: getStringValue(session, 'startedAt', 'StartedAt'),
        lastHeartbeatAt: getStringValue(
            session,
            'lastHeartbeatAt',
            'LastHeartbeatAt',
        ),
        endedAt: getNullableStringValue(session, 'endedAt', 'EndedAt') ?? null,
        activeSeconds: getNumberValue(
            session,
            'activeSeconds',
            'ActiveSeconds',
        ),
        inactiveSeconds: getNumberValue(
            session,
            'inactiveSeconds',
            'InactiveSeconds',
        ),
        status: getStringValue(session, 'status', 'Status') || 'Inactive',
    };
}

function asRecord(value: unknown): Record<string, unknown> {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        return value as Record<string, unknown>;
    }

    return {};
}

function getRecordValue(
    record: Record<string, unknown>,
    camelKey: string,
    pascalKey: string,
) {
    return record[camelKey] ?? record[pascalKey];
}

function getArrayValue(
    record: Record<string, unknown>,
    camelKey: string,
    pascalKey: string,
) {
    const value = record[camelKey] ?? record[pascalKey];

    if (Array.isArray(value)) {
        return value;
    }

    return [];
}

function getStringValue(
    record: Record<string, unknown>,
    camelKey: string,
    pascalKey: string,
) {
    const value = record[camelKey] ?? record[pascalKey];

    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    return '';
}

function getNullableStringValue(
    record: Record<string, unknown>,
    camelKey: string,
    pascalKey: string,
) {
    const value = record[camelKey] ?? record[pascalKey];

    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value === 'string') {
        return value;
    }

    return String(value);
}

function getNumberValue(
    record: Record<string, unknown>,
    camelKey: string,
    pascalKey: string,
) {
    const value = record[camelKey] ?? record[pascalKey];

    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'string') {
        const parsed = Number(value);

        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }

    return 0;
}

function clampNumber(value: number, min: number, max: number) {
    if (!Number.isFinite(value)) {
        return min;
    }

    return Math.min(Math.max(Math.round(value), min), max);
}
