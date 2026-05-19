namespace InspireAPI.Models.Auth
{
    public class UserEnrollmentStatusDto
    {
        public string Message { get; set; } = "";
        public int CourseId { get; set; }
        public string CourseSlug { get; set; } = "";
        public bool IsEnrolled { get; set; }
    }
}