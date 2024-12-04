using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Entities
{
    public class Book
    {
        [Key]
        public string? ISBN { get; set; }
        public string? BookTitle { get; set; }
        public string? BookAuthor { get; set; }
        public Int16? YearOfPublication { get; set; }
        public string? Publisher { get; set; }
        public string? ImageURL { get; set; }
        public string? Availability { get; set; }
        public string? BookShelf { get; set; }
        public ICollection<Borrow>? Borrows { get; set; }
        public ICollection<Review>? Reviews { get; set; }
        public  ICollection<User>? FavoritedBy { get; set; }
    }
}
