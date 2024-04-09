using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace fancast.Migrations
{
    /// <inheritdoc />
    public partial class CastingsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActorIds",
                table: "characters");

            migrationBuilder.CreateTable(
                name: "castings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CharacterId = table.Column<int>(type: "integer", nullable: false),
                    ActorId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_castings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_castings_characters_CharacterId",
                        column: x => x.CharacterId,
                        principalTable: "characters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_castings",
                columns: table => new
                {
                    CastingsId = table.Column<int>(type: "integer", nullable: false),
                    UsersId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_castings", x => new { x.CastingsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_user_castings_castings_CastingsId",
                        column: x => x.CastingsId,
                        principalTable: "castings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_castings_users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_castings_CharacterId",
                table: "castings",
                column: "CharacterId");

            migrationBuilder.CreateIndex(
                name: "IX_user_castings_UsersId",
                table: "user_castings",
                column: "UsersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_castings");

            migrationBuilder.DropTable(
                name: "castings");

            migrationBuilder.AddColumn<int[]>(
                name: "ActorIds",
                table: "characters",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0]);
        }
    }
}
