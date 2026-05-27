import { useNavigate } from 'react-router-dom';
import type { Course } from '../../../types/Course';

import { useAuth } from '../../../context/useAuth';
import { useToast } from '../../../context/Toast/useToast';

import './CourseDetailsHero.css';
import {
    enrollInCourse,
    getCourseEnrollmentStatus,
} from '../../../services/courseEnrollmentService';

type CourseDetailsHeroProps = {
    course: Course;
};

export default function CourseDetailsHero({ course }: CourseDetailsHeroProps) {
    const { user } = useAuth();
    const { showError, showSuccess } = useToast();
    const navigate = useNavigate();

    // Prompt user to login before enrolling into a course.
    async function handleEnrollClick() {
        if (!course) {
            return;
        }

        if (!user) {
            showError(
                'Please sign in or register an account before enrolling into a course.',
            );

            return;
        }

        // See if user is already enrolled
        // Enroll user if not already enrolled.
        try {
            const tryToEnroll = await getCourseEnrollmentStatus(course.slug);
            if (tryToEnroll?.isEnrolled) {
                navigate(`/learn/${course.slug}`);
                return;
            }

            // If not enrolled, enroll
            const enrollUser = await enrollInCourse(course.slug);

            if (enrollUser.isEnrolled) {
                showSuccess('You are now enrolled in this course.');
                navigate(`/learn/${course.slug}`);
            }
        } catch {
            showError('Could not enroll in this course.');
        }
    }

    return (
        <>
            <div className="page-container">
                <section className="course-details-hero">
                    <div className="course-details-hero__content">
                        <p className="course-details-hero__eyebrow">
                            LearnBasicTech Course
                        </p>

                        <h1 className="course-details-hero__title">
                            {course.title}
                        </h1>

                        <p className="course-details-hero__description">
                            {course.description}
                        </p>

                        <div className="course-details-hero__meta">
                            <span>{course.level}</span>
                            <span>{course.estimatedHours} hours</span>
                            <span>{course.chapters.length} chapters</span>
                        </div>

                        <button
                            className="course-details-hero__enroll-button"
                            onClick={handleEnrollClick}
                        >
                            Enroll in Course
                        </button>
                    </div>

                    <div className="course-details-hero__thumbnail-card">
                        <img
                            className="course-details-hero__thumbnail"
                            src={course.thumbnailUrl}
                            alt={`${course.title} course thumbnail`}
                        />
                    </div>
                </section>
            </div>
        </>
    );
}
