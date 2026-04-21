namespace InspireAPI.Models
{
    public class SessionStartRequest
    {
        public int VideoId { get; set; }
        public string UserName { get; set; } = "";
        public string UserId { get; set; } = "";
    }
}