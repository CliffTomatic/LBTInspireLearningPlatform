import CourseGrid from '../components/Courses/CourseGrid/CourseGrid';
import { useEffect, useState } from 'react';

// Test Data
// import { testBegCourses } from '../data/courses';
import { testAdvCourses } from '../data/courses';

import type { CourseSummary } from '../types/Course';
import { getCourses } from '../utils/courseSelection';
export default function CoursesPage() {
    const [courses, setCourses] = useState<CourseSummary[]>([]);

    useEffect(() => {
        async function loadCourses() {
            const data = await getCourses();
            setCourses(data ?? []);
        }

        loadCourses();
    }, []);

    return (
        <section className="courses">
            <section className="page-container">
                <h1 className="courses__title">Beginner Courses</h1>
                <CourseGrid courses={courses} />
                <h1 className="courses__title">Advanced Courses</h1>
                <CourseGrid courses={testAdvCourses} />
            </section>
        </section>
    );
}
