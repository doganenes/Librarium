using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

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
        public bool? Availability { get; set; }
        public string? BookShelf { get; set; }
        public decimal? AvgRating { get; set; }
        public ICollection<Borrow>? Borrows { get; set; }
        public ICollection<Review>? Reviews { get; set; }
        
        public ICollection<User> FavoritedBy { get; set; } = new Collection<User>();
    }
}