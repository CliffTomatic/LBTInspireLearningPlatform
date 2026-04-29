export interface Course {
    id: number;
    slug: string;
    title: string;
    description: string;
    thumbnailUrl: string;
}

export type CourseCardProps = {
    course: Course;
};

export type CourseGridProps = {
    courses: Course[];
};