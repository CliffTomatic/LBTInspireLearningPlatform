import { apiFetch } from '../services/api';
import type { Course } from '../types/Course';



export function getCourses() {
    return apiFetch<Omit<Course, 'chapters'>[]>('/api/courses');
}

export function getCourseBySlug(slug: string) {
    return apiFetch<Course>(`/api/courses/${slug}`);
}
