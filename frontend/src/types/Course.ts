export type CourseSectionType = "video" | "ebook" | "quiz";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Course {
    id: number;
    slug: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    level: CourseLevel;
    estimatedHours: number;
    chapters: CourseChapter[];
}

export type CourseChapter = {
    id: number;
    title: string;
    sections: CourseSection[];
};

export type CourseSection = {
    id: number;
    title: string;
    type: CourseSectionType;
    slug: string;

    durationMinutes?: number;
    isPreview?: boolean;
    isCompleted?: boolean;
};

export type CourseCardProps = {
    course: Course;
};

export type CourseGridProps = {
    courses: Course[];
};