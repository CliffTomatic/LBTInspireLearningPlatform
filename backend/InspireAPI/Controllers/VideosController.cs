using Microsoft.AspNetCore.Mvc;
using InspireAPI.Services;

namespace InspireAPI.Controllers
{
    [ApiController]
    // Client hits api "https://DNS/api/videos" since it omits "Controller"
    [Route("api/[controller]")]
    public class VideosController : ControllerBase
    {
        private readonly VideoService _videoService;

        public VideosController(VideoService videoService)
        {
            _videoService = videoService;
        }

        [HttpGet]
        public IActionResult GetVideos()
        {
            var videos = _videoService.GetAllVideos();
            return Ok(videos);
        }

        [HttpGet("{id}")]
        public IActionResult GetVideoById(int id)
        {
            var video = _videoService.GetVideoById(id);

            if (video == null)
                return NotFound();

            return Ok(video);
        }
    }
}