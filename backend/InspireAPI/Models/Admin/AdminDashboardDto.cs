namespace InspireAPI.Models.Admin;

public sealed record AdminDashboardDto(
    AdminSummaryDto Summary,
    List<AdminUserRowDto> Users,
    List<AdminCourseRowDto> Courses,
    List<AdminSessionRowDto> RecentSessions
);

public sealed record AdminSummaryDto(
    int TotalUsers,
    int TotalCourses,
    int TotalEnrollments,
    int ActiveSessions,
    int TotalSessions,
    int CompletedCourses,
    int TotalActiveSeconds,
    int TotalInactiveSeconds,
    int AverageProgressPercent
);

public sealed record AdminUserRowDto(
    string UserId,
    string DisplayName,
    string Email,
    int EnrolledCourses,
    int CompletedCourses,
    int AverageProgressPercent,
    int TotalActiveSeconds,
    DateTime? LastSeenAt,
    string Status
);

public sealed record AdminCourseRowDto(
    int CourseId,
    string CourseSlug,
    string CourseTitle,
    int EnrolledUsers,
    int CompletedUsers,
    int AverageProgressPercent,
    int TotalActiveSeconds,
    int ActiveSessions
);

public sealed record AdminSessionRowDto(
    string SessionId,
    string UserId,
    string DisplayName,
    int CourseId,
    string CourseTitle,
    string SectionTitle,
    DateTime StartedAt,
    DateTime LastHeartbeatAt,
    DateTime? EndedAt,
    int ActiveSeconds,
    int InactiveSeconds,
    string Status
);