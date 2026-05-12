using System.ComponentModel.DataAnnotations;

namespace InspireAPI.Models.Courses;

public class Course
{
    public int Id { get; set; }

    [Required]
    public string Slug { get; set; } = "";

    [Required]
    public string Title { get; set; } = "";

    public string Description { get; set; } = "";

    public string ThumbnailUrl { get; set; } = "";

    public CourseLevel Level { get; set; }

    public double EstimatedHours { get; set; }

    public bool IsPublished { get; set; } = true;

    public int DisplayOrder { get; set; }

    public List<CourseChapter> Chapters { get; set; } = [];
}