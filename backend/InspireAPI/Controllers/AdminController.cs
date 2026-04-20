using Microsoft.AspNetCore.Mvc;
using InspireAPI.Services;

namespace InspireAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly SessionFileService _sessionFileService;

        public AdminController(SessionFileService sessionFileService)
        {
            _sessionFileService = sessionFileService;
        }

        [HttpGet("sessions")]
        public IActionResult GetSessions()
        {
            var sessions = _sessionFileService.GetSessions();
            return Ok(sessions);
        }

        [HttpGet("summary")]
        public IActionResult GetSummary()
        {
            var sessions = _sessionFileService.GetSessions();

            var summary = new
            {
                totalSessions = sessions.Count,
                activeSessions = sessions.Count(s => s.IsActive),
                totalWatchSeconds = sessions.Sum(s => s.TotalWatchedSeconds)
            };

            return Ok(summary);
        }
    }
}