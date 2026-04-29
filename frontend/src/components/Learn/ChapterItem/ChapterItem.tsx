import { useState } from "react";

import './ChapterItem.css';
import type { LearnChapter } from "../../../types/Learn";
import SectionCard from "../SectionCard/SectionCard";

type ChapterItemProps = {
    chapter: LearnChapter;
    courseSlug: string;
};

function ChapterItem({ chapter, courseSlug }: ChapterItemProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="chapter-item">
            <button
                className="chapter-item__button"
                type="button"
                onClick={() => setIsOpen((current) => !current)}
            >
                <span>{chapter.title}</span>
                <span className="chapter-item__icon">{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && (
                <div className="chapter-item__sections">
                    {/* Later: map section/lesson/quiz/ebook children here */}
                    {chapter.sections.map((section) => (
                        <SectionCard
                            key={section.id}
                            section={section}
                            courseSlug={courseSlug}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ChapterItem;