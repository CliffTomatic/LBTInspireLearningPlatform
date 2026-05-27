import './LearnContentPanel.css';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import EbookViewer from '../../EbookViewer/EbookViewer';
import type { Course, CourseSection } from '../../../../types/Course';

import './LearnContentPanel.css';
import LearnSectionControls from '../../LearnSectionControls/LearnSectionControls';

type LearnContentPanelProps = {
    course: Course;
    section: CourseSection;
    hasNextSection: boolean;
    hasPreviousSection: boolean;
    onCompleteSection: () => void;
    onNextSection: () => void;
    onPreviousSection: () => void;
    completedSectionIdSet: Set<number>;
};

export default function LearnContentPanel({
    course,
    section,
    hasNextSection,
    hasPreviousSection,
    onCompleteSection,
    onNextSection,
    onPreviousSection,
    completedSectionIdSet,
}: LearnContentPanelProps) {
    return (
        <>
            <section className="learn-content-panel">
                <div className="learn-content-panel__header">
                    <p className="learn-content-panel__course-title">
                        {course.title}
                    </p>
                    <h1 className="learn-content-panel__section-title">
                        {section.title}
                    </h1>

                    <div className="learn-content-panel__meta">
                        <span className="learn-content-panel__type">
                            {section.type}
                        </span>
                        <span>•</span>
                        {section.durationMinutes && (
                            <span>{section.durationMinutes} min</span>
                        )}
                    </div>
                </div>

                <div className="learn-content-panel__body">
                    {section.type === 'video' && (
                        <>
                            {section.videoUrl ? (
                                <VideoPlayer
                                    sectionSlug={section.slug}
                                    thumbnailUrl={section.thumbnailUrl}
                                    videoUrl={section.videoUrl}
                                />
                            ) : (
                                <p className="learn-content-panel__empty">
                                    Video not found for this section.
                                </p>
                            )}
                        </>
                    )}

                    {section.type === 'ebook' && (
                        <>
                            {section.ebookContent ? (
                                <EbookViewer content={section.ebookContent} />
                            ) : (
                                <p className="learn-content-panel__empty">
                                    Reading content not found for this section.
                                </p>
                            )}
                        </>
                    )}

                    {section.type === 'quiz' && (
                        <div className="learn-content-panel__placeholder">
                            <h2>Quiz coming soon</h2>
                            <p>
                                This section will eventually show quiz
                                questions, answers, and completion tracking.
                            </p>
                        </div>
                    )}
                </div>
            </section>
            <LearnSectionControls
                isCompleted={completedSectionIdSet.has(section.id)}
                hasPreviousSection={hasPreviousSection}
                hasNextSection={hasNextSection}
                onPreviousSection={onPreviousSection}
                onNextSection={onNextSection}
                onCompleteSection={onCompleteSection}
            />
        </>
    );
}
