import type { LearnChapter } from '../../../types/Learn';
import './ChapterList.css';
import ChapterItem from "../ChapterItem/ChapterItem";

type ChapterListProps = {
    chapters: LearnChapter[];
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