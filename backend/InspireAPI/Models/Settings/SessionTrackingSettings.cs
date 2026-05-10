namespace InspireAPI.Settings;

public class SessionTrackingSettings
{
    public double HeartbeatIntervalSeconds { get; set; }
    public double MaxMissedHeartbeatMultiplier { get; set; }
    public double IdleTimeoutSeconds { get; set; }
}