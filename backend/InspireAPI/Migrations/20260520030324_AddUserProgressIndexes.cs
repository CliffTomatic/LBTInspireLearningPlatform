using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InspireAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddUserProgressIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserSectionProgresses_UserId_SectionId",
                table: "UserSectionProgresses");

            migrationBuilder.CreateIndex(
                name: "IX_UserSectionProgresses_UserId_CourseId_SectionId",
                table: "UserSectionProgresses",
                columns: new[] { "UserId", "CourseId", "SectionId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserSectionProgresses_UserId_CourseId_SectionId",
                table: "UserSectionProgresses");

            migrationBuilder.CreateIndex(
                name: "IX_UserSectionProgresses_UserId_SectionId",
                table: "UserSectionProgresses",
                columns: new[] { "UserId", "SectionId" },
                unique: true);
        }
    }
}
