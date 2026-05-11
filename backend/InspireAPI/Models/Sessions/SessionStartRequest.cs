namespace InspireAPI.Models;

public class SessionStartRequest
{
    // Session Data
    public int CourseId { get; set; }

    // SessionActivityLog Data
    public int ChapterId { get; set; }
    public int SectionId { get; set; }
}