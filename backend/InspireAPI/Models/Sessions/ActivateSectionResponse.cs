public class ActivateSectionResponse
{
    public int SessionId { get; set; }
    public int SectionLogId { get; set; }
    public bool CreatedNewSession { get; set; }
    public bool CreatedNewSectionLog { get; set; }
}