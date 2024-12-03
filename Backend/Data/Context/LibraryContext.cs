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

            
        }

        // tabloları db set
        public DbSet<Book> Books { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Borrow> Borrows { get; set; }
        public DbSet<Review> Reviews { get; set; }


    }
}
