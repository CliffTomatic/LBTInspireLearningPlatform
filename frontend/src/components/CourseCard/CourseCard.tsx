import { Link } from "react-router-dom";
import type { Course } from "../../types/Course";


function CourseCard(course: Course) {
    return (
        <Link to={`courses/${course.slug}`}>
            <div className="course-card">
                <img src={course.thumbnailURL} alt="Course Image" className="course-card__image" />
                <h1 className="course-card__title">{course.title}</h1>
                <p className="course-card__description">{course.description}</p>
            </div>
        </Link>
    );
}
export default CourseCard;