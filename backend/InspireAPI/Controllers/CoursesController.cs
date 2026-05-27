using InspireAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using InspireAPI.Models.Progress;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using InspireAPI.Models.Auth;
using InspireAPI.Models.Courses;

namespace InspireAPI.Controllers;

// TODO: Move logic into service

[ApiController]
[Route("api/courses")]
public class CoursesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CoursesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetCourses()
    {
        var courses = await _db.Courses
            .Where(course => course.IsPublished)
            .OrderBy(course => course.DisplayOrder)
            .Select(course => new
            {
                course.Id,
                course.Slug,
                course.Title,
                course.Description,
                course.ThumbnailUrl,
                Level = course.Level.ToString(),
                course.EstimatedHours
            })
            .ToListAsync();

        return Ok(courses);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetCourseBySlug(string slug)
    {
        var course = await _db.Courses
            .Where(course => course.Slug == slug && course.IsPublished)
            .Include(course => course.Chapters.OrderBy(chapter => chapter.DisplayOrder))
                .ThenInclude(chapter => chapter.Sections.OrderBy(section => section.DisplayOrder))
                    .ThenInclude(section => section.EbookBlocks.OrderBy(block => block.DisplayOrder))
            .FirstOrDefaultAsync();

        if (course == null)
        {
            return NotFound(new { message = "Course not found." });
        }

        return Ok(new
        {
            course.Id,
            course.Slug,
            course.Title,
            course.Description,
            course.ThumbnailUrl,
            Level = course.Level.ToString(),
            course.EstimatedHours,

            Chapters = course.Chapters
                .OrderBy(chapter => chapter.DisplayOrder)
                .Select(chapter => new
                {
                    chapter.Id,
                    chapter.Title,

                    Sections = chapter.Sections
                        .OrderBy(section => section.DisplayOrder)
                        .Select(section => new
                        {
                            section.Id,
                            section.Title,
                            Type = section.Type.ToString().ToLower(),
                            section.Slug,
                            section.DurationMinutes,
                            section.IsPreview,
                            section.VideoUrl,
                            section.ThumbnailUrl,

                            EbookContent = section.EbookBlocks
                                .OrderBy(block => block.DisplayOrder)
                                .Select(block => new
                                {
                                    Type = block.Type.ToString().ToLower(),
                                    block.Text,
                                    Items = block.ItemsJson == null
                                        ? null
                                        : System.Text.Json.JsonSerializer
                                            .Deserialize<List<string>>(block.ItemsJson)
                                })
                        })
                })
        });
    }

    [Authorize]
    [HttpGet("{slug}/progress")]
    public async Task<IActionResult> GetCourseProgress(string slug)
    {
        var userId = GetUserId();

        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid or missing token." });
        }

        var course = await _db.Courses
            .Include(course => course.Chapters)
            .ThenInclude(chapter => chapter.Sections)
            .FirstOrDefaultAsync(course =>
                course.Slug == slug &&
                course.IsPublished);

        if (course == null)
        {
            return NotFound(new { message = "Course not found." });
        }

        var progressStatus = await BuildCourseProgressStatus(userId, course);

        return Ok(progressStatus);
    }

    // Marks one section as completed and updates the user course progress
    [Authorize]
    [HttpPost("{slug}/sections/{sectionId:int}/complete")]
    public async Task<IActionResult> CompleteSection(
    string slug,
    int sectionId)
    {
        var userId = GetUserId();

        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid or missing token." });
        }

        var course = await _db.Courses
            .Include(course => course.Chapters)
            .ThenInclude(chapter => chapter.Sections)
            .FirstOrDefaultAsync(course =>
                course.Slug == slug &&
                course.IsPublished);

        if (course == null)
        {
            return NotFound(new { message = "Course not found." });
        }

        var sectionExistsInCourse = course.Chapters
            .SelectMany(chapter => chapter.Sections)
            .Any(section => section.Id == sectionId);

        if (!sectionExistsInCourse)
        {
            return NotFound(new
            {
                message = "Section not found in this course."
            });
        }

        var courseProgress = await _db.UserCourseProgresses
            .FirstOrDefaultAsync(progress =>
                progress.UserId == userId &&
                progress.CourseId == course.Id);

        if (courseProgress == null)
        {
            return BadRequest(new
            {
                message = "You must enroll in this course before completing sections."
            });
        }

        var now = DateTime.UtcNow;

        var sectionProgress = await _db.UserSectionProgresses
            .FirstOrDefaultAsync(progress =>
                progress.UserId == userId &&
                progress.CourseId == course.Id &&
                progress.SectionId == sectionId);

        if (sectionProgress == null)
        {
            sectionProgress = new UserSectionProgress
            {
                UserId = userId,
                CourseId = course.Id,
                SectionId = sectionId,
                StartedAt = now,
                LastAccessedAt = now,
                CompletedAt = now,
                LastPositionSeconds = 0,
                ActiveSecondsWatched = 0,
                IsCompleted = true
            };

            _db.UserSectionProgresses.Add(sectionProgress);
        }
        else
        {
            sectionProgress.LastAccessedAt = now;

            if (!sectionProgress.IsCompleted)
            {
                sectionProgress.IsCompleted = true;
                sectionProgress.CompletedAt = now;
            }
        }

        var totalSections = course.Chapters
            .SelectMany(chapter => chapter.Sections)
            .Count();

        var completedSectionCount = await _db.UserSectionProgresses
            .CountAsync(progress =>
                progress.UserId == userId &&
                progress.CourseId == course.Id &&
                progress.IsCompleted);

        var progressPercent = totalSections == 0
            ? 0
            : (int)Math.Round(
                completedSectionCount / (double)totalSections * 100);

        courseProgress.LastAccessedAt = now;
        courseProgress.LastSectionId = sectionId;
        courseProgress.CompletedSectionCount = completedSectionCount;
        courseProgress.ProgressPercent = progressPercent;

        if (totalSections > 0 && completedSectionCount == totalSections)
        {
            courseProgress.CompletedAt ??= now;
        }
        else
        {
            courseProgress.CompletedAt = null;
        }

        await _db.SaveChangesAsync();

        var progressStatus = await BuildCourseProgressStatus(userId, course);

        progressStatus.Message = "Section completed.";

        return Ok(progressStatus);
    }

    [Authorize]
    [HttpGet("{slug}/enrollment")]
    public async Task<IActionResult> GetEnrollmentStatus(string slug)
    {
        var userId = GetUserId();

        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid or missing token." });
        }

        var course = await _db.Courses
            .FirstOrDefaultAsync(c => c.Slug == slug && c.IsPublished);

        if (course == null)
        {
            return NotFound(new { message = "Course not found." });
        }

        var isEnrolled = await _db.UserCourseProgresses
            .AnyAsync(progress =>
                progress.UserId == userId &&
                progress.CourseId == course.Id);

        return Ok(new
        {
            courseId = course.Id,
            courseSlug = course.Slug,
            isEnrolled
        });
    }

    [Authorize]
    [HttpPost("{slug}/enroll")]
    public async Task<IActionResult> EnrollInCourse(string slug)
    {
        var userId = GetUserId();

        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid or missing token." });
        }

        var course = await _db.Courses
            .FirstOrDefaultAsync(c => c.Slug == slug && c.IsPublished);

        if (course == null)
        {
            return NotFound(new { message = "Course not found." });
        }

        var existingProgress = await _db.UserCourseProgresses
            .FirstOrDefaultAsync(progress =>
                progress.UserId == userId &&
                progress.CourseId == course.Id);

        if (existingProgress != null)
        {
            return Ok(new
            {
                message = "Already enrolled.",
                courseId = course.Id,
                courseSlug = course.Slug,
                isEnrolled = true
            });
        }

        var now = DateTime.UtcNow;

        var courseProgress = new UserCourseProgress
        {
            UserId = userId,
            CourseId = course.Id,
            StartedAt = now,
            LastAccessedAt = now,
            LastSectionId = null,
            TotalActiveSeconds = 0,
            ProgressPercent = 0,
            CompletedSectionCount = 0,
            CompletedAt = null
        };

        _db.UserCourseProgresses.Add(courseProgress);
        await _db.SaveChangesAsync();

        return Ok(new UserEnrollmentStatusDto
        {
            Message = "Enrollment successful.",
            CourseId = course.Id,
            CourseSlug = course.Slug,
            IsEnrolled = true
        });
    }

    private string? GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
    }

    // Helper Functions
    private async Task<CourseProgressStatusDto> BuildCourseProgressStatus(
    string userId,
    Course course)
    {
        var totalSections = course.Chapters
            .SelectMany(chapter => chapter.Sections)
            .Count();

        var courseProgress = await _db.UserCourseProgresses
            .FirstOrDefaultAsync(progress =>
                progress.UserId == userId &&
                progress.CourseId == course.Id);

        if (courseProgress == null)
        {
            return new CourseProgressStatusDto
            {
                Message = "Not enrolled.",
                CourseId = course.Id,
                CourseSlug = course.Slug,
                IsEnrolled = false,
                TotalSections = totalSections,
                CompletedSectionCount = 0,
                ProgressPercent = 0,
                CompletedSectionIds = []
            };
        }

        var completedSectionIds = await _db.UserSectionProgresses
            .Where(progress =>
                progress.UserId == userId &&
                progress.CourseId == course.Id &&
                progress.IsCompleted)
            .Select(progress => progress.SectionId)
            .ToListAsync();

        var completedSectionCount = completedSectionIds.Count;

        var progressPercent = totalSections == 0
            ? 0
            : (int)Math.Round(
                completedSectionCount / (double)totalSections * 100);

        return new CourseProgressStatusDto
        {
            Message = "Progress loaded.",
            CourseId = course.Id,
            CourseSlug = course.Slug,
            IsEnrolled = true,
            TotalSections = totalSections,
            CompletedSectionCount = completedSectionCount,
            ProgressPercent = progressPercent,
            CompletedSectionIds = completedSectionIds
        };
    }
}