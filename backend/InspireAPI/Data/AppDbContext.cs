using InspireAPI.Models;
using InspireAPI.Models.Progress;
using InspireAPI.Models.Courses;
using System.Text.Json;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace InspireAPI.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Session> Sessions { get; set; }
    public DbSet<SectionLog> SectionLogs { get; set; }

    // Course
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<CourseChapter> CourseChapters => Set<CourseChapter>();
    public DbSet<CourseSection> CourseSections => Set<CourseSection>();
    public DbSet<EbookBlock> EbookBlocks => Set<EbookBlock>();

    // User Progress
    public DbSet<UserCourseProgress> UserCourseProgresses => Set<UserCourseProgress>();
    public DbSet<UserSectionProgress> UserSectionProgresses => Set<UserSectionProgress>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Session
        modelBuilder.Entity<Session>()
            .HasMany(s => s.SectionLogs)
            .WithOne(l => l.Session)
            .HasForeignKey(l => l.SessionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Course
        modelBuilder.Entity<Course>()
            .HasIndex(course => course.Slug)
            .IsUnique();

        modelBuilder.Entity<Course>()
            .Property(course => course.Level)
            .HasConversion<string>();

        modelBuilder.Entity<CourseSection>()
            .Property(section => section.Type)
            .HasConversion<string>();

        modelBuilder.Entity<EbookBlock>()
            .Property(block => block.Type)
            .HasConversion<string>();

        modelBuilder.Entity<Course>()
            .HasMany(course => course.Chapters)
            .WithOne(chapter => chapter.Course)
            .HasForeignKey(chapter => chapter.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CourseChapter>()
            .HasMany(chapter => chapter.Sections)
            .WithOne(section => section.CourseChapter)
            .HasForeignKey(section => section.CourseChapterId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CourseSection>()
            .HasMany(section => section.EbookBlocks)
            .WithOne(block => block.CourseSection)
            .HasForeignKey(block => block.CourseSectionId)
            .OnDelete(DeleteBehavior.Cascade);

        // User Progress
        modelBuilder.Entity<UserCourseProgress>()
            .HasIndex(p => new { p.UserId, p.CourseId })
            .IsUnique();

        modelBuilder.Entity<UserSectionProgress>()
            .HasIndex(p => new { p.UserId, p.SectionId })
            .IsUnique();
    }
}