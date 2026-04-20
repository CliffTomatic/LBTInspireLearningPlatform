namespace InspireAPI.Models
{
    public class ViewSession
    {
        public int SessionId { get; set; }
        public int VideoId { get; set; }
        public string UserName { get; set; } = "";
        public DateTime StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }
        public int TotalWatchedSeconds { get; set; }
        public int LastKnownVideoTimeSeconds { get; set; }
        public bool IsActive { get; set; }
    }
}