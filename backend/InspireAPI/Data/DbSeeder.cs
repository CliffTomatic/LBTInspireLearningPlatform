using InspireAPI.Models.Courses;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using InspireAPI.Models;

namespace InspireAPI.Data;


public static class DbSeeder
{
    public static void SeedCourses(AppDbContext db)
    {
        if (db.Courses.Any())
        {
            return;
        }

        var course = new Course
        {
            Slug = "wifi-basics",
            Title = "WiFi Basics",
            Description = "Learn what WiFi is, how to connect safely, and how to troubleshoot common internet issues.",
            ThumbnailUrl = "/assets/thumbnails/Video_1_Thumbnail.png",
            Level = CourseLevel.Beginner,
            EstimatedHours = 1.5,
            DisplayOrder = 1,
            Chapters =
            [
                new CourseChapter
                {
                    Title = "Getting Started",
                    DisplayOrder = 1,
                    Sections =
                    [
                        new CourseSection
                        {
                            Slug = "what-is-wifi",
                            Title = "What is WiFi?",
                            Type = CourseSectionType.Video,
                            DisplayOrder = 1,
                            DurationMinutes = 8,
                            IsPreview = true,
                            VideoUrl = "/assets/videos/Video_1.mp4",
                            ThumbnailUrl = "/assets/thumbnails/Video_1_Thumbnail.png"
                        },
                        new CourseSection
                        {
                            Slug = "wifi-key-terms",
                            Title = "WiFi Key Terms",
                            Type = CourseSectionType.Ebook,
                            DisplayOrder = 2,
                            DurationMinutes = 5,
                            EbookBlocks =
                            [
                                new EbookBlock
                                {
                                    Type = EbookBlockType.Heading,
                                    DisplayOrder = 1,
                                    Text = "WiFi Key Terms"
                                },
                                new EbookBlock
                                {
                                    Type = EbookBlockType.Paragraph,
                                    DisplayOrder = 2,
                                    Text = "WiFi lets your device connect to the internet without using a cable."
                                },
                                new EbookBlock
                                {
                                    Type = EbookBlockType.List,
                                    DisplayOrder = 3,
                                    ItemsJson = JsonSerializer.Serialize(new List<string>
                                    {
                                        "Network name: the WiFi name you click on.",
                                        "Password: the code used to connect.",
                                        "Router: the device that provides the WiFi signal."
                                    })
                                },
                                new EbookBlock
                                {
                                    Type = EbookBlockType.Callout,
                                    DisplayOrder = 4,
                                    Text = "Never share your home WiFi password with people you do not trust."
                                }
                            ]
                        }
                    ]
                },
                new CourseChapter
                {
                    Title = "Troubleshooting",
                    DisplayOrder = 2,
                    Sections =
                    [
                        new CourseSection
                        {
                            Slug = "fix-slow-wifi",
                            Title = "Fixing Slow WiFi",
                            Type = CourseSectionType.Video,
                            DisplayOrder = 1,
                            DurationMinutes = 10,
                            VideoUrl = "/assets/videos/Video_1.mp4",
                            ThumbnailUrl = "/assets/thumbnails/Video_1_Thumbnail.png"
                        }
                    ]
                }
            ]
        };

        db.Courses.Add(course);
        db.SaveChanges();
    }
    public static async Task SeedUsersAsync(
        UserManager<ApplicationUser> userManager
    )
    {
        if (userManager.Users.Any())
        {
            return;
        }

        var adminUser = new ApplicationUser
        {
            UserName = "admin_demo",
            Email = "admin@learnbasictech.org",
            DisplayName = "Admin Demo"
        };

        var studentUser = new ApplicationUser
        {
            UserName = "student_demo",
            Email = "student@learnbasictech.org",
            DisplayName = "Student Demo"
        };

        await userManager.CreateAsync(
            adminUser,
            "Admin123!"
        );

        await userManager.CreateAsync(
            studentUser,
            "Student123!"
        );
    }
}