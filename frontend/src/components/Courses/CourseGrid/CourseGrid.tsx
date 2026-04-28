import type { CourseGridProps } from "../../../types/Course";
import CourseCard from "../CourseCard/CourseCard";
import './CourseGrid.css';

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