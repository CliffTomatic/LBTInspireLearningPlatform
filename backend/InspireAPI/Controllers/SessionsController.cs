using Microsoft.AspNetCore.Mvc;
using InspireAPI.Models;
using InspireAPI.MockData;
using InspireAPI.Services;

namespace InspireAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionsController : ControllerBase
    {
         private readonly SessionFileService _sessionFileService;

        public SessionsController(SessionFileService sessionFileService)
        {
            _sessionFileService = sessionFileService;
        }

        [HttpPost("startSession")]
        public IActionResult StartSession([FromBody] SessionStartRequest request)
        {
            var session = new ViewSession
            {
                VideoId = request.VideoId,
                UserName = request.UserName,
                UserId = request.UserId,
                StartedAt = DateTime.UtcNow,
                IsActive = true,
                TotalWatchedSeconds = 0,
                LastKnownVideoTimeSeconds = 0
            };

            session = _sessionFileService.AddSession(session);

            return Ok(new { sessionId = session.SessionId });
        }

        [HttpPost("heartbeat")]
        public IActionResult Heartbeat([FromBody] HeartbeatRequest request)
        {
            var session = _sessionFileService.GetSessionById(request.SessionId);

            if (session == null)
                return NotFound(new { message = "Session not found" });

            if (!session.IsActive)
                return BadRequest(new { message = "Session already ended" });

            session.TotalWatchedSeconds += request.WatchedSeconds;
            session.LastKnownVideoTimeSeconds = request.CurrentTimeSeconds;

            bool updated = _sessionFileService.UpdateSession(session);

            if (!updated)
                return StatusCode(500, new { message = "Failed to update session" });

            return Ok(new
            {
                message = "Heartbeat recorded",
                totalWatchedSeconds = session.TotalWatchedSeconds
            });
        }

        [HttpPost("end")]
        public IActionResult EndSession([FromBody] SessionEndRequest request)
        {
            var session = _sessionFileService.GetSessionById(request.SessionId);

            if (session == null)
                return NotFound(new { message = "Session not found" });

            session.IsActive = false;
            session.EndedAt = DateTime.UtcNow;

            bool updated = _sessionFileService.UpdateSession(session);

            if (!updated)
                return StatusCode(500, new { message = "Failed to end session" });

            return Ok(new { message = "Session ended" });
        }
    }
}