import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

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
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/Toast/useToast';
import { getCourseEnrollmentStatus } from '../../services/courseEnrollmentService';

function LearnPage() {
    const { courseSlug, sectionSlug } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const navigate = useNavigate();
    const { user } = useAuth();
    const { showError } = useToast();

    const [isCheckingAccess, setIsCheckingAccess] = useState(true);
    const [canAccessCourse, setCanAccessCourse] = useState(false);

    const hasRedirectedRef = useRef(false);

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

        hasRedirectedRef.current = false;
        loadCourse();
    }, [courseSlug]);

    useEffect(() => {
        async function checkCourseAccess() {
            if (isLoading || errorMessage || !selectedCourse) {
                return;
            }

            const courseDetailsPath = `/courses/${selectedCourse.slug}`;

            if (!user) {
                if (!hasRedirectedRef.current) {
                    hasRedirectedRef.current = true;

                    showError(
                        'Please sign in or register an account before accessing this course.',
                    );

                    navigate(courseDetailsPath, { replace: true });
                }

                return;
            }

            try {
                setIsCheckingAccess(true);
                setCanAccessCourse(false);

                const enrollment = await getCourseEnrollmentStatus(
                    selectedCourse.slug,
                );

                // User is not enrolled
                if (!enrollment || !enrollment.isEnrolled) {
                    if (!hasRedirectedRef.current) {
                        hasRedirectedRef.current = true;

                        showError(
                            'Please enroll in this course before accessing the learn page.',
                        );

                        navigate(courseDetailsPath, { replace: true });
                    }

                    return;
                }

                setCanAccessCourse(true);
            } catch {
                if (!hasRedirectedRef.current) {
                    hasRedirectedRef.current = true;

                    showError('Could not verify course access.');

                    navigate(courseDetailsPath, { replace: true });
                }
            } finally {
                setIsCheckingAccess(false);
            }
        }

        checkCourseAccess();
    }, [isLoading, errorMessage, selectedCourse, user, navigate, showError]);

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
            isCheckingAccess ||
            !canAccessCourse ||
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
        isCheckingAccess,
        canAccessCourse,
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
    // TODO: If user visits an invalid course, it stays on this page.
    // TODO: Problem ^ "isCheckingAccess"
    if (isLoading) {
        return <section className="learn-page">Loading course...</section>;
    }

    if (!selectedCourse || errorMessage || isCheckingAccess) {
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
