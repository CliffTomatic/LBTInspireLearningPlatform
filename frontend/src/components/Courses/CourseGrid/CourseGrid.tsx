import CourseCard from '../CourseCard/CourseCard';
import './CourseGrid.css';
import type { CourseSummary } from '../../../types/Course';

export type CourseGridProps = {
    courses: CourseSummary[];
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
