namespace InspireAPI.Models;

// Created everytime the client visits a new section

public class SectionLog
{
    public int Id { get; set; }
    public int SessionId { get; set; }
    public int CourseId { get; set; }
    public int ChapterId { get; set; }
    public int SectionId { get; set; }

    // When the client opens a section
    public DateTime StartedAt { get; set; }
    // When the client ends a section
    public DateTime? EndedAt { get; set; }

    // Changed every heartbeat
    public DateTime LastHeartbeatAt { get; set; }

    // Total active/inactive time reported by client so far in this session
    public double ActiveSeconds { get; set; }
    public double InactiveSeconds { get; set; }

    public Session Session { get; set; } = null!;
}