import { useParams } from "react-router-dom";

function CourseDetailsPage() {
    const { courseSlug } = useParams();
    return (
        <main className="course-details">
            <h1>Course Details:</h1>
            <p>Current Course: {courseSlug}</p>
        </main>
    );
}

export default CourseDetailsPage;
