using Microsoft.AspNetCore.Mvc;
using InspireAPI.Models;
using InspireAPI.MockData;

namespace InspireAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionsController : ControllerBase
    {
        [HttpPost("start")] // TODO Change name
        public IActionResult StartSession([FromBody] SessionStartRequest request)
        {
            var session = new ViewSession
            {
                Id = MockSessionData.NextSessionId++,
                VideoId = request.VideoId,
                UserName = request.UserName,
                StartedAt = DateTime.UtcNow,
                IsActive = true,
                TotalWatchedSeconds = 0,
                LastKnownVideoTimeSeconds = 0
            };

            MockSessionData.Sessions.Add(session);

            return Ok(new { sessionId = session.Id });
        }

        [HttpPost("heartbeat")]
        public IActionResult Heartbeat([FromBody] HeartbeatRequest request)
        {
            var session = MockSessionData.Sessions.FirstOrDefault(s => s.Id == request.SessionId);

            if (session == null)
                return NotFound(new { message = "Session not found" });

            if (!session.IsActive)
                return BadRequest(new { message = "Session already ended" });

            session.TotalWatchedSeconds += request.WatchedSeconds;
            session.LastKnownVideoTimeSeconds = request.CurrentTimeSeconds;

            return Ok(new
            {
                message = "Heartbeat recorded",
                totalWatchedSeconds = session.TotalWatchedSeconds
            });
        }

        [HttpPost("end")]
        public IActionResult EndSession([FromBody] SessionEndRequest request)
        {
            var session = MockSessionData.Sessions.FirstOrDefault(s => s.Id == request.SessionId);

            if (session == null)
                return NotFound(new { message = "Session not found" });

            session.IsActive = false;
            session.EndedAt = DateTime.UtcNow;

            return Ok(new { message = "Session ended" });
        }
    }
}