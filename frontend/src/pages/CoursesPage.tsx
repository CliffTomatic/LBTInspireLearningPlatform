import CourseGrid from '../components/Courses/CourseGrid/CourseGrid';
import type { Course } from '../types/Course';
// Test Data
const testBegCourses: Course[] = [
    {
        id: 1,
        slug: "internet-basics",
        title: "Internet Basics",
        description: "Learn the basics of using the internet safely.",
        thumbnailUrl: "http://localhost:5173/public/assets/thumbnails/Video_1_Thumbnail.png",
    },
    {
        id: 2,
        slug: "zoom-basics",
        title: "Zoom Basics",
        description: "Learn how to join, mute, and use Zoom meetings.",
        thumbnailUrl: "http://localhost:5173/public/assets/thumbnails/Video_1_Thumbnail.png",
    },
    {
        id: 3,
        slug: "email-basics",
        title: "Email Basics",
        description: "Learn how to send, read, and organize emails.",
        thumbnailUrl: "http://localhost:5173/public/assets/thumbnails/Video_1_Thumbnail.png",
    },
    {
        id: 3,
        slug: "email-basics",
        title: "Email Basics",
        description: "Learn how to send, read, and organize emails.",
        thumbnailUrl: "http://localhost:5173/public/assets/thumbnails/Video_1_Thumbnail.png",
    },
];
const testAdvCourses: Course[] = [
    {
        id: 1,
        slug: "internet-basics",
        title: "Internet Basics",
        description: "Learn the basics of using the internet safely.",
        thumbnailUrl: "http://localhost:5173/public/assets/thumbnails/Video_1_Thumbnail.png",
    },
    {
        id: 2,
        slug: "zoom-basics",
        title: "Zoom Basics",
        description: "Learn how to join, mute, and use Zoom meetings.",
        thumbnailUrl: "http://localhost:5173/public/assets/thumbnails/Video_1_Thumbnail.png",
    },
    {
        id: 3,
        slug: "email-basics",
        title: "Email Basics",
        description: "Learn how to send, read, and organize emails.",
        thumbnailUrl: "http://localhost:5173/public/assets/thumbnails/Video_1_Thumbnail.png",
    },
];


function CoursesPage() {
    return (
        <>
            <h1 className="courses__title">Beginner Courses</h1>
            <CourseGrid courses={testBegCourses} />
            <h1 className="courses__title">Advanced Courses</h1>
            <CourseGrid courses={testAdvCourses} />
        </>
    );
}

export default CoursesPage;
