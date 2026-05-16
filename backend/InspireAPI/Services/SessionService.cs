using InspireAPI.Common;
using InspireAPI.Models;
using InspireAPI.Models.Progress;
using InspireAPI.Data;
using Microsoft.Extensions.Options;
using InspireAPI.Settings;
using Microsoft.EntityFrameworkCore;


// TODO: Add a CurrentSectionLogID to all Sessions. Change DB Relation and model.
namespace InspireAPI.Services
{
    public class SessionService
    {
        private readonly AppDbContext _db;
        private readonly IOptions<SessionTrackingSettings> _trackingSettings;

        public SessionService(AppDbContext db, IOptions<SessionTrackingSettings> trackingSettings)
        {
            _db = db;
            _trackingSettings = trackingSettings;
        }

        /// <summary>
        /// Create a default SectionLog
        /// </summary>
        public SectionLog CreateDefaultSectionLog(
            int sessionId,
            int courseId,
            int chapterId,
            int sectionId,
            DateTime now,
            double activeSeconds = 0,
            double inactiveSeconds = 0
        )
        {
            return new SectionLog
            {
                SessionId = sessionId,
                CourseId = courseId,
                ChapterId = chapterId,
                SectionId = sectionId,

                StartedAt = now,
                EndedAt = null,
                LastHeartbeatAt = now,

                ActiveSeconds = activeSeconds,
                InactiveSeconds = inactiveSeconds
            };
        }

        /// <summary>
        /// Caller: SessionController: Heartbeat
        /// Error Return Types: BadRequest, NotFound, Gone.
        /// </summary>
        public async Task<ServiceResult<object>> StartSessionAsync(
            SessionStartRequest request,
            string userId,
            string userName)
        {
            if (request == null)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "Request body is required.",
                    ErrorType = ServiceErrorType.BadRequest
                };
            }

            if (request.ChapterId <= 0)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "ChapterId is required.",
                    ErrorType = ServiceErrorType.BadRequest
                };
            }

            if (request.CourseId <= 0)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "CourseId is required.",
                    ErrorType = ServiceErrorType.BadRequest
                };
            }

            if (request.SectionId <= 0)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "SectionId is required.",
                    ErrorType = ServiceErrorType.BadRequest
                };
            }

            var now = DateTime.UtcNow;

            var session = new Session
            {
                CourseId = request.CourseId,
                UserId = userId,
                UserName = userName,

                StartedAt = now,
                EndedAt = null,
                LastHeartbeatAt = now,

                TotalActiveSeconds = 0,
                TotalInactiveSeconds = 0,

                IsActive = true
            };

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

            _db.Sessions.Add(session);
            session.SectionLogs.Add(sectionLog);

            await _db.SaveChangesAsync();

            return new ServiceResult<object>
            {
                Success = true,
                Data = new
                {
                    SessionId = session.Id,
                    SectionLogId = sectionLog.Id
                }
            };
        }
        /// <summary>
        /// Caller: SessionController: Heartbeat
        /// <para> Error Return Types: BadRequest, NotFound, Gone. </para>
        /// </summary>
        public async Task<ServiceResult<object>> HeartbeatAsync(
            HeartbeatRequest request,
            string userId)
        {
            if (request == null)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "Body cannot be null.",
                    ErrorType = ServiceErrorType.BadRequest
                };
            }

            if (request.SectionLogId <= 0 || request.SessionId <= 0)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "SectionLogId or SessionId is required.",
                    ErrorType = ServiceErrorType.BadRequest
                };
            }

            // Get current SectionLog
            var currSectionLog = await _db.SectionLogs
                .Include(log => log.Session)
                .Where(log =>
                    log.Id == request.SectionLogId &&
                    log.SessionId == request.SessionId &&
                    log.Session.UserId == userId &&
                    log.EndedAt == null)
                .OrderByDescending(log => log.Id)
                .FirstOrDefaultAsync();

            if (currSectionLog == null)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "SectionLog not found for this session/user.",
                    ErrorType = ServiceErrorType.NotFound
                };
            }
            // Calculate Dynamic Heartbeat Interval
            var maxAllowedDelta =
                _trackingSettings.Value.HeartbeatIntervalSeconds *
                _trackingSettings.Value.MaxMissedHeartbeatMultiplier;

            var now = DateTime.UtcNow;

            // Let the server calculate how many seconds the client has been active
            var elapsedSeconds = (now - currSectionLog.LastHeartbeatAt).TotalSeconds;
            var cappedElapsedSeconds = Math.Min(elapsedSeconds, maxAllowedDelta);

            if (currSectionLog.EndedAt != null)
            {
                // * Temporary: Will be replaced with an automation on the server.
                // Timeout all sessions that went stale.
                await ExpireInactiveSectionLogsAsync(now, userId);

                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "Session already ended.",
                    ErrorType = ServiceErrorType.Gone
                };
            }
            if (request.InactiveSecondsDelta < 0)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "Inactive seconds delta cannot be negative.",
                    ErrorType = ServiceErrorType.BadRequest
                };
            }
            if (request.InactiveSecondsDelta > maxAllowedDelta)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "Inactive seconds delta too large.",
                    ErrorType = ServiceErrorType.BadRequest
                };
            }

            if (request.InactiveSecondsDelta > cappedElapsedSeconds)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "Inactive seconds cannot exceed elapsed time.",
                    ErrorType = ServiceErrorType.BadRequest
                };
            }

            var activeSecondsDelta = cappedElapsedSeconds - request.InactiveSecondsDelta;

            // Update Section Log total seconds
            currSectionLog.ActiveSeconds += activeSecondsDelta;
            currSectionLog.InactiveSeconds += request.InactiveSecondsDelta;
            currSectionLog.LastHeartbeatAt = now;

            // Update Parent Session total seconds
            currSectionLog.Session.TotalActiveSeconds += activeSecondsDelta;
            currSectionLog.Session.TotalInactiveSeconds += request.InactiveSecondsDelta;
            currSectionLog.Session.LastHeartbeatAt = now;

            await UpdateProgressAsync(
                userId,
                currSectionLog.CourseId,
                currSectionLog.SectionId,
                activeSecondsDelta,
                now
            );

            await _db.SaveChangesAsync();

            return new ServiceResult<object>
            {
                Success = true,
                Data = new
                {
                    TotalActiveSeconds = currSectionLog.ActiveSeconds,
                    TotalInactiveSeconds = currSectionLog.InactiveSeconds
                },
                Message = "Heartbeat Recorded.",
            };
        }

        /// <summary>
        /// Caller: SessionController -> CreateSectionLog
        /// <para>Error Return Types: BadRequest, NotFound, Gone.</para>
        /// </summary>
        public async Task<ServiceResult<object>> NewSectionLogAsync(
            NewSectionLogRequest request,
            string userId
        )
        {
            if (request == null)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "Body cannot be null.",
                    ErrorType = ServiceErrorType.BadRequest
                };
            }

            // End old SectionLog
            var oldSectionLog = await _db.SectionLogs
                .Include(log => log.Session)
                .Where(log =>
                    log.Id == request.OldSectionLogId &&
                    log.SessionId == request.SessionId &&
                    log.CourseId == request.CourseId &&
                    log.Session.UserId == userId)
                .OrderByDescending(log => log.Id)
                .FirstOrDefaultAsync();

            if (oldSectionLog == null)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "SectionLog not found.",
                    ErrorType = ServiceErrorType.NotFound
                };
            }

            // TODO: Add the database function that cleans up stale/invalid sections 
            if (oldSectionLog.EndedAt != null)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "SectionLog has already ended",
                    ErrorType = ServiceErrorType.Gone
                };
            }

            if (request.OldInactiveSecondsDelta < 0)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "Inactive seconds cannot be negative.",
                    ErrorType = ServiceErrorType.BadRequest
                };
            }

            var parentSession = oldSectionLog.Session;

            // Calculate Dynamic Heartbeat Interval
            var maxAllowedDelta =
                _trackingSettings.Value.HeartbeatIntervalSeconds *
                _trackingSettings.Value.MaxMissedHeartbeatMultiplier;

            var now = DateTime.UtcNow;

            var elapsedSeconds = (now - oldSectionLog.LastHeartbeatAt).TotalSeconds;
            var cappedElapsedSeconds = Math.Min(elapsedSeconds, maxAllowedDelta);

            if (request.OldInactiveSecondsDelta > cappedElapsedSeconds)
            {
                return new ServiceResult<object>
                {
                    Success = false,
                    Message = "Inactive seconds cannot exceed elapsed time.",
                    ErrorType = ServiceErrorType.BadRequest
                };
            }

            var activeSecondsDelta = cappedElapsedSeconds - request.OldInactiveSecondsDelta;

            // Update SectionLog's tracking data and end log
            oldSectionLog.ActiveSeconds += activeSecondsDelta;
            oldSectionLog.InactiveSeconds += request.OldInactiveSecondsDelta;
            oldSectionLog.LastHeartbeatAt = now;
            oldSectionLog.EndedAt = now;

            // Update Parent Session's tracking data
            parentSession.TotalActiveSeconds += activeSecondsDelta;
            parentSession.TotalInactiveSeconds += request.OldInactiveSecondsDelta;
            parentSession.LastHeartbeatAt = now;

            // Create new SectionLog
            var sectionLog = CreateDefaultSectionLog(
                oldSectionLog.SessionId,
                parentSession.CourseId,
                request.NewChapterId,
                request.NewSectionId,
                now
            );
            _db.SectionLogs.Add(sectionLog);
            await _db.SaveChangesAsync();

            return new ServiceResult<object>
            {
                Success = true,
                Data = new
                {
                    SessionId = sectionLog.SessionId,
                    SectionLogId = sectionLog.Id,
                },
            };

        }

        // TODO: Polish logic/organize conditions
        /// <summary>
        /// Caller: SessionController: End Session
        /// <para> Error Return Types: BadRequest, NotFound, Gone. </para>
        /// </summary>
        public async Task<ServiceResult<object>> EndAsync(
            SessionEndRequest request,
            string userId
        )
        {
            if (request == null)
            {
                return ServiceResultMessage<object>(
                    ServiceErrorType.BadRequest,
                    "Body cannot be null."
                );
            }

            if (request.SessionId <= 0)
            {
                return ServiceResultMessage<object>(
                    ServiceErrorType.BadRequest,
                    "SessionId is required."
                );
            }

            var maxAllowedDelta =
                _trackingSettings.Value.HeartbeatIntervalSeconds *
                _trackingSettings.Value.MaxMissedHeartbeatMultiplier;

            if (request.InactiveSecondsDelta < 0 ||
                request.InactiveSecondsDelta > maxAllowedDelta)
            {
                return ServiceResultMessage<object>(
                    ServiceErrorType.BadRequest,
                    "Invalid inactive seconds delta."
                );
            }

            var session = await _db.Sessions
                .OrderByDescending(s => s.Id)
                .FirstOrDefaultAsync(s =>
                    s.Id == request.SessionId &&
                    s.UserId == userId);

            if (session == null)
            {
                return ServiceResultMessage<object>(
                    ServiceErrorType.NotFound,
                    "Session not found for this user."
                );
            }

            if (!session.IsActive || session.EndedAt != null)
            {
                return ServiceResultMessage<object>(
                    ServiceErrorType.Gone,
                    "Session has already ended."
                );
            }

            // * Find most recent sectionLog based on recent ID
            // * if client sent an already closed section.
            var sectionLog = await _db.SectionLogs
                    .Include(log => log.Session)
                    .Where(log =>
                        log.SessionId == session.Id &&
                        log.Session.UserId == userId &&
                        log.EndedAt == null)
                    .OrderByDescending(log => log.Id)
                    .FirstOrDefaultAsync();

            var now = DateTime.UtcNow;

            // Only change data to sectionLog if found.
            // If not found, only edit Session
            if (sectionLog != null)
            {
                var elapsedSeconds = (now - sectionLog.LastHeartbeatAt).TotalSeconds;


                if (elapsedSeconds < 0)
                {
                    return ServiceResultMessage<object>(
                        ServiceErrorType.BadRequest,
                        "Elapsed seconds cannot be negative."
                    );
                }

                var cappedElapsedSeconds = Math.Min(elapsedSeconds, maxAllowedDelta);

                if (request.InactiveSecondsDelta > cappedElapsedSeconds)
                {
                    return ServiceResultMessage<object>(
                        ServiceErrorType.BadRequest,
                        "Inactive seconds cannot exceed elapsed time."
                    );
                }

                var activeSecondsDelta = cappedElapsedSeconds - request.InactiveSecondsDelta;

                // Add time from last heartbeat before ending.
                // End sectionLog before closing every open sectionLog
                // so it doesn't add an extra cappedElapsedSeconds.

                sectionLog.ActiveSeconds += activeSecondsDelta;
                sectionLog.InactiveSeconds += request.InactiveSecondsDelta;
                sectionLog.LastHeartbeatAt = now;
                sectionLog.EndedAt = now;

                session.TotalActiveSeconds += activeSecondsDelta;
                session.TotalInactiveSeconds += request.InactiveSecondsDelta;
            }

            // Cleanup all unended SectionLogs
            await EndOpenSectionLogsForSessionAsync(session, now, userId);

            if (session.EndedAt == null)
            {
                session.EndedAt = now;
            }
            session.IsActive = false;
            session.LastHeartbeatAt = now;

            await _db.SaveChangesAsync();

            return new ServiceResult<object>
            {
                Success = true,
                Data = new
                {
                    EndedSessionId = session.Id,
                },
            };
        }

        // Helper Return Function

        // ! Generic for future models
        /// <summary>
        /// Return function template.
        /// Uses generic types for future model implementation.
        /// </summary>
        public ServiceResult<T> ServiceResultMessage<T>(
            ServiceErrorType errorType,
            string message
        )
        {
            return new ServiceResult<T>
            {
                Success = false,
                Message = message,
                ErrorType = errorType
            };
        }

        /// <summary>
        /// Finds open section logs that exceeded the idle timeout threshold
        /// and automatically closes them as inactive/timed-out.
        /// </summary>
        public async Task<List<SectionLog>> ExpireInactiveSectionLogsAsync(
            DateTime now,
            string userId
        )
        {
            var updatedSections = new List<SectionLog>();

            var cutoff = now.AddSeconds(-_trackingSettings.Value.IdleTimeoutSeconds);

            var staleSectionLogs = await _db.SectionLogs
                .Include(log => log.Session)
                .Where(log =>
                    log.Session.UserId == userId &&
                    log.EndedAt == null &&
                    log.LastHeartbeatAt < cutoff)
                .ToListAsync();

            foreach (var log in staleSectionLogs)
            {
                log.EndedAt = log.LastHeartbeatAt.AddSeconds(
                    _trackingSettings.Value.IdleTimeoutSeconds
                );

                log.InactiveSeconds += _trackingSettings.Value.IdleTimeoutSeconds;

                log.Session.TotalInactiveSeconds +=
                    _trackingSettings.Value.IdleTimeoutSeconds;

                updatedSections.Add(log);
            }

            await _db.SaveChangesAsync();

            return updatedSections;
        }

        /// <summary>
        /// End all SectionLogs under Parent Session.
        /// Add maximum inactive time to all EndOpen SectionLogs
        /// </summary>
        private async Task<List<SectionLog>> EndOpenSectionLogsForSessionAsync(
            Session session,
            DateTime now,
            string userId
        )
        {
            var maxAllowedDelta =
                _trackingSettings.Value.HeartbeatIntervalSeconds *
                _trackingSettings.Value.MaxMissedHeartbeatMultiplier;

            var openSectionLogs = await _db.SectionLogs
                .Include(log => log.Session)
                .Where(log =>
                    log.SessionId == session.Id &&
                    log.EndedAt == null &&
                    log.Session.UserId == userId)
                .ToListAsync();

            foreach (var log in openSectionLogs)
            {
                var elapsedSeconds = (now - log.LastHeartbeatAt).TotalSeconds;
                var cappedElapsedSeconds = Math.Min(elapsedSeconds, maxAllowedDelta);

                log.ActiveSeconds += cappedElapsedSeconds;
                log.LastHeartbeatAt = now;
                log.EndedAt = now;

                session.TotalActiveSeconds += cappedElapsedSeconds;
            }

            return openSectionLogs;
        }

        private async Task UpdateProgressAsync(
            string userId,
            int courseId,
            int sectionId,
            double activeSecondsDelta,
            DateTime now)
        {
            var courseProgress = await _db.UserCourseProgresses
                .FirstOrDefaultAsync(p =>
                    p.UserId == userId &&
                    p.CourseId == courseId);

            if (courseProgress == null)
            {
                courseProgress = new UserCourseProgress
                {
                    UserId = userId,
                    CourseId = courseId,
                    StartedAt = now,
                    LastAccessedAt = now,
                    LastSectionId = sectionId,
                    TotalActiveSeconds = 0,
                    ProgressPercent = 0
                };

                _db.UserCourseProgresses.Add(courseProgress);
            }

            var sectionProgress = await _db.UserSectionProgresses
                .FirstOrDefaultAsync(p =>
                    p.UserId == userId &&
                    p.SectionId == sectionId);

            if (sectionProgress == null)
            {
                sectionProgress = new UserSectionProgress
                {
                    UserId = userId,
                    CourseId = courseId,
                    SectionId = sectionId,
                    StartedAt = now,
                    LastAccessedAt = now,
                    ActiveSecondsWatched = 0,
                    IsCompleted = false
                };

                _db.UserSectionProgresses.Add(sectionProgress);
            }

            sectionProgress.ActiveSecondsWatched += activeSecondsDelta;
            sectionProgress.LastAccessedAt = now;

            courseProgress.TotalActiveSeconds += activeSecondsDelta;
            courseProgress.LastAccessedAt = now;
            courseProgress.LastSectionId = sectionId;
        }

    }
}