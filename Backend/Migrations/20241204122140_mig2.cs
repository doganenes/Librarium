using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class mig2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookUser_Users_UsersUserId",
                table: "BookUser");

            migrationBuilder.DropForeignKey(
                name: "FK_Borrows_Books_BookISBN",
                table: "Borrows");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BookUser",
                table: "BookUser");

            migrationBuilder.DropIndex(
                name: "IX_BookUser_UsersUserId",
                table: "BookUser");

            migrationBuilder.RenameColumn(
                name: "UsersUserId",
                table: "BookUser",
                newName: "FavoritedByUserId");

            migrationBuilder.AlterColumn<string>(
                name: "FirstName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "ISBN",
                table: "Reviews",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ISBN",
                table: "Borrows",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "BookISBN",
                table: "Borrows",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_BookUser",
                table: "BookUser",
                columns: new[] { "FavoritedByUserId", "FavouriteBooksISBN" });

            migrationBuilder.CreateIndex(
                name: "IX_BookUser_FavouriteBooksISBN",
                table: "BookUser",
                column: "FavouriteBooksISBN");

            migrationBuilder.AddForeignKey(
                name: "FK_BookUser_Users_FavoritedByUserId",
                table: "BookUser",
                column: "FavoritedByUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Borrows_Books_BookISBN",
                table: "Borrows",
                column: "BookISBN",
                principalTable: "Books",
                principalColumn: "ISBN",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookUser_Users_FavoritedByUserId",
                table: "BookUser");

            migrationBuilder.DropForeignKey(
                name: "FK_Borrows_Books_BookISBN",
                table: "Borrows");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BookUser",
                table: "BookUser");

            migrationBuilder.DropIndex(
                name: "IX_BookUser_FavouriteBooksISBN",
                table: "BookUser");

            migrationBuilder.DropColumn(
                name: "ISBN",
                table: "Reviews");

            migrationBuilder.RenameColumn(
                name: "FavoritedByUserId",
                table: "BookUser",
                newName: "UsersUserId");

            migrationBuilder.AlterColumn<string>(
                name: "FirstName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ISBN",
                table: "Borrows",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BookISBN",
                table: "Borrows",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BookUser",
                table: "BookUser",
                columns: new[] { "FavouriteBooksISBN", "UsersUserId" });

            migrationBuilder.CreateIndex(
                name: "IX_BookUser_UsersUserId",
                table: "BookUser",
                column: "UsersUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_BookUser_Users_UsersUserId",
                table: "BookUser",
                column: "UsersUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Borrows_Books_BookISBN",
                table: "Borrows",
                column: "BookISBN",
                principalTable: "Books",
                principalColumn: "ISBN");
        }
    }
}
