// Objects for the app to use.
namespace InspireAPI.Models;
public class Video
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string ThumbnailUrl { get; set; } = "";
    public string VideoUrl { get; set; } = "";
    public int DurationSeconds { get; set; }
}