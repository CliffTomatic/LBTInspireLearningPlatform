import { useState } from "react";
import type { CourseChapter } from "../../types/Course";
import "./CourseCurriculum.css";

type CourseCurriculumProps = {
    chapters: CourseChapter[];
};

export default function CourseCurriculum({ chapters }: CourseCurriculumProps) {
    const [openChapterIds, setOpenChapterIds] = useState<number[]>([1]);

    const toggleChapter = (chapterId: number) => {
        setOpenChapterIds((currentOpenIds) => {
            const isOpen = currentOpenIds.includes(chapterId);

            if (isOpen) {
                return currentOpenIds.filter((id) => id !== chapterId);
            }

            return [...currentOpenIds, chapterId];
        });
    };

    const totalSections = chapters.reduce((total, chapter) => {
        return total + chapter.sections.length;
    }, 0);

    const totalMinutes = chapters.reduce((total, chapter) => {
        const chapterMinutes = chapter.sections.reduce((sectionTotal, section) => {
            return sectionTotal + (section.durationMinutes ?? 0);
        }, 0);

        return total + chapterMinutes;
    }, 0);

    return (
        <>
            <div className="page-container">
                <section className="course-curriculum">
                    <div className="course-curriculum__header">
                        <div>
                            <h2 className="course-curriculum__title">Course Content</h2>
                            <p className="course-curriculum__subtitle">
                                {chapters.length} chapters • {totalSections} sections •{" "}
                                {totalMinutes} minutes
                            </p>
                        </div>
                    </div>

                    <div className="course-curriculum__chapter-list">
                        {chapters.map((chapter) => {
                            const isOpen = openChapterIds.includes(chapter.id);

                            const chapterMinutes = chapter.sections.reduce(
                                (total, section) => total + (section.durationMinutes ?? 0),
                                0,
                            );

                            return (
                                <article className="course-curriculum__chapter" key={chapter.id}>
                                    <button
                                        className="course-curriculum__chapter-button"
                                        type="button"
                                        onClick={() => toggleChapter(chapter.id)}
                                        aria-expanded={isOpen}
                                    >
                                        <div className="course-curriculum__chapter-left">
                                            <span className="course-curriculum__chevron">
                                                {isOpen ? "−" : "+"}
                                            </span>

                                            <span className="course-curriculum__chapter-title">
                                                {chapter.title}
                                            </span>
                                        </div>

                                        <span className="course-curriculum__chapter-meta">
                                            {chapter.sections.length} sections • {chapterMinutes} min
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <div className="course-curriculum__section-list">
                                            {chapter.sections.map((section) => (
                                                <div
                                                    className="course-curriculum__section"
                                                    key={section.id}
                                                >
                                                    <div className="course-curriculum__section-left">
                                                        <span className="course-curriculum__play-icon">—</span>

                                                        <span className="course-curriculum__section-title">
                                                            {section.title}
                                                        </span>

                                                        {section.isPreview && (
                                                            <span className="course-curriculum__preview-badge">
                                                                Preview
                                                            </span>
                                                        )}
                                                    </div>

                                                    <span className="course-curriculum__section-duration">
                                                        {section.durationMinutes} min
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>
            </div>
        </>
    );
}