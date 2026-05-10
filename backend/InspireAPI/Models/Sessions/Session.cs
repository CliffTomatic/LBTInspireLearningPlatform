namespace InspireAPI.Models;

public class Session
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string UserId { get; set; } = "";
    public string UserName { get; set; } = "";

    public DateTime StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }

    public DateTime LastHeartbeatAt { get; set; }

    // Stored so dashboard doesn't have to recount sessionlogs everytime
    public double TotalActiveSeconds { get; set; }
    public double TotalInactiveSeconds { get; set; }

    public bool IsActive { get; set; }

    public List<SectionLog> SectionLogs { get; set; } = new();

}