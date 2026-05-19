using InspireAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using InspireAPI.Models.Progress;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using InspireAPI.Models.Auth;

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
}