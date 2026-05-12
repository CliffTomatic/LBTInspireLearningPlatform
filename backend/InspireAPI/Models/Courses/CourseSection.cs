using System.ComponentModel.DataAnnotations;

namespace InspireAPI.Models.Courses;

public class CourseSection
{
    public int Id { get; set; }

    public int CourseChapterId { get; set; }

    public CourseChapter? CourseChapter { get; set; }

    [Required]
    public string Slug { get; set; } = "";

    [Required]
    public string Title { get; set; } = "";

    public CourseSectionType Type { get; set; }

    public int DisplayOrder { get; set; }

    public int? DurationMinutes { get; set; }

    public bool IsPreview { get; set; }

    public string? VideoUrl { get; set; }

    public string? ThumbnailUrl { get; set; }

    public List<EbookBlock> EbookBlocks { get; set; } = [];
}