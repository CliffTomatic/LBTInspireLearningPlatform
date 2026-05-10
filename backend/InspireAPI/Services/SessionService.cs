using InspireAPI.Models;
namespace InspireAPI.Services
{
    public class SessionService
    {
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
    }
}