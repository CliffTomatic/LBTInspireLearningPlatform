import type { Course } from "../types/Course";

export const courses: Course[] = [
    {
        id: 1,
        title: "Internet Basics",
        slug: "internet-basics",
        description:
            "Learn how the internet works, how to browse safely, and how to use common online tools with confidence.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Beginner",
        estimatedHours: 2,
        chapters: [
            {
                id: 1,
                title: "Getting Started with the Internet",
                sections: [
                    {
                        id: 1,
                        title: "What is the internet?",
                        durationMinutes: 8,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Understanding websites and browsers",
                        durationMinutes: 12,
                    },
                    {
                        id: 3,
                        title: "Common internet terms",
                        durationMinutes: 10,
                    },
                ],
            },
            {
                id: 2,
                title: "Browsing Safely",
                sections: [
                    {
                        id: 4,
                        title: "Recognizing safe websites",
                        durationMinutes: 14,
                    },
                    {
                        id: 5,
                        title: "Avoiding suspicious links",
                        durationMinutes: 11,
                    },
                ],
            },
            {
                id: 3,
                title: "Using Online Tools",
                sections: [
                    {
                        id: 6,
                        title: "Searching for information",
                        durationMinutes: 9,
                    },
                    {
                        id: 7,
                        title: "Downloading and uploading files",
                        durationMinutes: 13,
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        title: "Email Basics",
        slug: "email-basics",
        description:
            "Learn how to create, send, organize, and protect your email account.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Beginner",
        estimatedHours: 1.5,
        chapters: [
            {
                id: 1,
                title: "Introduction to Email",
                sections: [
                    {
                        id: 1,
                        title: "What is email?",
                        durationMinutes: 7,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Parts of an email address",
                        durationMinutes: 8,
                    },
                ],
            },
            {
                id: 2,
                title: "Sending and Receiving Messages",
                sections: [
                    {
                        id: 3,
                        title: "Writing a clear email",
                        durationMinutes: 10,
                    },
                    {
                        id: 4,
                        title: "Adding attachments",
                        durationMinutes: 12,
                    },
                ],
            },
        ],
    },
];