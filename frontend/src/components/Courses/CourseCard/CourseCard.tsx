import { Link } from "react-router-dom";
import type { CourseCardProps } from "../../../types/Course";

function CourseCard({ course }: CourseCardProps) {
    return (
        <Link to={`courses/${course.slug}`}>
            <div className="course-card">
                <img src={course.thumbnailUrl} alt="Course Image" className="course-card__image" />
                <h1 className="course-card__title">{course.title}</h1>
                <p className="course-card__description">{course.description}</p>
            </div>
        </Link>
    );
}
export default CourseCard;