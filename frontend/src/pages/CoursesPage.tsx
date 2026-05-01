import CourseGrid from '../components/Courses/CourseGrid/CourseGrid';
// Test Data
import { testBegCourses } from '../data/courses';
import { testAdvCourses } from '../data/courses';


function CoursesPage() {
    return (
        <section className='courses'>
            <section className='page-container'>
                <h1 className="courses__title">Beginner Courses</h1>
                <CourseGrid courses={testBegCourses} />
                <h1 className="courses__title">Advanced Courses</h1>
                <CourseGrid courses={testAdvCourses} />
            </section>
        </section>
    );
}

export default CoursesPage;
