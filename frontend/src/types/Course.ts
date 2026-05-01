export interface Course {
    id: number;
    slug: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    level: "Beginner" | "Intermediate" | "Advanced";
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
    durationMinutes: number;
    isPreview?: boolean;
};

export type CourseCardProps = {
    course: Course;
};

export type CourseGridProps = {
    courses: Course[];
};