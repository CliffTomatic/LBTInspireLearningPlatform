import type { Course } from '../types/Course';

export const courses: Course[] = [
    {
        id: 1,
        slug: 'internet-basics',
        title: 'Internet Basics',
        description: 'Learn the basics of using the internet safely.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Beginner',
        estimatedHours: 2,
        chapters: [
            {
                id: 1,
                title: 'Getting Started',
                sections: [
                    {
                        id: 1,
                        title: 'What is the internet?',
                        type: 'video',
                        slug: 'what-is-the-internet',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 8,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'Using a web browser',
                        type: 'video',
                        slug: 'using-a-web-browser',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 10,
                    },
                ],
            },
            {
                id: 2,
                title: 'Internet Safety',
                sections: [
                    {
                        id: 3,
                        title: 'Recognizing safe websites',
                        type: 'ebook',
                        slug: 'recognizing-safe-websites',
                        durationMinutes: 12,
                        ebookContent: [
                            {
                                type: 'heading',
                                text: 'Recognizing Safe Websites',
                            },
                            {
                                type: 'paragraph',
                                text: 'A safe website is a website that protects your information and does not try to trick you into sharing passwords, payment information, or personal details.',
                            },
                            {
                                type: 'paragraph',
                                text: 'When using the internet, always slow down and check the website before typing anything important. Scammers often create fake websites that look similar to real ones.',
                            },
                            {
                                type: 'heading',
                                text: 'Signs of a Safer Website',
                            },
                            {
                                type: 'list',
                                items: [
                                    'The website address starts with https.',
                                    'The website name is spelled correctly.',
                                    'The page does not pressure you to act immediately.',
                                    'The website does not ask for personal information for no clear reason.',
                                ],
                            },
                            {
                                type: 'callout',
                                text: 'A lock icon and https are good signs, but they do not automatically mean a website is trustworthy. You still need to check the website name and the situation.',
                            },
                            {
                                type: 'heading',
                                text: 'Common Warning Signs',
                            },
                            {
                                type: 'list',
                                items: [
                                    'Misspelled website names.',
                                    'Pop-ups saying you won a prize.',
                                    'Messages saying your account will be deleted unless you act now.',
                                    'Links from unknown emails or text messages.',
                                ],
                            },
                            {
                                type: 'paragraph',
                                text: 'If something feels suspicious, do not click around to investigate. Close the page and go directly to the official website by typing the address yourself.',
                            },
                        ],
                    },
                    {
                        id: 4,
                        title: 'Avoiding suspicious links',
                        type: 'video',
                        slug: 'avoiding-suspicious-links',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        slug: 'zoom-basics',
        title: 'Zoom Basics',
        description: 'Learn how to join, mute, and use Zoom meetings.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Beginner',
        estimatedHours: 1.5,
        chapters: [
            {
                id: 1,
                title: 'Joining a Zoom Meeting',
                sections: [
                    {
                        id: 1,
                        title: 'Opening a Zoom link',
                        type: 'video',
                        slug: 'opening-a-zoom-link',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 7,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'Joining with audio and video',
                        type: 'video',
                        slug: 'joining-with-audio-and-video',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 9,
                    },
                ],
            },
            {
                id: 2,
                title: 'Using Zoom Controls',
                sections: [
                    {
                        id: 3,
                        title: 'Muting and unmuting',
                        type: 'video',
                        slug: 'muting-and-unmuting',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 8,
                    },
                    {
                        id: 4,
                        title: 'Turning camera on and off',
                        type: 'video',
                        slug: 'turning-camera-on-and-off',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 8,
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        slug: 'email-basics',
        title: 'Email Basics',
        description: 'Learn how to send, read, and organize emails.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Beginner',
        estimatedHours: 2,
        chapters: [
            {
                id: 1,
                title: 'Email Fundamentals',
                sections: [
                    {
                        id: 1,
                        title: 'What is email?',
                        type: 'video',
                        slug: 'what-is-email',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 6,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'Understanding inbox and sent mail',
                        type: 'video',
                        slug: 'understanding-inbox-and-sent-mail',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 9,
                    },
                ],
            },
            {
                id: 2,
                title: 'Sending Emails',
                sections: [
                    {
                        id: 3,
                        title: 'Writing a message',
                        type: 'video',
                        slug: 'writing-a-message',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 10,
                    },
                    {
                        id: 4,
                        title: 'Adding attachments',
                        type: 'video',
                        slug: 'adding-attachments',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 12,
                    },
                ],
            },
        ],
    },
    {
        id: 4,
        slug: 'device-basics',
        title: 'Device Basics',
        description: 'Learn how to use common computer and phone features.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Beginner',
        estimatedHours: 1.5,
        chapters: [
            {
                id: 1,
                title: 'Using Your Device',
                sections: [
                    {
                        id: 1,
                        title: 'Basic buttons and controls',
                        type: 'video',
                        slug: 'basic-buttons-and-controls',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 8,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'Opening and closing apps',
                        type: 'video',
                        slug: 'opening-and-closing-apps',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
    {
        id: 5,
        slug: 'internet-safety',
        title: 'Internet Safety',
        description:
            'Learn how to protect accounts, passwords, and personal information.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Advanced',
        estimatedHours: 2.5,
        chapters: [
            {
                id: 1,
                title: 'Protecting Your Information',
                sections: [
                    {
                        id: 1,
                        title: 'Understanding personal information',
                        type: 'video',
                        slug: 'understanding-personal-information',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 10,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'Creating stronger passwords',
                        type: 'video',
                        slug: 'creating-stronger-passwords',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 12,
                    },
                ],
            },
            {
                id: 2,
                title: 'Avoiding Online Threats',
                sections: [
                    {
                        id: 3,
                        title: 'Recognizing scams',
                        type: 'video',
                        slug: 'recognizing-scams',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 14,
                    },
                    {
                        id: 4,
                        title: 'Reporting suspicious activity',
                        type: 'video',
                        slug: 'reporting-suspicious-activity',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 9,
                    },
                ],
            },
        ],
    },
    {
        id: 6,
        slug: 'data-privacy-basics',
        title: 'Data Privacy Basics',
        description:
            'Learn how websites collect data and how to manage privacy settings.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Advanced',
        estimatedHours: 2,
        chapters: [
            {
                id: 1,
                title: 'Understanding Data Privacy',
                sections: [
                    {
                        id: 1,
                        title: 'What is personal data?',
                        type: 'video',
                        slug: 'what-is-personal-data',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 9,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'How websites collect information',
                        type: 'video',
                        slug: 'how-websites-collect-information',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 11,
                    },
                ],
            },
            {
                id: 2,
                title: 'Managing Privacy Settings',
                sections: [
                    {
                        id: 3,
                        title: 'Browser privacy settings',
                        type: 'video',
                        slug: 'browser-privacy-settings',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 13,
                    },
                    {
                        id: 4,
                        title: 'Account privacy settings',
                        type: 'video',
                        slug: 'account-privacy-settings',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
    {
        id: 7,
        slug: 'online-forms',
        title: 'Online Forms',
        description:
            'Learn how to complete online forms safely and accurately.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Advanced',
        estimatedHours: 1.5,
        chapters: [
            {
                id: 1,
                title: 'Completing Online Forms',
                sections: [
                    {
                        id: 1,
                        title: 'Reading form fields',
                        type: 'video',
                        slug: 'reading-form-fields',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 8,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'Submitting forms safely',
                        type: 'video',
                        slug: 'submitting-forms-safely',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
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
        slug: 'internet-basics',
        title: 'Internet Basics',
        description: 'Learn the basics of using the internet safely.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Beginner',
        estimatedHours: 2,
        chapters: [
            {
                id: 1,
                title: 'Getting Started',
                sections: [
                    {
                        id: 1,
                        title: 'What is the internet?',
                        type: 'video',
                        slug: 'what-is-the-internet',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 8,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'Using a web browser',
                        type: 'video',
                        slug: 'using-a-web-browser',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 10,
                    },
                ],
            },
            {
                id: 2,
                title: 'Internet Safety',
                sections: [
                    {
                        id: 3,
                        title: 'Recognizing safe websites',
                        type: 'video',
                        slug: 'recognizing-safe-websites',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 12,
                    },
                    {
                        id: 4,
                        title: 'Avoiding suspicious links',
                        type: 'video',
                        slug: 'avoiding-suspicious-links',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        slug: 'zoom-basics',
        title: 'Zoom Basics',
        description: 'Learn how to join, mute, and use Zoom meetings.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Beginner',
        estimatedHours: 1.5,
        chapters: [
            {
                id: 1,
                title: 'Joining a Zoom Meeting',
                sections: [
                    {
                        id: 1,
                        title: 'Opening a Zoom link',
                        type: 'video',
                        slug: 'opening-a-zoom-link',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 7,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'Joining with audio and video',
                        type: 'video',
                        slug: 'joining-with-audio-and-video',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 9,
                    },
                ],
            },
            {
                id: 2,
                title: 'Using Zoom Controls',
                sections: [
                    {
                        id: 3,
                        title: 'Muting and unmuting',
                        type: 'video',
                        slug: 'muting-and-unmuting',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 8,
                    },
                    {
                        id: 4,
                        title: 'Turning camera on and off',
                        type: 'video',
                        slug: 'turning-camera-on-and-off',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 8,
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        slug: 'email-basics',
        title: 'Email Basics',
        description: 'Learn how to send, read, and organize emails.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Beginner',
        estimatedHours: 2,
        chapters: [
            {
                id: 1,
                title: 'Email Fundamentals',
                sections: [
                    {
                        id: 1,
                        title: 'What is email?',
                        type: 'video',
                        slug: 'what-is-email',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 6,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'Understanding inbox and sent mail',
                        type: 'video',
                        slug: 'understanding-inbox-and-sent-mail',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 9,
                    },
                ],
            },
            {
                id: 2,
                title: 'Sending Emails',
                sections: [
                    {
                        id: 3,
                        title: 'Writing a message',
                        type: 'video',
                        slug: 'writing-a-message',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 10,
                    },
                    {
                        id: 4,
                        title: 'Adding attachments',
                        type: 'video',
                        slug: 'adding-attachments',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 12,
                    },
                ],
            },
        ],
    },
    {
        id: 4,
        slug: 'device-basics',
        title: 'Device Basics',
        description: 'Learn how to use common computer and phone features.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Beginner',
        estimatedHours: 1.5,
        chapters: [
            {
                id: 1,
                title: 'Using Your Device',
                sections: [
                    {
                        id: 1,
                        title: 'Basic buttons and controls',
                        type: 'video',
                        slug: 'basic-buttons-and-controls',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 8,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'Opening and closing apps',
                        type: 'video',
                        slug: 'opening-and-closing-apps',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
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
        slug: 'internet-safety',
        title: 'Internet Safety',
        description:
            'Learn how to protect accounts, passwords, and personal information.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Advanced',
        estimatedHours: 2.5,
        chapters: [
            {
                id: 1,
                title: 'Protecting Your Information',
                sections: [
                    {
                        id: 1,
                        title: 'Understanding personal information',
                        type: 'video',
                        slug: 'understanding-personal-information',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 10,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'Creating stronger passwords',
                        type: 'video',
                        slug: 'creating-stronger-passwords',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 12,
                    },
                ],
            },
            {
                id: 2,
                title: 'Avoiding Online Threats',
                sections: [
                    {
                        id: 3,
                        title: 'Recognizing scams',
                        type: 'video',
                        slug: 'recognizing-scams',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 14,
                    },
                    {
                        id: 4,
                        title: 'Reporting suspicious activity',
                        type: 'video',
                        slug: 'reporting-suspicious-activity',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 9,
                    },
                ],
            },
        ],
    },
    {
        id: 6,
        slug: 'data-privacy-basics',
        title: 'Data Privacy Basics',
        description:
            'Learn how websites collect data and how to manage privacy settings.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Advanced',
        estimatedHours: 2,
        chapters: [
            {
                id: 1,
                title: 'Understanding Data Privacy',
                sections: [
                    {
                        id: 1,
                        title: 'What is personal data?',
                        type: 'video',
                        slug: 'what-is-personal-data',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 9,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'How websites collect information',
                        type: 'video',
                        slug: 'how-websites-collect-information',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 11,
                    },
                ],
            },
            {
                id: 2,
                title: 'Managing Privacy Settings',
                sections: [
                    {
                        id: 3,
                        title: 'Browser privacy settings',
                        type: 'video',
                        slug: 'browser-privacy-settings',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 13,
                    },
                    {
                        id: 4,
                        title: 'Account privacy settings',
                        type: 'video',
                        slug: 'account-privacy-settings',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
    {
        id: 7,
        slug: 'online-forms',
        title: 'Online Forms',
        description:
            'Learn how to complete online forms safely and accurately.',
        thumbnailUrl: '/assets/thumbnails/Video_1_Thumbnail.png',
        level: 'Advanced',
        estimatedHours: 1.5,
        chapters: [
            {
                id: 1,
                title: 'Completing Online Forms',
                sections: [
                    {
                        id: 1,
                        title: 'Reading form fields',
                        type: 'video',
                        slug: 'reading-form-fields',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 8,
                        isPreview: true,
                    },
                    {
                        id: 2,
                        title: 'Submitting forms safely',
                        type: 'video',
                        slug: 'submitting-forms-safely',
                        videoUrl: '/assets/videos/Video_1.mp4',
                        thumbnailUrl:
                            '/assets/thumbnails/Video_1_Thumbnail.png',
                        durationMinutes: 10,
                    },
                ],
            },
        ],
    },
];
