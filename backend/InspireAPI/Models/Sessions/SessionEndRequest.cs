namespace InspireAPI.Models;

public class SessionEndRequest
{
    // Client reports only inactive time since last heartbeat/end
    public int SessionId { get; set; }
    public int SectionLogId { get; set; }
    public double InactiveSecondsDelta { get; set; }
}