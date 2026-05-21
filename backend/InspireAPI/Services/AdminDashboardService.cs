using InspireAPI.Models.Admin;

namespace InspireAPI.Services;

public class AdminDashboardService
{
    private const int StaleAfterSeconds = 60;

    public AdminDashboardDto GetDashboard()
    {
        var now = DateTime.UtcNow;

        var users = new List<AdminUserRowDto>
        {
            new(
                UserId: "user-1001",
                DisplayName: "Joshua I.",
                Email: "joshua@example.com",
                EnrolledCourses: 3,
                CompletedCourses: 1,
                AverageProgressPercent: 72,
                TotalActiveSeconds: 9120,
                LastSeenAt: now.AddMinutes(-4),
                Status: "Active"
            ),
            new(
                UserId: "user-1002",
                DisplayName: "Maria Lopez",
                Email: "maria@example.com",
                EnrolledCourses: 2,
                CompletedCourses: 0,
                AverageProgressPercent: 38,
                TotalActiveSeconds: 4210,
                LastSeenAt: now.AddHours(-3),
                Status: "Inactive"
            ),
            new(
                UserId: "user-1003",
                DisplayName: "David Chen",
                Email: "david@example.com",
                EnrolledCourses: 1,
                CompletedCourses: 1,
                AverageProgressPercent: 100,
                TotalActiveSeconds: 3600,
                LastSeenAt: now.AddDays(-1),
                Status: "Inactive"
            )
        };

        var courses = new List<AdminCourseRowDto>
        {
            new(
                CourseId: 1,
                CourseSlug: "wifi-basics",
                CourseTitle: "WiFi Basics",
                EnrolledUsers: 42,
                CompletedUsers: 19,
                AverageProgressPercent: 64,
                TotalActiveSeconds: 28400,
                ActiveSessions: 2
            ),
            new(
                CourseId: 2,
                CourseSlug: "youtube-basics",
                CourseTitle: "YouTube Basics",
                EnrolledUsers: 31,
                CompletedUsers: 8,
                AverageProgressPercent: 47,
                TotalActiveSeconds: 18300,
                ActiveSessions: 1
            ),
            new(
                CourseId: 3,
                CourseSlug: "data-privacy-basics",
                CourseTitle: "Data Privacy Basics",
                EnrolledUsers: 18,
                CompletedUsers: 5,
                AverageProgressPercent: 52,
                TotalActiveSeconds: 9600,
                ActiveSessions: 0
            )
        };

        var sessions = new List<AdminSessionRowDto>
        {
            new(
                SessionId: "session-9001",
                UserId: "user-1001",
                DisplayName: "Joshua I.",
                CourseId: 1,
                CourseTitle: "WiFi Basics",
                SectionTitle: "What is WiFi?",
                StartedAt: now.AddMinutes(-28),
                LastHeartbeatAt: now.AddSeconds(-12),
                EndedAt: null,
                ActiveSeconds: 1215,
                InactiveSeconds: 90,
                Status: GetSessionStatus(
                    endedAt: null,
                    lastHeartbeatAt: now.AddSeconds(-12),
                    now: now
                )
            ),
            new(
                SessionId: "session-9002",
                UserId: "user-1002",
                DisplayName: "Maria Lopez",
                CourseId: 2,
                CourseTitle: "YouTube Basics",
                SectionTitle: "Searching for Videos",
                StartedAt: now.AddHours(-2),
                LastHeartbeatAt: now.AddMinutes(-74),
                EndedAt: null,
                ActiveSeconds: 740,
                InactiveSeconds: 120,
                Status: GetSessionStatus(
                    endedAt: null,
                    lastHeartbeatAt: now.AddMinutes(-74),
                    now: now
                )
            ),
            new(
                SessionId: "session-9003",
                UserId: "user-1003",
                DisplayName: "David Chen",
                CourseId: 3,
                CourseTitle: "Data Privacy Basics",
                SectionTitle: "Password Safety",
                StartedAt: now.AddDays(-1).AddMinutes(-45),
                LastHeartbeatAt: now.AddDays(-1),
                EndedAt: now.AddDays(-1),
                ActiveSeconds: 1800,
                InactiveSeconds: 60,
                Status: GetSessionStatus(
                    endedAt: now.AddDays(-1),
                    lastHeartbeatAt: now.AddDays(-1),
                    now: now
                )
            )
        };

        var summary = new AdminSummaryDto(
            TotalUsers: users.Count,
            TotalCourses: courses.Count,
            TotalEnrollments: courses.Sum(course => course.EnrolledUsers),
            ActiveSessions: sessions.Count(session => session.Status == "Active"),
            TotalSessions: sessions.Count,
            CompletedCourses: users.Sum(user => user.CompletedCourses),
            TotalActiveSeconds: sessions.Sum(session => session.ActiveSeconds),
            TotalInactiveSeconds: sessions.Sum(session => session.InactiveSeconds),
            AverageProgressPercent: users.Count == 0
                ? 0
                : (int)Math.Round(users.Average(user => user.AverageProgressPercent))
        );

        return new AdminDashboardDto(
            Summary: summary,
            Users: users,
            Courses: courses,
            RecentSessions: sessions
                .OrderByDescending(session => session.LastHeartbeatAt)
                .ToList()
        );
    }

    private static string GetSessionStatus(
        DateTime? endedAt,
        DateTime lastHeartbeatAt,
        DateTime now
    )
    {
        if (endedAt != null)
        {
            return "Ended";
        }

        var secondsSinceHeartbeat = (now - lastHeartbeatAt).TotalSeconds;

        if (secondsSinceHeartbeat > StaleAfterSeconds)
        {
            return "Stale";
        }

        return "Active";
    }
}