import { useParams } from "react-router-dom";

function CourseDetailsPage() {
    const { courseSlug } = useParams();
    return (
        <>
            <h1>Course Details:</h1>
            <p>Current Course: {courseSlug}</p>
        </>
    );
}

export default CourseDetailsPage;
