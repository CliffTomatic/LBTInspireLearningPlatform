import type {
    AdminCourseRow,
    AdminSessionRow,
    AdminUserRow,
    AnalyticsTabs,
} from '../../../types/Admin';

export function userMatchesSearch(user: AdminUserRow, search: string) {
    if (!search) {
        return true;
    }

    return (
        user.displayName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.status.toLowerCase().includes(search)
    );
}

export function courseMatchesSearch(course: AdminCourseRow, search: string) {
    if (!search) {
        return true;
    }

    return (
        course.courseTitle.toLowerCase().includes(search) ||
        course.courseSlug.toLowerCase().includes(search)
    );
}

export function sessionMatchesSearch(session: AdminSessionRow, search: string) {
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

export function getSearchPlaceholder(tab: AnalyticsTabs) {
    if (tab === 'users') {
        return 'Search users, emails, or status...';
    }

    if (tab === 'courses') {
        return 'Search courses or slugs...';
    }

    return 'Search sessions, users, courses, or status...';
}
