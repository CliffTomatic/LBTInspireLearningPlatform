import type {
    AdminCourseRow,
    AdminDashboardResponse,
    AdminSessionRow,
    AdminSummary,
    AdminUserRow,
} from '../../../types/Admin';

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

export function getEmptyDashboard(): AdminDashboardResponse {
    return {
        summary: emptySummary,
        users: [],
        courses: [],
        recentSessions: [],
    };
}

export function normalizeDashboard(rawData: unknown): AdminDashboardResponse {
    const rawRoot = asRecord(rawData);

    const root = asRecord(rawRoot.result ?? rawRoot.Result ?? rawData);

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
