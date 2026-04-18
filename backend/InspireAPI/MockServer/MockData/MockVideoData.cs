using InspireAPI.Models;

namespace InspireAPI.MockData
{
    public static class MockVideoData
    {
        public static List<Video> Videos { get; } = new()
        {
            new Video
            {
                Id = 1,
                Title = "LearnBasicTech's Review",
                Description = "LearnBasicTech's Youtube Video Review",
                ThumbnailUrl = "/Assets/Thumbnails/Video_1_Thumbnail.png",
                VideoUrl = "/Assets/Videos/Video_1.mp4",
                DurationSeconds = 511,
            },
            new Video
            {
                Id = 2,
                Title = "LearnBasicTech's Review1",
                Description = "LearnBasicTech's Youtube Video Review1",
                ThumbnailUrl = "/Assets/Thumbnails/Video_1_Thumbnail.png",
                VideoUrl = "/Assets/Videos/Video_1.mp4",
                DurationSeconds = 511,
            },
        };
    }
}