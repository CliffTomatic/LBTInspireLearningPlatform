using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InspireAPI.Common;
using InspireAPI.Services;
using InspireAPI.Data;
using InspireAPI.Models;
using Microsoft.Extensions.Options;
using InspireAPI.Settings;

// Auth/Identity
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.VisualBasic;

/*
! Future To do:
TODO: Add client instance tracking for Learn pages.
- Generate a unique clientInstanceId when a Learn page loads.
- Store clientInstanceId on the Session record.
- Send clientInstanceId with heartbeat, section change, and end-session requests.
- Backend should verify:
  - session belongs to current user
  - session is active
  - clientInstanceId matches the session
- If a newer Learn page starts, expire older active sessions for that user.
*/

namespace InspireAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
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

        /* 
        Create a new Session and SectionLog.
        Called when learner first starts learning 
        */
        [HttpPost("activate")]
        public async Task<IActionResult> Activate([FromBody] ActivateSectionRequest request)
        {
            var userId = GetUserId();
            var userName = GetUserName();

            if (userId == null)
            {
                return UnauthorizedMessage();
            }

            // Handoff to service
            var result = await _sessionService.ActiveSectionAsync(request, userId, userName);

            if (!result.Success)
            {
                return result.ErrorType switch
                {
                    ServiceErrorType.BadRequest => BadRequestMessage(result.Message),
                    _ => StatusCode(500, new { message = result.Message })
                };
            }

            return Ok(result.Data);
        }

        [HttpPost("heartbeat")]
        public async Task<IActionResult> Heartbeat([FromBody] HeartbeatRequest request)
        {
            var userId = GetUserId();

            if (userId == null)
            {
                return UnauthorizedMessage();
            }

            var result = await _sessionService.HeartbeatAsync(request, userId);

            if (!result.Success)
            {
                return result.ErrorType switch
                {
                    ServiceErrorType.BadRequest => BadRequestMessage(result.Message),
                    ServiceErrorType.NotFound => NotFoundMessage(result.Message),
                    ServiceErrorType.Gone => GoneMessage(result.Message),
                    _ => StatusCode(500, new { message = result.Message })
                };
            }

            return Ok();
        }

        [HttpPost("end")]
        public async Task<IActionResult> EndSession([FromBody] SessionEndRequest request)
        {
            var userId = GetUserId();

            if (userId == null)
            {
                return UnauthorizedMessage();
            }

            var result = await _sessionService.EndAsync(request, userId);

            if (!result.Success)
            {
                return result.ErrorType switch
                {
                    ServiceErrorType.BadRequest => BadRequestMessage(result.Message),
                    ServiceErrorType.NotFound => NotFoundMessage(result.Message),
                    ServiceErrorType.Gone => GoneMessage(result.Message),
                    _ => StatusCode(500, new { message = result.Message })
                };
            }

            return Ok();
        }

        // * Auth user helper functions
        private string? GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        private string GetUserName()
        {
            return User.FindFirstValue(ClaimTypes.Name) ?? "";
        }

        // * Default Responses
        private IActionResult BadRequestMessage(
            string message = "Invalid request.")
        {
            return BadRequest(new { message });
        }

        // Payload was correct but unable to locate.
        private IActionResult NotFoundMessage(
            string message = "Resource not found.")
        {
            return NotFound(new { message });
        }

        // Ended session, found but not able to process request
        private IActionResult GoneMessage(
            string message = "Resource expired.")
        {
            return StatusCode(StatusCodes.Status410Gone, new { message });
        }
        private IActionResult UnauthorizedMessage(
            string message = "Invalid or missing token.")
        {
            return Unauthorized(new { message });
        }

        private IActionResult ConflictMessage(
            string message = "Resource conflict.")
        {
            return Conflict(new { message });
        }
    }
}
