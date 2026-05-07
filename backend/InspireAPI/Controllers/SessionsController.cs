using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InspireAPI.Data;
using InspireAPI.Models;

namespace InspireAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SessionsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("startSession")]
        public async Task<IActionResult> StartSession([FromBody] SessionStartRequest request)
        {
            var session = new Session
            {
                VideoId = request.VideoId,
                UserName = request.UserName,
                UserId = request.UserId,
                StartedAt = DateTime.UtcNow,
                IsActive = true,
                TotalWatchedSeconds = 0,
                LastKnownVideoTimeSeconds = 0
            };

            _db.Sessions.Add(session);
            await _db.SaveChangesAsync();

            return Ok(new { sessionId = session.Id });
        }

        [HttpPost("heartbeat")]
        public async Task<IActionResult> Heartbeat([FromBody] HeartbeatRequest request)
        {
            var session = await _db.Sessions.FindAsync(request.SessionId);

            if (session == null)
                return NotFound(new { message = "Session not found" });

            if (!session.IsActive)
                return BadRequest(new { message = "Session already ended" });

            session.TotalWatchedSeconds += request.WatchedSeconds;
            session.LastKnownVideoTimeSeconds = request.CurrentTimeSeconds;

            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Heartbeat recorded",
                totalWatchedSeconds = session.TotalWatchedSeconds
            });
        }

        [HttpPost("end")]
        public async Task<IActionResult> EndSession([FromBody] SessionEndRequest request)
        {
            var session = await _db.Sessions.FindAsync(request.SessionId);

            if (session == null)
                return NotFound(new { message = "Session not found" });

            session.IsActive = false;
            session.EndedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Session ended" });
        }
    }
}
