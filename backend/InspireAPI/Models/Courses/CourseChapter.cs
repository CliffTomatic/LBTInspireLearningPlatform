using System.ComponentModel.DataAnnotations;

namespace InspireAPI.Models.Courses;

public class CourseChapter
{
    public int Id { get; set; }

    public int CourseId { get; set; }

    public Course? Course { get; set; }

    [Required]
    public string Title { get; set; } = "";

    public int DisplayOrder { get; set; }

    public List<CourseSection> Sections { get; set; } = [];
}