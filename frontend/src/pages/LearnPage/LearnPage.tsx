import { Navigate, useParams } from 'react-router-dom';

import { courses } from '../../data/courses';
import LearnPlayer from '../../components/Learn/Video/LearnPlayer/LearnPlayer';
import LearnSidebar from '../../components/Learn/LearnSidebar/LearnSidebar';
import './LearnPage.css';

function LearnPage() {
    const { courseSlug, sectionSlug } = useParams();

    const selectedCourse = courses.find((course) => course.slug === courseSlug);

    if (!selectedCourse) {
        return <section className="learn-page">Course not found.</section>;
    }

    const firstSection = selectedCourse.chapters[0]?.sections[0];

    if (!firstSection) {
        return <section className="learn-page">No sections found.</section>;
    }

    if (!sectionSlug) {
        return (
            <Navigate
                to={`/learn/${selectedCourse.slug}/${firstSection.slug}`}
                replace
            />
        );
    }

    const selectedSection = selectedCourse.chapters
        .flatMap((chapter) => chapter.sections)
        .find((section) => section.slug === sectionSlug);

    if (!selectedSection) {
        return <section className="learn-page">Section not found.</section>;
    }

    return (
        <section className="learn-page">
            <div className="learn-page__content">
                <div className="learn-page__layout">
                    <LearnSidebar
                        courseSlug={selectedCourse.slug}
                        progressPercent={26}
                        courseTitle={selectedCourse.title}
                        chapters={selectedCourse.chapters}
                    />

                    <div className="learn-page__main">
                        <LearnPlayer
                            course={selectedCourse}
                            section={selectedSection}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LearnPage;
