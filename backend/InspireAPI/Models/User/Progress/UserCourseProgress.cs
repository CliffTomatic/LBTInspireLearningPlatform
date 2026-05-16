namespace InspireAPI.Models.Progress;

public class UserCourseProgress
{
    public int Id { get; set; }

    public string UserId { get; set; } = "";

    public int CourseId { get; set; }

    public DateTime StartedAt { get; set; }

    public DateTime LastAccessedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public int LastSectionId { get; set; }

    public double TotalActiveSeconds { get; set; }

    public int CompletedSectionCount { get; set; }

    public int ProgressPercent { get; set; }
}