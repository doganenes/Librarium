using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Entities
{
    public class Borrow
    {
        [Key]
        public int BorrowId { get; set; }
        [Required]
        public User User { get; set; }
        public int UserId { get; set; }
        [Required]
        public Book Book { get; set; }
        public string? ISBN { get; set; }
        public DateTime BorrowDate { get; set; }
        public DateTime ReturnDate { get; set; }
    }
}
