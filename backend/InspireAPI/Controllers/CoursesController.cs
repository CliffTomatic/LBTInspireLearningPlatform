using InspireAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
}