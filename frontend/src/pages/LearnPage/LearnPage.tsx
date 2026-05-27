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
import LearnPageStatus from '../../components/Learn/LearnPageStatus/LearnPageStatus';
import { completeSection, getCourseProgress } from '../../services/progressApi';

function LearnPage() {
    const { courseSlug, sectionSlug } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const navigate = useNavigate();
    const { user } = useAuth();
    const { showError } = useToast();

    // Check if user is authorized/enrolled to view the course
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);
    const [canAccessCourse, setCanAccessCourse] = useState(false);

    // User Progress
    const [progressPercent, setProgressPercent] = useState(0);
    const [completedSectionIds, setCompletedSectionIds] = useState<number[]>(
        [],
    );

    // Prevent Toast from showing twice
    const hasShownAccessErrorRef = useRef(false);

    // Load Course Data
    useEffect(() => {
        let didCancel = false;

        async function loadCourseAndCheckAccess() {
            if (!courseSlug) {
                setErrorMessage('Missing course slug.');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setIsCheckingAccess(true);
                setCanAccessCourse(false);
                setErrorMessage(null);

                const course = await getCourseBySlug(courseSlug);

                // Error finding course
                if (!course) {
                    return;
                }

                if (didCancel) return;

                setSelectedCourse(course);

                const courseDetailsPath = `/courses/${course.slug}`;

                // User is not logged in
                if (!user) {
                    if (!hasShownAccessErrorRef.current) {
                        hasShownAccessErrorRef.current = true;

                        showError(
                            'Please sign in or register an account before accessing this course.',
                        );
                    }

                    navigate(courseDetailsPath, { replace: true });
                    return;
                }

                const enrollment = await getCourseEnrollmentStatus(course.slug);

                if (didCancel) return;

                // User is not enrolled
                if (!enrollment || !enrollment.isEnrolled) {
                    if (!hasShownAccessErrorRef.current) {
                        hasShownAccessErrorRef.current = true;

                        showError(
                            'Please enroll in this course before accessing the learn page.',
                        );
                    }

                    navigate(courseDetailsPath, { replace: true });
                    return;
                }

                setCanAccessCourse(true);

                // Load course progress
                await loadProgress(course);
            } catch {
                if (!didCancel) {
                    setSelectedCourse(null);
                    setCanAccessCourse(false);
                    setErrorMessage('Course not found.');
                }
            } finally {
                if (!didCancel) {
                    setIsLoading(false);
                    setIsCheckingAccess(false);
                }
            }
        }

        async function loadProgress(course: Course) {
            try {
                const progress = await getCourseProgress(course.slug);

                if (!progress) {
                    return;
                }

                setProgressPercent(progress.progressPercent);
                setCompletedSectionIds(progress.completedSectionIds);
            } catch (error) {
                setErrorMessage('Problem Loading Course Progress');
                if (error) {
                    throw new Error('Problem Loading Course Progress.', {
                        cause: error,
                    });
                }
            }
        }

        // Load course, check authentication, check enrollment status.
        loadCourseAndCheckAccess();
        // Personalize Course with User's progress

        return () => {
            didCancel = true;
        };
    }, [courseSlug, user, navigate, showError]);

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

    const selectedSectionIndex = selectedSection
        ? allSections.findIndex((section) => section.id === selectedSection.id)
        : -1;

    const previousSection =
        selectedSectionIndex > 0 ? allSections[selectedSectionIndex - 1] : null;

    const nextSection =
        selectedSectionIndex >= 0 &&
        selectedSectionIndex < allSections.length - 1
            ? allSections[selectedSectionIndex + 1]
            : null;

    const completedSectionIdSet = useMemo(() => {
        return new Set(completedSectionIds);
    }, [completedSectionIds]);

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
        return <LearnPageStatus title="Loading Course..." />;
    }

    if (!selectedCourse || isCheckingAccess) {
        return <LearnPageStatus message="Course not found." />;
    }

    if (errorMessage) {
        return <LearnPageStatus message={errorMessage} />;
    }

    const firstSection = selectedCourse.chapters[0]?.sections[0];

    if (!firstSection) {
        return <LearnPageStatus message="No sections found." />;
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
        return <LearnPageStatus message="Section not found." />;
    }

    return (
        <section className="learn-page">
            <div className="learn-page__content">
                <div className="learn-page__layout">
                    <LearnSidebar
                        courseSlug={selectedCourse.slug}
                        progressPercent={progressPercent}
                        courseTitle={selectedCourse.title}
                        chapters={selectedCourse.chapters}
                        completedSectionIdSet={completedSectionIdSet}
                    />

                    <main className="learn-page__main">
                        <LearnContentPanel
                            course={selectedCourse}
                            section={selectedSection}
                            hasNextSection={nextSection != null}
                            hasPreviousSection={previousSection != null}
                            onCompleteSection={handleCompleteSection}
                            onNextSection={handleNextSection}
                            onPreviousSection={handlePreviousSection}
                            completedSectionIdSet={completedSectionIdSet}
                        />
                    </main>
                </div>
            </div>
        </section>
    );

    // Helper Functions
    async function handleCompleteSection() {
        try {
            if (!selectedCourse || !selectedSection) {
                return;
            }

            const progress = await completeSection(
                selectedCourse.slug,
                selectedSection.id,
            );

            if (!progress) {
                return;
            }

            setProgressPercent(progress.progressPercent);
            setCompletedSectionIds(progress.completedSectionIds);
        } catch (error) {
            setErrorMessage('Problem when trying to complete section');
            if (error) {
                throw new Error('Error when completing section.', {
                    cause: error,
                });
            }
        }
    }

    // Click Handlers
    function handlePreviousSection() {
        if (!selectedCourse || !previousSection) {
            return;
        }

        navigate(`/learn/${selectedCourse.slug}/${previousSection.slug}`);
    }

    function handleNextSection() {
        if (!selectedCourse || !nextSection) {
            return;
        }

        navigate(`/learn/${selectedCourse.slug}/${nextSection.slug}`);
    }
}

export default LearnPage;
