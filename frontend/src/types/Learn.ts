export type LearnSectionType = "video" | "ebook" | "quiz";

export type LearnSection = {
    id: number;
    title: string;
    type: LearnSectionType;
    slug: string;
    isCompleted?: boolean;
};

export type LearnChapter = {
    id: number;
    title: string;
    sections: LearnSection[];
};