using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InspireAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddUserProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserCourseProgresses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    CourseId = table.Column<int>(type: "INTEGER", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastAccessedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    LastSectionId = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalActiveSeconds = table.Column<double>(type: "REAL", nullable: false),
                    CompletedSectionCount = table.Column<int>(type: "INTEGER", nullable: false),
                    ProgressPercent = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserCourseProgresses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserSectionProgresses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    CourseId = table.Column<int>(type: "INTEGER", nullable: false),
                    SectionId = table.Column<int>(type: "INTEGER", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastAccessedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    LastPositionSeconds = table.Column<int>(type: "INTEGER", nullable: false),
                    ActiveSecondsWatched = table.Column<double>(type: "REAL", nullable: false),
                    IsCompleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSectionProgresses", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserCourseProgresses_UserId_CourseId",
                table: "UserCourseProgresses",
                columns: new[] { "UserId", "CourseId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserSectionProgresses_UserId_SectionId",
                table: "UserSectionProgresses",
                columns: new[] { "UserId", "SectionId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserCourseProgresses");

            migrationBuilder.DropTable(
                name: "UserSectionProgresses");
        }
    }
}
