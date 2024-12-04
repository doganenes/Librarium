using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Entities
{
    public class Borrow
    {
        [Key]
        public int BorrowId { get; set; }
        public required User User { get; set; }
        public int UserId { get; set; }
        public required Book Book { get; set; }
        public string? ISBN { get; set; }
        public DateTime BorrowDate { get; set; }
        public DateTime ReturnDate { get; set; }
    }
}
