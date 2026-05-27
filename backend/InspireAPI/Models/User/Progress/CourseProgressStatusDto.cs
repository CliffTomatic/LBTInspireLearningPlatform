namespace InspireAPI.Models.Progress;

// Learnbar/sidebar DTO for updating progress.
public class CourseProgressStatusDto
{
    public string Message { get; set; } = "";

    public int CourseId { get; set; }

    public string CourseSlug { get; set; } = "";

    public bool IsEnrolled { get; set; }

    public int TotalSections { get; set; }

    public int CompletedSectionCount { get; set; }

    public int ProgressPercent { get; set; }

    public List<int> CompletedSectionIds { get; set; } = [];
}