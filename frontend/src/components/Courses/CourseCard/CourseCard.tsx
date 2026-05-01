import { Link } from "react-router-dom";
import type { Course } from "../../../types/Course";
import './CourseCard.css'

export type CourseCardProps = {
    course: Course;
};
function CourseCard({ course }: CourseCardProps) {
    return (
        <Link to={`courses/${course.slug}`}>
            <div className="course-card">
                <div className="course-card__thumbnail-wrapper">
                    <img src={course.thumbnailUrl} alt="Course Thumbnail" className="course-card__thumbnail" />
                </div>
                <h1 className="course-card__title">{course.title}</h1>
                <p className="course-card__description">{course.description}</p>
            </div>
        </Link>
    );
}
export default CourseCard;