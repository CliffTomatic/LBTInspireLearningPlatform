namespace InspireAPI.Models.Courses;

public class EbookBlock
{
    public int Id { get; set; }

    public int CourseSectionId { get; set; }

    public CourseSection? CourseSection { get; set; }

    public EbookBlockType Type { get; set; }

    public int DisplayOrder { get; set; }

    public string? Text { get; set; }

    // Store list items as JSON for now.
    // This is okay because list items are small content data,
    // not relational learning records.
    public string? ItemsJson { get; set; }
}