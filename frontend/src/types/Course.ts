export type CourseSectionType = 'video' | 'ebook' | 'quiz';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

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

export type EbookBlock =
    | {
          type: 'heading';
          text: string;
          items?: never;
      }
    | {
          type: 'paragraph';
          text: string;
          items?: never;
      }
    | {
          type: 'list';
          text?: never;
          items: string[];
      }
    | {
          type: 'callout';
          text: string;
          items?: never;
      };

export type CourseSection = {
    id: number;
    title: string;
    type: CourseSectionType;
    slug: string;

    durationMinutes?: number;
    isPreview: boolean;

    videoUrl?: string;
    thumbnailUrl?: string;

    ebookContent: EbookBlock[];
};
