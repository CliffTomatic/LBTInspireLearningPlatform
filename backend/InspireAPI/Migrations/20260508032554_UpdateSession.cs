using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InspireAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SectionLog_Sessions_SessionId",
                table: "SectionLog");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SectionLog",
                table: "SectionLog");

            migrationBuilder.RenameTable(
                name: "SectionLog",
                newName: "SectionLogs");

            migrationBuilder.RenameIndex(
                name: "IX_SectionLog_SessionId",
                table: "SectionLogs",
                newName: "IX_SectionLogs_SessionId");

            migrationBuilder.AlterColumn<double>(
                name: "TotalInactiveSeconds",
                table: "Sessions",
                type: "REAL",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<double>(
                name: "TotalActiveSeconds",
                table: "Sessions",
                type: "REAL",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SectionLogs",
                table: "SectionLogs",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SectionLogs_Sessions_SessionId",
                table: "SectionLogs",
                column: "SessionId",
                principalTable: "Sessions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SectionLogs_Sessions_SessionId",
                table: "SectionLogs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SectionLogs",
                table: "SectionLogs");

            migrationBuilder.RenameTable(
                name: "SectionLogs",
                newName: "SectionLog");

            migrationBuilder.RenameIndex(
                name: "IX_SectionLogs_SessionId",
                table: "SectionLog",
                newName: "IX_SectionLog_SessionId");

            migrationBuilder.AlterColumn<int>(
                name: "TotalInactiveSeconds",
                table: "Sessions",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "REAL");

            migrationBuilder.AlterColumn<int>(
                name: "TotalActiveSeconds",
                table: "Sessions",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "REAL");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SectionLog",
                table: "SectionLog",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SectionLog_Sessions_SessionId",
                table: "SectionLog",
                column: "SessionId",
                principalTable: "Sessions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
