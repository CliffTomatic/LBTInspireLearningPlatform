import CourseGrid from '../components/Courses/CourseGrid/CourseGrid';
import type { Course } from '../types/Course';
// Test Data
const testCourses: Course[] = [
    {
        id: 1,
        slug: "internet-basics",
        title: "Internet Basics",
        description: "Learn the basics of using the internet safely.",
        thumbnailUrl: "",
    },
    {
        id: 2,
        slug: "zoom-basics",
        title: "Zoom Basics",
        description: "Learn how to join, mute, and use Zoom meetings.",
        thumbnailUrl: "",
    },
    {
        id: 3,
        slug: "email-basics",
        title: "Email Basics",
        description: "Learn how to send, read, and organize emails.",
        thumbnailUrl: "",
    },
];


function CoursesPage() {
    return (
        <main className="courses">
            <h1 className="courses__title">Beginner Courses</h1>
            <CourseGrid courses={testCourses} />
            <h1 className="courses__title">Advanced Courses</h1>
        </main>
    );
}

export default CoursesPage;
