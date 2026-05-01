import type { Course } from "../types/Course";

export const courses: Course[] = [
    {
        id: 1,
        slug: "internet-basics",
        title: "Internet Basics",
        description: "Learn the basics of using the internet safely.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Beginner",
        estimatedHours: 2,
        chapters: [
            {
                id: 1,
                title: "Getting Started",
                sections: [
                    {
                        id: 1,
                        title: "What is the internet?",
                        type: "video",
                        slug: "what-is-the-internet",
                        durationMinutes: 8,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Using a web browser",
                        type: "video",
                        slug: "using-a-web-browser",
                        durationMinutes: 10,
                    },
                ],
            },
            {
                id: 2,
                title: "Internet Safety",
                sections: [
                    {
                        id: 3,
                        title: "Recognizing safe websites",
                        type: "video",
                        slug: "recognizing-safe-websites",
                        durationMinutes: 12,
                    },
                    {
                        id: 4,
                        title: "Avoiding suspicious links",
                        type: "video",
                        slug: "avoiding-suspicious-links",
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        slug: "zoom-basics",
        title: "Zoom Basics",
        description: "Learn how to join, mute, and use Zoom meetings.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Beginner",
        estimatedHours: 1.5,
        chapters: [
            {
                id: 1,
                title: "Joining a Zoom Meeting",
                sections: [
                    {
                        id: 1,
                        title: "Opening a Zoom link",
                        type: "video",
                        slug: "opening-a-zoom-link",
                        durationMinutes: 7,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Joining with audio and video",
                        type: "video",
                        slug: "joining-with-audio-and-video",
                        durationMinutes: 9,
                    },
                ],
            },
            {
                id: 2,
                title: "Using Zoom Controls",
                sections: [
                    {
                        id: 3,
                        title: "Muting and unmuting",
                        type: "video",
                        slug: "muting-and-unmuting",
                        durationMinutes: 8,
                    },
                    {
                        id: 4,
                        title: "Turning camera on and off",
                        type: "video",
                        slug: "turning-camera-on-and-off",
                        durationMinutes: 8,
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        slug: "email-basics",
        title: "Email Basics",
        description: "Learn how to send, read, and organize emails.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Beginner",
        estimatedHours: 2,
        chapters: [
            {
                id: 1,
                title: "Email Fundamentals",
                sections: [
                    {
                        id: 1,
                        title: "What is email?",
                        type: "video",
                        slug: "what-is-email",
                        durationMinutes: 6,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Understanding inbox and sent mail",
                        type: "video",
                        slug: "understanding-inbox-and-sent-mail",
                        durationMinutes: 9,
                    },
                ],
            },
            {
                id: 2,
                title: "Sending Emails",
                sections: [
                    {
                        id: 3,
                        title: "Writing a message",
                        type: "video",
                        slug: "writing-a-message",
                        durationMinutes: 10,
                    },
                    {
                        id: 4,
                        title: "Adding attachments",
                        type: "video",
                        slug: "adding-attachments",
                        durationMinutes: 12,
                    },
                ],
            },
        ],
    },
    {
        id: 4,
        slug: "device-basics",
        title: "Device Basics",
        description: "Learn how to use common computer and phone features.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Beginner",
        estimatedHours: 1.5,
        chapters: [
            {
                id: 1,
                title: "Using Your Device",
                sections: [
                    {
                        id: 1,
                        title: "Basic buttons and controls",
                        type: "video",
                        slug: "basic-buttons-and-controls",
                        durationMinutes: 8,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Opening and closing apps",
                        type: "video",
                        slug: "opening-and-closing-apps",
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
    {
        id: 5,
        slug: "internet-safety",
        title: "Internet Safety",
        description: "Learn how to protect accounts, passwords, and personal information.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Advanced",
        estimatedHours: 2.5,
        chapters: [
            {
                id: 1,
                title: "Protecting Your Information",
                sections: [
                    {
                        id: 1,
                        title: "Understanding personal information",
                        type: "video",
                        slug: "understanding-personal-information",
                        durationMinutes: 10,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Creating stronger passwords",
                        type: "video",
                        slug: "creating-stronger-passwords",
                        durationMinutes: 12,
                    },
                ],
            },
            {
                id: 2,
                title: "Avoiding Online Threats",
                sections: [
                    {
                        id: 3,
                        title: "Recognizing scams",
                        type: "video",
                        slug: "recognizing-scams",
                        durationMinutes: 14,
                    },
                    {
                        id: 4,
                        title: "Reporting suspicious activity",
                        type: "video",
                        slug: "reporting-suspicious-activity",
                        durationMinutes: 9,
                    },
                ],
            },
        ],
    },
    {
        id: 6,
        slug: "data-privacy-basics",
        title: "Data Privacy Basics",
        description: "Learn how websites collect data and how to manage privacy settings.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Advanced",
        estimatedHours: 2,
        chapters: [
            {
                id: 1,
                title: "Understanding Data Privacy",
                sections: [
                    {
                        id: 1,
                        title: "What is personal data?",
                        type: "video",
                        slug: "what-is-personal-data",
                        durationMinutes: 9,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "How websites collect information",
                        type: "video",
                        slug: "how-websites-collect-information",
                        durationMinutes: 11,
                    },
                ],
            },
            {
                id: 2,
                title: "Managing Privacy Settings",
                sections: [
                    {
                        id: 3,
                        title: "Browser privacy settings",
                        type: "video",
                        slug: "browser-privacy-settings",
                        durationMinutes: 13,
                    },
                    {
                        id: 4,
                        title: "Account privacy settings",
                        type: "video",
                        slug: "account-privacy-settings",
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
    {
        id: 7,
        slug: "online-forms",
        title: "Online Forms",
        description: "Learn how to complete online forms safely and accurately.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Advanced",
        estimatedHours: 1.5,
        chapters: [
            {
                id: 1,
                title: "Completing Online Forms",
                sections: [
                    {
                        id: 1,
                        title: "Reading form fields",
                        type: "video",
                        slug: "reading-form-fields",
                        durationMinutes: 8,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Submitting forms safely",
                        type: "video",
                        slug: "submitting-forms-safely",
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
];

export const testBegCourses: Course[] = [
    {
        id: 1,
        slug: "internet-basics",
        title: "Internet Basics",
        description: "Learn the basics of using the internet safely.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Beginner",
        estimatedHours: 2,
        chapters: [
            {
                id: 1,
                title: "Getting Started",
                sections: [
                    {
                        id: 1,
                        title: "What is the internet?",
                        type: "video",
                        slug: "what-is-the-internet",
                        durationMinutes: 8,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Using a web browser",
                        type: "video",
                        slug: "using-a-web-browser",
                        durationMinutes: 10,
                    },
                ],
            },
            {
                id: 2,
                title: "Internet Safety",
                sections: [
                    {
                        id: 3,
                        title: "Recognizing safe websites",
                        type: "video",
                        slug: "recognizing-safe-websites",
                        durationMinutes: 12,
                    },
                    {
                        id: 4,
                        title: "Avoiding suspicious links",
                        type: "video",
                        slug: "avoiding-suspicious-links",
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        slug: "zoom-basics",
        title: "Zoom Basics",
        description: "Learn how to join, mute, and use Zoom meetings.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Beginner",
        estimatedHours: 1.5,
        chapters: [
            {
                id: 1,
                title: "Joining a Zoom Meeting",
                sections: [
                    {
                        id: 1,
                        title: "Opening a Zoom link",
                        type: "video",
                        slug: "opening-a-zoom-link",
                        durationMinutes: 7,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Joining with audio and video",
                        type: "video",
                        slug: "joining-with-audio-and-video",
                        durationMinutes: 9,
                    },
                ],
            },
            {
                id: 2,
                title: "Using Zoom Controls",
                sections: [
                    {
                        id: 3,
                        title: "Muting and unmuting",
                        type: "video",
                        slug: "muting-and-unmuting",
                        durationMinutes: 8,
                    },
                    {
                        id: 4,
                        title: "Turning camera on and off",
                        type: "video",
                        slug: "turning-camera-on-and-off",
                        durationMinutes: 8,
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        slug: "email-basics",
        title: "Email Basics",
        description: "Learn how to send, read, and organize emails.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Beginner",
        estimatedHours: 2,
        chapters: [
            {
                id: 1,
                title: "Email Fundamentals",
                sections: [
                    {
                        id: 1,
                        title: "What is email?",
                        type: "video",
                        slug: "what-is-email",
                        durationMinutes: 6,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Understanding inbox and sent mail",
                        type: "video",
                        slug: "understanding-inbox-and-sent-mail",
                        durationMinutes: 9,
                    },
                ],
            },
            {
                id: 2,
                title: "Sending Emails",
                sections: [
                    {
                        id: 3,
                        title: "Writing a message",
                        type: "video",
                        slug: "writing-a-message",
                        durationMinutes: 10,
                    },
                    {
                        id: 4,
                        title: "Adding attachments",
                        type: "video",
                        slug: "adding-attachments",
                        durationMinutes: 12,
                    },
                ],
            },
        ],
    },
    {
        id: 4,
        slug: "device-basics",
        title: "Device Basics",
        description: "Learn how to use common computer and phone features.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Beginner",
        estimatedHours: 1.5,
        chapters: [
            {
                id: 1,
                title: "Using Your Device",
                sections: [
                    {
                        id: 1,
                        title: "Basic buttons and controls",
                        type: "video",
                        slug: "basic-buttons-and-controls",
                        durationMinutes: 8,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Opening and closing apps",
                        type: "video",
                        slug: "opening-and-closing-apps",
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
];

export const testAdvCourses: Course[] = [
    {
        id: 5,
        slug: "internet-safety",
        title: "Internet Safety",
        description: "Learn how to protect accounts, passwords, and personal information.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Advanced",
        estimatedHours: 2.5,
        chapters: [
            {
                id: 1,
                title: "Protecting Your Information",
                sections: [
                    {
                        id: 1,
                        title: "Understanding personal information",
                        type: "video",
                        slug: "understanding-personal-information",
                        durationMinutes: 10,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Creating stronger passwords",
                        type: "video",
                        slug: "creating-stronger-passwords",
                        durationMinutes: 12,
                    },
                ],
            },
            {
                id: 2,
                title: "Avoiding Online Threats",
                sections: [
                    {
                        id: 3,
                        title: "Recognizing scams",
                        type: "video",
                        slug: "recognizing-scams",
                        durationMinutes: 14,
                    },
                    {
                        id: 4,
                        title: "Reporting suspicious activity",
                        type: "video",
                        slug: "reporting-suspicious-activity",
                        durationMinutes: 9,
                    },
                ],
            },
        ],
    },
    {
        id: 6,
        slug: "data-privacy-basics",
        title: "Data Privacy Basics",
        description: "Learn how websites collect data and how to manage privacy settings.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Advanced",
        estimatedHours: 2,
        chapters: [
            {
                id: 1,
                title: "Understanding Data Privacy",
                sections: [
                    {
                        id: 1,
                        title: "What is personal data?",
                        type: "video",
                        slug: "what-is-personal-data",
                        durationMinutes: 9,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "How websites collect information",
                        type: "video",
                        slug: "how-websites-collect-information",
                        durationMinutes: 11,
                    },
                ],
            },
            {
                id: 2,
                title: "Managing Privacy Settings",
                sections: [
                    {
                        id: 3,
                        title: "Browser privacy settings",
                        type: "video",
                        slug: "browser-privacy-settings",
                        durationMinutes: 13,
                    },
                    {
                        id: 4,
                        title: "Account privacy settings",
                        type: "video",
                        slug: "account-privacy-settings",
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
    {
        id: 7,
        slug: "online-forms",
        title: "Online Forms",
        description: "Learn how to complete online forms safely and accurately.",
        thumbnailUrl: "/assets/thumbnails/Video_1_Thumbnail.png",
        level: "Advanced",
        estimatedHours: 1.5,
        chapters: [
            {
                id: 1,
                title: "Completing Online Forms",
                sections: [
                    {
                        id: 1,
                        title: "Reading form fields",
                        type: "video",
                        slug: "reading-form-fields",
                        durationMinutes: 8,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: "Submitting forms safely",
                        type: "video",
                        slug: "submitting-forms-safely",
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
];