namespace InspireAPI.Models;

public class SessionStartRequest
{
    // Session Data
    public int CourseId { get; set; }
    public string UserId { get; set; } = "";
    public string UserName { get; set; } = "";

    // SessionActivityLog Data
    public int ChapterId { get; set; }
    public int SectionId { get; set; }
}