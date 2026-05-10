using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using InspireAPI.Settings;

[ApiController]
[Route("api/config")]
public class ConfigController : ControllerBase
{
    private readonly SessionTrackingSettings _trackingSettings;

    public ConfigController(IOptions<SessionTrackingSettings> trackingSettings)
    {
        _trackingSettings = trackingSettings.Value;
    }

    [HttpGet("session-tracking")]
    public IActionResult GetSessionTrackingConfig()
    {
        return Ok(new
        {
            heartbeatIntervalSeconds = _trackingSettings.HeartbeatIntervalSeconds,
            idleTimeoutSeconds = _trackingSettings.IdleTimeoutSeconds
        });
    }
}