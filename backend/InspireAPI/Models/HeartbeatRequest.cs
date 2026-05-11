namespace InspireAPI.Models
{
    public class HeartbeatRequest
    {
        public int SessionId { get; set; }
        public int SectionLogId { get; set; }
        public double InactiveSecondsDelta { get; set; }
    }
}