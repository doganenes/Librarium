﻿using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Entities
{
    public class Review
    {

        [Key]
        public int ReviewId { get; set; }
        public string? Description { get; set; }
        public int ReviewRate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public User? User { get; set; }
        public Book? Book { get; set; }
       

    }
}
