namespace InspireAPI.Models;

public class SessionEndRequest
{
    public int SessionId { get; set; }
    public int SectionLogId { get; set; }

    // Mock JWT for now
    public string UserId { get; set; } = "";

    // Client reports only inactive time since last heartbeat/end
    public double InactiveSecondsDelta { get; set; }
}