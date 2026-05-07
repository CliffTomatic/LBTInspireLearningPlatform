namespace InspireAPI.Models;

public class SessionActivityLog
{
    public int Id { get; set; }

    public int SessionId { get; set; }
    public int CourseId { get; set; }
    public int ChapterId { get; set; }
    public int SectionId { get; set; }
    // Might be redundant -> findable with SectionId
    public string SectionType { get; set; } = "";
    public DateTime LoggedAt { get; set; }

    // Where the learner currently is in the video/section
    public double CurrentPositionSeconds { get; set; }

    // How much real active learning time this heartbeat added
    public double ActiveSecondsDelta { get; set; }

    // Total active time reported by client so far in this session
    public double SessionActiveSecondsSoFar { get; set; }

    public double PlaybackRate { get; set; } = 1.0;
}