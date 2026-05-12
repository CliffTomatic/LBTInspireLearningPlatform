import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import CourseDetailsHero from '../../components/Courses/CourseDetailsHero/CourseDetailsHero';
import CourseCurriculum from '../../components/Courses/CourseCurriculm/CourseCurriculum';
import { getCourseBySlug } from '../../services/courseService';
import type { Course } from '../../types/Course';

import './CourseDetailsPage.css';

function CourseDetailsPage() {
    const { courseSlug } = useParams();

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        async function loadCourse() {
            if (!courseSlug) {
                setErrorMessage('Missing course slug.');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setErrorMessage(null);

                const course = await getCourseBySlug(courseSlug);

                setSelectedCourse(course);
            } catch {
                setSelectedCourse(null);
                setErrorMessage('Course not found.');
            } finally {
                setIsLoading(false);
            }
        }

        loadCourse();
    }, [courseSlug]);

    if (isLoading) {
        return (
            <main className="course-details-page">
                <section className="course-details-page__not-found">
                    <h1>Loading course...</h1>
                </section>
            </main>
        );
    }

    if (!selectedCourse || errorMessage) {
        return (
            <main className="course-details-page">
                <section className="course-details-page__not-found">
                    <h1>Course not found</h1>
                    <p>The course you are looking for does not exist.</p>

                    <Link
                        className="course-details-page__back-link"
                        to="/courses"
                    >
                        Back to Courses
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <div className="course-details-page">
            <div className="page-container">
                <Link className="course-details-page__back-link" to="/courses">
                    ← Back to Courses
                </Link>

                <CourseDetailsHero course={selectedCourse} />

                <CourseCurriculum chapters={selectedCourse.chapters} />
            </div>
        </div>
    );
}

export default CourseDetailsPage;
