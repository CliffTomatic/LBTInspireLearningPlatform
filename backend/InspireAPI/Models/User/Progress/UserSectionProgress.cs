namespace InspireAPI.Models.Progress;

public class UserSectionProgress
{
    public int Id { get; set; }

    public string UserId { get; set; } = "";

    public int CourseId { get; set; }

    public int SectionId { get; set; }

    public DateTime StartedAt { get; set; }

    public DateTime LastAccessedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public int LastPositionSeconds { get; set; }

    public double ActiveSecondsWatched { get; set; }

    public bool IsCompleted { get; set; }
}