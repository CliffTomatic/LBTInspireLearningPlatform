import CourseCard from "../CourseCard/CourseCard";
import type { Course } from "../../../types/Course";
import './CourseGrid.css';

export type CourseGridProps = {
    courses: Course[];
};

function CourseGrid({ courses }: CourseGridProps) {
    return (
        <div className="course-grid">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}

export default CourseGrid;