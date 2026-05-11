namespace InspireAPI.Models;

public class NewSectionLogRequest
{
    public int SessionId { get; set; }
    public int CourseId { get; set; }

    public int OldSectionLogId { get; set; }
    public double OldInactiveSecondsDelta { get; set; }

    public int NewChapterId { get; set; }
    public int NewSectionId { get; set; }
}