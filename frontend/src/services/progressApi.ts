import { apiFetch } from './api';

export type CourseProgressStatus = {
    message: string;
    courseId: number;
    courseSlug: string;
    isEnrolled: boolean;
    totalSections: number;
    completedSectionCount: number;
    progressPercent: number;
    completedSectionIds: number[];
};

/**
 * Gets the current progress of a course. Check backend "CourseProgressStatusDto"
 * or check CourseProgressStatus type
 * @param courseSlug URL Section Slug
 * @returns API response, Course Progress Status
 */
export async function getCourseProgress(courseSlug: string) {
    return apiFetch<CourseProgressStatus>(
        `/api/courses/${courseSlug}/progress`,
    );
}

/**
 * Mark a section as complete
 * @param courseSlug URL Section Slug
 * @param sectionId ID of current open section
 * @returns API response, CourseProgressStatus
 */
export async function completeSection(courseSlug: string, sectionId: number) {
    return apiFetch<CourseProgressStatus>(
        `/api/courses/${courseSlug}/sections/${sectionId}/complete`,
        {
            method: 'POST',
        },
    );
}
