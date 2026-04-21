namespace InspireAPI.Models
{
    public class HeartbeatRequest
    {
        public int SessionId { get; set; }
        public int UserId { get; set; }
        public int VideoId { get; set; }
        public int CurrentTimeSeconds { get; set; }
        public int WatchedSeconds { get; set; }
    }
}