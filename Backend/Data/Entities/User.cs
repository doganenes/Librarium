﻿using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Entities
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Role { get; set; }
        public ICollection<Borrow>? BorrowBooks { get; set; }
        public ICollection<Book>? FavouriteBooks { get; set; }
        public ICollection<Review>? Reviews { get; set; }
    }
}