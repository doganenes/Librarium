using Backend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.Context
{
    public class LibraryContext : DbContext
    {
        public LibraryContext(DbContextOptions<LibraryContext> options)
           : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            // user->Borrow İlişkisi
            modelBuilder.Entity<Borrow>()
            .HasOne(b => b.User)
            .WithMany(u => u.BorrowBooks)
            .HasForeignKey(b => b.UserId);

            // Book -> Borrow İlişkisi
            modelBuilder.Entity<Borrow>()
                .HasOne(b => b.Book)
                .WithMany(bk => bk.Borrows)
                .HasForeignKey(b => b.ISBN);

            // User -> FavoriteBooks -> Book (N -> N İlişkisi)
            modelBuilder.Entity<UserFavouriteBook>()
                .HasKey(uf => new { uf.UserId, uf.ISBN });

            modelBuilder.Entity<UserFavouriteBook>()
                .HasOne(uf => uf.User)
                .WithMany(u => u.FavouriteBooks)
                .HasForeignKey(uf => uf.UserId);

            modelBuilder.Entity<UserFavouriteBook>()
                .HasOne(uf => uf.Book)
                .WithMany(bk => bk.FavouriteBooks)
                .HasForeignKey(uf => uf.ISBN);
        }

        // tabloları db set
        public DbSet<Book> Books { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Borrow> Borrows { get; set; }
        public DbSet<UserFavouriteBook> UserFavouriteBooks { get; set; }
    }
}
