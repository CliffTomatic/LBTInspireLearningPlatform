import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { useSectionSessionTracking } from '../../hooks/useSectionSessionTracking';

import LearnContentPanel from '../../components/Learn/Video/LearnContentPanel/LearnContentPanel';
import LearnSidebar from '../../components/Learn/LearnSidebar/LearnSidebar';

import {
    getCourseBySlug,
    getChapterBySectionSlug,
    getAllSections,
    getSectionBySlugFromSections,
} from '../../utils/courseSelection';

import type { Course } from '../../types/Course';

import './LearnPage.css';

// TODO: Send client to course details page of the course they're trying to view
//       if they are not enrolled. (Check with backend)

function LearnPage() {
    const { courseSlug, sectionSlug } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    // Load Course Data
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

    // Memos
    const allSections = useMemo(
        () => getAllSections(selectedCourse),
        [selectedCourse],
    );

    const selectedChapter = useMemo(
        () => getChapterBySectionSlug(selectedCourse, sectionSlug),
        [selectedCourse, sectionSlug],
    );

    const selectedSection = useMemo(
        () => getSectionBySlugFromSections(allSections, sectionSlug),
        [allSections, sectionSlug],
    );

    // Hook - StartSession/Heartbeat
    const sessionTarget = useMemo(() => {
        if (
            isLoading ||
            errorMessage ||
            !sectionSlug ||
            !selectedCourse ||
            !selectedChapter ||
            !selectedSection
        ) {
            return null;
        }

        return {
            courseId: selectedCourse.id,
            chapterId: selectedChapter.id,
            sectionId: selectedSection.id,
        };
    }, [
        isLoading,
        errorMessage,
        sectionSlug,
        selectedCourse,
        selectedChapter,
        selectedSection,
    ]);

    const { sessionInfo, isSessionStarting, sessionError } =
        useSectionSessionTracking({
            sessionTarget,
            heartbeatMs: 15000,
        });

    console.debug(sessionInfo, isSessionStarting, sessionError);

    // DOM
    // TODO: Create default error page.
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
