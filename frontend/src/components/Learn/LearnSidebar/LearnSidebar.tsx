import './LearnSidebar.css';
import ChapterList from '../ChapterList/ChapterList';
import type { CourseChapter } from '../../../types/Course';

type LearnSidebarProps = {
    courseTitle: string;
    courseSlug: string;
    progressPercent?: number;
    chapters: CourseChapter[];
};

export default function LearnSidebar({
    courseTitle,
    courseSlug,
    progressPercent = 55,
    chapters,
}: LearnSidebarProps) {
    return (
        <aside className="learn-sidebar">
            <div className="learn-sidebar__header">
                <p className="learn-sidebar__label">Current Course</p>
                <h2 className="learn-sidebar__title">{courseTitle}</h2>

                <div className="learn-sidebar__progress">
                    <div className="learn-sidebar__progress-info">
                        <span>Progress</span>
                        <span>{progressPercent}%</span>
                    </div>

                    <div className="learn-sidebar__progress-track">
                        <div
                            className="learn-sidebar__progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            <ChapterList chapters={chapters} courseSlug={courseSlug} />
        </aside>
    );
}
