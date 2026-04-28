namespace InspireAPI.Models;

public class Session
{
    public int Id { get; set; }

    public int VideoId { get; set; }
    public string UserId { get; set; } = "";
    public string UserName { get; set; } = "";

    public DateTime StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }

    public bool IsActive { get; set; }
    public int TotalWatchedSeconds { get; set; }
    public double LastKnownVideoTimeSeconds { get; set; }
}