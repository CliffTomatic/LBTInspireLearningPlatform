import { Link } from "react-router-dom";
import type { Course } from "../../types/Course";
import "./CourseDetailsHero.css";

type CourseDetailsHeroProps = {
    course: Course;
};

export default function CourseDetailsHero({ course }: CourseDetailsHeroProps) {
    const handleEnrollClick = () => {
        console.log("Enroll clicked for course:", course.slug);
    };

    return (
        <>
            <div className="page-containe">
                <section className="course-details-hero">
                    <div className="course-details-hero__content">
                        <p className="course-details-hero__eyebrow">LearnBasicTech Course</p>

                        <h1 className="course-details-hero__title">{course.title}</h1>

                        <p className="course-details-hero__description">
                            {course.description}
                        </p>

                        <div className="course-details-hero__meta">
                            <span>{course.level}</span>
                            <span>{course.estimatedHours} hours</span>
                            <span>{course.chapters.length} chapters</span>
                        </div>

                        <Link
                            className="course-details-hero__enroll-button"
                            onClick={handleEnrollClick}
                            to={`/learn/${course.slug}`}
                        >
                            Enroll in Course
                        </Link>
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