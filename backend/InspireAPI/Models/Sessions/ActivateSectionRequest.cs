public class ActivateSectionRequest
{
    public int CourseId { get; set; }
    public int ChapterId { get; set; }
    public int SectionId { get; set; }
    public double InactiveSecondsDelta { get; set; }
}