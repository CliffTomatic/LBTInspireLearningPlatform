using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InspireAPI.Data;

namespace InspireAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AdminController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("sessions")]
        public async Task<IActionResult> GetSessions()
        {
            var sessions = await _db.Sessions
                .OrderByDescending(s => s.StartedAt)
                .Select(s => new
                {
                    sessionId = s.Id,
                    // s.UserId,
                    // s.UserName,
                    // s.VideoId,
                    // s.StartedAt,
                    // s.EndedAt,
                    // s.TotalWatchedSeconds,
                    // s.LastKnownVideoTimeSeconds,
                    s.IsActive
                })
                .ToListAsync();

            return Ok(sessions);
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var summary = new
            {
                totalSessions = await _db.Sessions.CountAsync(),
                activeSessions = await _db.Sessions.CountAsync(s => s.IsActive),
                // totalWatchSeconds = await _db.Sessions.SumAsync(s => s.TotalWatchedSeconds)
            };

            return Ok(summary);
        }
    }
}
