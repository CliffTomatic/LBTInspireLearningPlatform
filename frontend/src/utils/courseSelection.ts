import { apiFetch } from '../services/api';
import type { Course, CourseChapter, CourseSection } from '../types/Course';

// CourseDetailsPage.tsx
export function getCourses() {
    return apiFetch<Omit<Course, 'chapters'>[]>('/api/courses');
}

// LearnPage.tsx
export function getAllSections(course: Course | null): CourseSection[] {
    if (!course) {
        return [];
    }
    return course.chapters.flatMap((chapter) => chapter.sections);
}

export function getCourseBySlug(slug: string) {
    return apiFetch<Course>(`/api/courses/${slug}`);
}

export function getChapterBySectionSlug(
    course: Course | null,
    sectionSlug: string | undefined,
): CourseChapter | null {
    if (!course || !sectionSlug) {
        return null;
    }
    return (
        course.chapters.find((chapter) =>
            chapter.sections.some((section) => section.slug === sectionSlug),
        ) ?? null
    );
}

export function getSectionBySlugFromCourse(
    course: Course | null,
    sectionSlug: string | undefined,
): CourseSection | null {
    if (!course || !sectionSlug) {
        return null;
    }

    return (
        getAllSections(course).find(
            (section) => section.slug === sectionSlug,
        ) ?? null
    );
}

export function getSectionBySlugFromSections(
    flatMapSections: CourseSection[],
    sectionSlug: string | undefined,
): CourseSection | null {
    if (!sectionSlug) {
        return null;
    }

    return flatMapSections.find((s) => s.slug === sectionSlug) ?? null;
}
