import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import LearnContentPanel from '../../components/Learn/Video/LearnContentPanel/LearnContentPanel';
import LearnSidebar from '../../components/Learn/LearnSidebar/LearnSidebar';

import { getCourseBySlug } from '../../services/courseService';

import type { Course } from '../../types/Course';
import type { CourseSection } from '../../types/Course';

import './LearnPage.css';

function LearnPage() {
    const { courseSlug, sectionSlug } = useParams();

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        async function loadCourse() {
            if (!courseSlug) {
                setErrorMessage('Missing course slug.');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);

                const course = await getCourseBySlug(courseSlug);

                setSelectedCourse(course);

                setErrorMessage(null);
            } catch {
                setSelectedCourse(null);
                setErrorMessage('Course not found.');
            } finally {
                setIsLoading(false);
            }
        }

        loadCourse();
    }, [courseSlug]);

    const allSections = useMemo(() => {
        if (!selectedCourse) {
            return [];
        }

        return selectedCourse.chapters.flatMap((chapter) => chapter.sections);
    }, [selectedCourse]);

    const selectedSection = useMemo<CourseSection | null>(() => {
        if (!sectionSlug) {
            return null;
        }

        return (
            allSections.find((section) => section.slug === sectionSlug) ?? null
        );
    }, [allSections, sectionSlug]);

    if (isLoading) {
        return <section className="learn-page">Loading course...</section>;
    }

    if (!selectedCourse || errorMessage) {
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

                    <main className="learn-page__main">
                        <LearnContentPanel
                            course={selectedCourse}
                            section={selectedSection}
                        />
                    </main>
                </div>
            </div>
        </section>
    );
}

export default LearnPage;
