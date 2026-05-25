// Admin Analytics subtabs, not general sidebar tabs
export const ANALYTICS_TABS = [
    'overview',
    'users',
    'courses',
    'sessions',
] as const;
export type AnalyticsTabs = (typeof ANALYTICS_TABS)[number];
export const ANALYTICS_TAB_ITEMS: { id: AnalyticsTabs; label: string }[] = [
    {
        id: 'overview',
        label: 'Overview',
    },
    {
        id: 'users',
        label: 'Users',
    },
    {
        id: 'courses',
        label: 'Courses',
    },
    {
        id: 'sessions',
        label: 'Sessions',
    },
];

// Used for checking if slug is a real tab and as a slug for <Link>
export const ADMIN_PAGE = ['dashboard', 'analytics'] as const;
export type AdminPage = (typeof ADMIN_PAGE)[number];

export type AdminDashboardResponse = {
    summary: AdminSummary;
    users: AdminUserRow[];
    courses: AdminCourseRow[];
    recentSessions: AdminSessionRow[];
};

export type AdminSummary = {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    activeSessions: number;
    totalSessions: number;
    completedCourses: number;
    totalActiveSeconds: number;
    totalInactiveSeconds: number;
    averageProgressPercent: number;
};

export type AdminUserRow = {
    userId: string;
    displayName: string;
    email: string;
    enrolledCourses: number;
    completedCourses: number;
    averageProgressPercent: number;
    totalActiveSeconds: number;
    lastSeenAt: string | null;
    status: string;
};

export type AdminCourseRow = {
    courseId: number;
    courseSlug: string;
    courseTitle: string;
    enrolledUsers: number;
    completedUsers: number;
    averageProgressPercent: number;
    totalActiveSeconds: number;
    activeSessions: number;
};

export type AdminSessionRow = {
    sessionId: string;
    userId: string;
    displayName: string;
    courseId: number;
    courseTitle: string;
    sectionTitle: string;
    startedAt: string;
    lastHeartbeatAt: string;
    endedAt: string | null;
    activeSeconds: number;
    inactiveSeconds: number;
    status: string;
};
