using InspireAPI.Common;
using InspireAPI.Models;
using InspireAPI.Data;
using Microsoft.Extensions.Options;
using InspireAPI.Settings;
using Microsoft.EntityFrameworkCore;
using System.Collections;


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
            double activeSeconds = 0,
            double inactiveSeconds = 0
        )
        {
            var now = DateTime.UtcNow;

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
                .FirstOrDefaultAsync(log =>
                    log.Id == request.SectionLogId &&
                    log.SessionId == request.SessionId &&
                    log.Session.UserId == userId &&
                    log.EndedAt == null);

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
                .FirstOrDefaultAsync(log =>
                    log.Id == request.OldSectionLogId &&
                    log.SessionId == request.SessionId &&
                    log.Session.CourseId == request.CourseId &&
                    log.Session.UserId == userId
                );

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

            // Add remaining time to old SectionLog
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
                request.NewSectionId
            );
            _db.SectionLogs.Add(sectionLog);
            await _db.SaveChangesAsync();

            return new ServiceResult<object>
            {
                Success = true,
                Data = new
                {
                    SessionId = sectionLog.Session.Id,
                    SectionLogId = sectionLog.Id,
                },
            };

        }
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

            if (request.SectionLogId <= 0)
            {
                return ServiceResultMessage<object>(
                    ServiceErrorType.BadRequest,
                    "SectionLogId is required."
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

            var sectionLog = await _db.SectionLogs
                .FirstOrDefaultAsync(s =>
                    s.Id == request.SectionLogId &&
                    s.SessionId == session.Id &&
                    s.Session.UserId == userId);

            if (sectionLog == null)
            {
                return ServiceResultMessage<object>(
                    ServiceErrorType.NotFound,
                    "Section log not found for this session."
                );
            }

            var now = DateTime.UtcNow;

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

            return new ServiceResult<object>
            {
                Success = true,
                Data = new
                {
                    EndedSessionId = session.Id,
                    SectionLogId = sectionLog.Id
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
    }
}