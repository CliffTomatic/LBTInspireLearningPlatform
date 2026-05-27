import { apiFetch } from './api';

type EnrollmentStatus = {
    courseId: number;
    courseSlug: string;
    isEnrolled: boolean;
};
// Enrollment
export type UserEnrollmentStatusDto = {
    message: string;
    CourseId: number;
    CourseSlug: string;
    isEnrolled: boolean;
};

export async function getCourseEnrollmentStatus(
    courseSlug: string,
): Promise<EnrollmentStatus | null> {
    const response = await apiFetch<EnrollmentStatus>(
        `/api/courses/${courseSlug}/enrollment`,
        {
            method: 'GET',
        },
    );

    if (!response) {
        return null;
    }

    return response;
}

export async function enrollInCourse(
    courseSlug: string,
): Promise<EnrollmentStatus> {
    const response = await apiFetch<EnrollmentStatus>(
        `/api/courses/${courseSlug}/enroll`,
        {
            method: 'POST',
        },
    );

    if (!response) {
        throw new Error('Could not enroll in course.');
    }

    return response;
}
