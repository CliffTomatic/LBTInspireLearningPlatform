using InspireAPI.MockData;
using InspireAPI.Models;

namespace InspireAPI.Services
{
    public class VideoService
    {
        public List<Video> GetAllVideos()
        {
            return MockVideoData.Videos;
        }

        public Video? GetVideoById(int id)
        {
            return MockVideoData.Videos.FirstOrDefault(v => v.Id == id);
        }
    }
}