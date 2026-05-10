using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InspireAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSectionLog_Heartbeat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastLog",
                table: "SectionLogs",
                newName: "LastHeartbeatAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastHeartbeatAt",
                table: "SectionLogs",
                newName: "LastLog");
        }
    }
}
