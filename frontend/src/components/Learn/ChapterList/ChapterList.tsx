// import type { LearnChapter } from '../../../types/Learn';
import type { CourseChapter } from "../../../types/Course";

import './ChapterList.css';
import ChapterItem from "../ChapterItem/ChapterItem";

type ChapterListProps = {
    chapters: CourseChapter[];
    courseSlug: string;
};

function ChapterList({ chapters, courseSlug }: ChapterListProps) {
    return (
        <div className="chapter-list">
            {/* Later: map real module/chapter JSON data here */}
            {chapters.map((chapter) => (
                <ChapterItem
                    key={chapter.id}
                    chapter={chapter}
                    courseSlug={courseSlug}
                />
            ))}
        </div>
    );
}

export default ChapterList;