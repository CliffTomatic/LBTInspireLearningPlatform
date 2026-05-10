using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InspireAPI.Services;
using InspireAPI.Data;
using InspireAPI.Models;
using Microsoft.Extensions.Options;
using InspireAPI.Settings;

namespace InspireAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IOptions<SessionTrackingSettings> _trackingSettings;
        private readonly SessionService _sessionService;

        public SessionsController(
            AppDbContext db,
            SessionService sessionService,
            IOptions<SessionTrackingSettings> trackingSettings)
        {
            _db = db;
            _trackingSettings = trackingSettings;
            _sessionService = sessionService;
        }

        [HttpPost("startSession")]
        public async Task<IActionResult> StartSession([FromBody] SessionStartRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Request body is required." });
            }

            if (string.IsNullOrWhiteSpace(request.UserId))
            {
                return BadRequest(new { message = "UserId is required." });
            }

            if (request.ChapterId <= 0)
            {
                return BadRequest(new { message = "ChapterId is required." });
            }

            if (request.CourseId <= 0)
            {
                return BadRequest(new { message = "CourseId is required." });
            }

            if (request.SectionId <= 0)
            {
                return BadRequest(new { message = "SectionId is required." });
            }

            var now = DateTime.UtcNow;

            var session = new Session
            {
                CourseId = request.CourseId,
                UserId = request.UserId,
                UserName = request.UserName,

                StartedAt = now,
                EndedAt = null,

                LastHeartbeatAt = now,

                TotalActiveSeconds = 0,
                TotalInactiveSeconds = 0,

                IsActive = true,
            };
            _db.Sessions.Add(session);

            var sectionLog = new SectionLog
            {
                CourseId = request.CourseId,
                ChapterId = request.ChapterId,
                SectionId = request.SectionId,

                StartedAt = now,
                LastHeartbeatAt = now,

                ActiveSeconds = 0,
                InactiveSeconds = 0
            };
            // EF automatically assigns SessionId through relationship
            session.SectionLogs.Add(sectionLog);

            // Save new SectionLog
            await _db.SaveChangesAsync();

            return Ok(new
            {
                sessionId = session.Id,
                sessionLogId = sectionLog.Id
            });
        }

        [HttpPost("heartbeat")]
        public async Task<IActionResult> Heartbeat([FromBody] HeartbeatRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Body cannot be null" });
            }

            if (request.SectionLogId <= 0)
            {
                return BadRequest(new { message = "SectionLogId is required." });
            }

            // Calculate Dynamic Heartbeat Interval
            var maxAllowedDelta =
                _trackingSettings.Value.HeartbeatIntervalSeconds *
                _trackingSettings.Value.MaxMissedHeartbeatMultiplier;

            // Get current SectionLog
            var currSectionLog = await _db.SectionLogs
                .FirstOrDefaultAsync(log =>
                    log.Id == request.SectionLogId &&
                    log.SessionId == request.SessionId &&
                    log.Session.UserId == request.UserId);

            if (currSectionLog == null)
            {
                return NotFound(new { message = "Section log not found for this session/user." });
            }

            if (currSectionLog.EndedAt != null)
            {
                return BadRequest(new { message = "Session already ended" });
            }

            if (request.InactiveSecondsDelta < 0)
            {
                return BadRequest(new { message = "Heartbeat deltas cannot be negative." });
            }

            if (request.InactiveSecondsDelta > maxAllowedDelta)
            {
                return BadRequest(new { message = "Heartbeat delta too large." });
            }

            var now = DateTime.UtcNow;

            // Let the server calculate how many seconds the client has been active
            var elapsedSeconds = (now - currSectionLog.LastHeartbeatAt).TotalSeconds;
            var cappedElapsedSeconds = Math.Min(elapsedSeconds, maxAllowedDelta);

            if (request.InactiveSecondsDelta > cappedElapsedSeconds)
            {
                return BadRequest(new { message = "Inactive seconds cannot exceed elapsed time." });
            }

            var activeSecondsDelta = cappedElapsedSeconds - request.InactiveSecondsDelta;

            // Update total seconds
            currSectionLog.ActiveSeconds += activeSecondsDelta;
            currSectionLog.InactiveSeconds += request.InactiveSecondsDelta;
            currSectionLog.LastHeartbeatAt = now;

            // Update Parent Session total seconds
            currSectionLog.Session.TotalActiveSeconds += activeSecondsDelta;
            currSectionLog.Session.TotalInactiveSeconds += request.InactiveSecondsDelta;
            currSectionLog.Session.LastHeartbeatAt = now;

            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Heartbeat recorded",
                totalActiveSeconds = currSectionLog.ActiveSeconds,
                totalInactiveSeconds = currSectionLog.InactiveSeconds
            });
        }

        /* 
        Client moved onto a new section.
        Overview: 
            Ends old SectionLog.
            Creates new SectionLog.
        */
        [HttpPost("newSection")]
        public async Task<IActionResult> NewSectionLog([FromBody] NewSectionLogRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Body cannot be null" });
            }

            // End old SectionLog
            var oldSectionLog = await _db.SectionLogs
                .FirstOrDefaultAsync(log =>
                    log.Id == request.OldSectionLogId &&
                    log.SessionId == request.SessionId &&
                    log.Session.UserId == request.UserId
                );

            if (oldSectionLog == null)
            {
                return NotFound(new { message = "Session log not found" });
            }

            if (oldSectionLog.EndedAt != null)
            {
                return Conflict(new { message = "Old section log is already ended." });
            }

            if (request.OldInactiveSecondsDelta < 0)
            {
                return BadRequest(new { message = "Inactive seconds cannot be negative." });
            }

            var parentSession = oldSectionLog.Session;

            // Calculate Dynamic Heartbeat Interval
            var maxAllowedDelta =
                _trackingSettings.Value.HeartbeatIntervalSeconds *
                _trackingSettings.Value.MaxMissedHeartbeatMultiplier;

            var now = DateTime.UtcNow;

            // Add remaining time to old SectionLog
            var elapsedSeconds = (now - oldSectionLog.LastHeartbeatAt).TotalSeconds;
            var cappedElapsedSeconds = Math.Min(elapsedSeconds, maxAllowedDelta);

            if (request.OldInactiveSecondsDelta > cappedElapsedSeconds)
            {
                return BadRequest(new { message = "Inactive seconds cannot exceed elapsed time." });
            }

            var activeSecondsDelta = cappedElapsedSeconds - request.OldInactiveSecondsDelta;

            // Update SectionLog's tracking data
            oldSectionLog.ActiveSeconds += activeSecondsDelta;
            oldSectionLog.InactiveSeconds += request.OldInactiveSecondsDelta;
            oldSectionLog.LastHeartbeatAt = now;
            oldSectionLog.EndedAt = now;

            // Update Parent Session's tracking data
            parentSession.TotalActiveSeconds += activeSecondsDelta;
            parentSession.TotalInactiveSeconds += request.OldInactiveSecondsDelta;
            parentSession.LastHeartbeatAt = now;

            // Create new SectionLog
            var sectionLog = _sessionService.CreateDefaultSectionLog(
                oldSectionLog.SessionId,
                parentSession.CourseId,
                request.NewChapterId,
                request.NewSectionId
            );
            _db.SectionLogs.Add(sectionLog);
            await _db.SaveChangesAsync();

            return Ok(new { sectionLogId = sectionLog.Id });
        }

        [HttpPost("end")]
        public async Task<IActionResult> EndSession([FromBody] SessionEndRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Body cannot be null" });
            }

            if (request.SessionId <= 0)
            {
                return BadRequest(new { message = "SessionId is required." });
            }

            if (request.SectionLogId <= 0)
            {
                return BadRequest(new { message = "SectionLogId is required." });
            }

            if (string.IsNullOrWhiteSpace(request.UserId))
            {
                return BadRequest(new { message = "UserId is required." });
            }

            if (request.InactiveSecondsDelta < 0)
            {
                return BadRequest(new { message = "Inactive seconds cannot be negative." });
            }

            var session = await _db.Sessions
                .FirstOrDefaultAsync(s =>
                    s.Id == request.SessionId &&
                    s.UserId == request.UserId);

            if (session == null)
            {
                return NotFound(new { message = "Session not found for this user." });
            }

            var sectionLog = await _db.SectionLogs
                .FirstOrDefaultAsync(sl =>
                    sl.Id == request.SectionLogId &&
                    sl.SessionId == session.Id);

            if (sectionLog == null)
            {
                return NotFound(new { message = "Section log not found for this session." });
            }

            if (!session.IsActive || session.EndedAt != null)
            {
                return Conflict(new { message = "Session is already ended." });
            }

            if (sectionLog.EndedAt != null)
            {
                return Conflict(new { message = "Section log is already ended." });
            }

            var now = DateTime.UtcNow;

            var elapsedSeconds = (now - sectionLog.LastHeartbeatAt).TotalSeconds;

            if (elapsedSeconds < 0)
            {
                return BadRequest(new { message = "Invalid server time calculation." });
            }

            var maxAllowedDelta =
                _trackingSettings.Value.HeartbeatIntervalSeconds *
                _trackingSettings.Value.MaxMissedHeartbeatMultiplier;

            var cappedElapsedSeconds = Math.Min(elapsedSeconds, maxAllowedDelta);

            if (request.InactiveSecondsDelta > cappedElapsedSeconds)
            {
                return BadRequest(new
                {
                    message = "Inactive seconds cannot exceed elapsed time."
                });
            }

            var activeSecondsDelta = cappedElapsedSeconds - request.InactiveSecondsDelta;

            sectionLog.ActiveSeconds += activeSecondsDelta;
            sectionLog.InactiveSeconds += request.InactiveSecondsDelta;
            sectionLog.LastHeartbeatAt = now;
            sectionLog.EndedAt = now;

            session.TotalActiveSeconds += activeSecondsDelta;
            session.TotalInactiveSeconds += request.InactiveSecondsDelta;
            session.LastHeartbeatAt = now;
            session.EndedAt = now;
            session.IsActive = false;

            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Session ended",
                sessionId = session.Id,
                sectionLogId = sectionLog.Id,
                activeSecondsAdded = activeSecondsDelta,
                inactiveSecondsAdded = request.InactiveSecondsDelta,
                totalActiveSeconds = session.TotalActiveSeconds,
                totalInactiveSeconds = session.TotalInactiveSeconds
            });
        }
    }
}
