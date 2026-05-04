import { Link, useParams } from 'react-router-dom';
import CourseDetailsHero from '../../components/CourseDetailsHero/CourseDetailsHero';
import { courses } from '../../data/courses';
import CourseCurriculum from '../../components/CourseCurriculm/CourseCurriculum';
import './CourseDetailsPage.css';

function CourseDetailsPage() {
    const { courseSlug } = useParams();

    const selectedCourse = courses.find((course) => {
        return course.slug === courseSlug;
    });

    if (!selectedCourse) {
        // TODO Change to Global Invalid Page.
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
