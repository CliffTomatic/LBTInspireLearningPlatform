using InspireAPI.Data;
using InspireAPI.Models.Admin;
using Microsoft.EntityFrameworkCore;

namespace InspireAPI.Services;

public class AdminDashboardService
{
    private const int ActiveAfterMinutes = 10;

    private readonly AppDbContext _db;

    public AdminDashboardService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<AdminDashboardDto> GetDashboardAsync()
    {
        var now = DateTime.UtcNow;
        var activeCutoff = now.AddMinutes(-ActiveAfterMinutes);

        var users = await _db.Users
            .AsNoTracking()
            .Select(user => new
            {
                user.Id,
                user.DisplayName,
                user.UserName,
                user.Email
            })
            .ToListAsync();

        var courses = await _db.Courses
            .AsNoTracking()
            .Where(course => course.IsPublished)
            .Select(course => new
            {
                course.Id,
                course.Slug,
                course.Title
            })
            .ToListAsync();

        var courseProgresses = await _db.UserCourseProgresses
            .AsNoTracking()
            .Select(progress => new
            {
                progress.UserId,
                progress.CourseId,
                progress.StartedAt,
                progress.LastAccessedAt,
                progress.TotalActiveSeconds,
                progress.ProgressPercent,
                progress.CompletedSectionCount,
                progress.CompletedAt
            })
            .ToListAsync();

        var userLookup = users.ToDictionary(user => user.Id);
        var courseLookup = courses.ToDictionary(course => course.Id);

        var adminUsers = users
            .Select(user =>
            {
                var userProgresses = courseProgresses
                    .Where(progress => progress.UserId == user.Id)
                    .ToList();

                var lastSeenAt = userProgresses.Count == 0
                    ? null
                    : userProgresses.Max(progress =>
                        (DateTime?)progress.LastAccessedAt);

                var isActive = lastSeenAt != null && lastSeenAt >= activeCutoff;

                var averageProgress = userProgresses.Count == 0
                    ? 0
                    : (int)Math.Round(
                        userProgresses.Average(progress =>
                            progress.ProgressPercent));

                return new AdminUserRowDto(
                    UserId: user.Id,
                    DisplayName: GetDisplayName(
                        user.DisplayName,
                        user.UserName,
                        user.Email
                    ),
                    Email: user.Email ?? "",
                    EnrolledCourses: userProgresses.Count,
                    CompletedCourses: userProgresses.Count(progress =>
                        progress.CompletedAt != null),
                    AverageProgressPercent: averageProgress,
                    TotalActiveSeconds: userProgresses.Sum(progress =>
                        progress.TotalActiveSeconds),
                    LastSeenAt: lastSeenAt,
                    Status: isActive ? "Active" : "Inactive"
                );
            })
            .OrderByDescending(user => user.LastSeenAt)
            .ToList();

        var adminCourses = courses
            .Select(course =>
            {
                var progressRows = courseProgresses
                    .Where(progress => progress.CourseId == course.Id)
                    .ToList();

                var averageProgress = progressRows.Count == 0
                    ? 0
                    : (int)Math.Round(
                        progressRows.Average(progress =>
                            progress.ProgressPercent));

                var activeUsers = progressRows.Count(progress =>
                    progress.CompletedAt == null &&
                    progress.LastAccessedAt >= activeCutoff);

                return new AdminCourseRowDto(
                    CourseId: course.Id,
                    CourseSlug: course.Slug,
                    CourseTitle: course.Title,
                    EnrolledUsers: progressRows.Count,
                    CompletedUsers: progressRows.Count(progress =>
                        progress.CompletedAt != null),
                    AverageProgressPercent: averageProgress,
                    TotalActiveSeconds: progressRows.Sum(progress =>
                        progress.TotalActiveSeconds),
                    ActiveSessions: activeUsers
                );
            })
            .OrderBy(course => course.CourseTitle)
            .ToList();

        var recentSessions = courseProgresses
            .OrderByDescending(progress => progress.LastAccessedAt)
            .Take(50)
            .Select(progress =>
            {
                userLookup.TryGetValue(progress.UserId, out var user);
                courseLookup.TryGetValue(progress.CourseId, out var course);

                return new AdminSessionRowDto(
                    SessionId: $"{progress.UserId}-{progress.CourseId}",
                    UserId: progress.UserId,
                    DisplayName: user == null
                        ? "Unknown User"
                        : GetDisplayName(
                            user.DisplayName,
                            user.UserName,
                            user.Email
                        ),
                    CourseId: progress.CourseId,
                    CourseTitle: course?.Title ?? "Unknown Course",
                    SectionTitle: "Course Progress",
                    StartedAt: progress.StartedAt,
                    LastHeartbeatAt: progress.LastAccessedAt,
                    EndedAt: progress.CompletedAt,
                    ActiveSeconds: progress.TotalActiveSeconds,
                    InactiveSeconds: 0,
                    Status: GetProgressStatus(
                        progress.CompletedAt,
                        progress.LastAccessedAt,
                        activeCutoff
                    )
                );
            })
            .ToList();

        var totalActiveSeconds = courseProgresses.Sum(progress =>
            progress.TotalActiveSeconds);

        var averageProgressPercent = courseProgresses.Count == 0
            ? 0
            : (int)Math.Round(
                courseProgresses.Average(progress =>
                    progress.ProgressPercent));

        var summary = new AdminSummaryDto(
            TotalUsers: users.Count,
            TotalCourses: courses.Count,
            TotalEnrollments: courseProgresses.Count,
            ActiveSessions: courseProgresses.Count(progress =>
                progress.CompletedAt == null &&
                progress.LastAccessedAt >= activeCutoff),
            TotalSessions: courseProgresses.Count,
            CompletedCourses: courseProgresses.Count(progress =>
                progress.CompletedAt != null),
            TotalActiveSeconds: totalActiveSeconds,
            TotalInactiveSeconds: 0,
            AverageProgressPercent: averageProgressPercent
        );

        return new AdminDashboardDto(
            Summary: summary,
            Users: adminUsers,
            Courses: adminCourses,
            RecentSessions: recentSessions
        );
    }

    private static string GetDisplayName(
        string? displayName,
        string? userName,
        string? email)
    {
        if (!string.IsNullOrWhiteSpace(displayName))
        {
            return displayName;
        }

        if (!string.IsNullOrWhiteSpace(userName))
        {
            return userName;
        }

        if (!string.IsNullOrWhiteSpace(email))
        {
            return email;
        }

        return "Unknown User";
    }

    private static string GetProgressStatus(
        DateTime? completedAt,
        DateTime lastAccessedAt,
        DateTime activeCutoff)
    {
        if (completedAt != null)
        {
            return "Ended";
        }

        if (lastAccessedAt >= activeCutoff)
        {
            return "Active";
        }

        return "Inactive";
    }
}