import "./LearnSidebar.css";

// Types
import type { LearnChapter } from "../../../types/Learn";
import ChapterList from "../ChapterList/ChapterList";

const dummyChapters: LearnChapter[] = [
    {
        id: 1,
        title: "Getting Started",
        sections: [
            {
                id: 1,
                title: "Welcome to App Basics",
                type: "video",
                slug: "welcome-to-app-basics",
                isCompleted: true,
            },
            {
                id: 2,
                title: "What is an App?",
                type: "ebook",
                slug: "what-is-an-app",
            },
            {
                id: 3,
                title: "Getting Started Quiz",
                type: "quiz",
                slug: "getting-started-quiz",
            },
        ],
    },
    {
        id: 2,
        title: "Using Mobile Apps",
        sections: [
            {
                id: 4,
                title: "Opening and Closing Apps",
                type: "video",
                slug: "opening-and-closing-apps",
            },
            {
                id: 5,
                title: "Finding Settings",
                type: "ebook",
                slug: "finding-settings",
            },
        ],
    },
];

type LearnSidebarProps = {
    courseTitle?: string;
    courseSlug?: string;
    progressPercent?: number;
};

export default function LearnSidebar({
    courseTitle = "Course Dev Template",
    courseSlug = "course-Dev",
    progressPercent = 55,
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

            <ChapterList chapters={dummyChapters} courseSlug={courseSlug} />
        </aside>
    );
}