using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Data.Entities
{
    public class Borrow
    {
        [Key]
        public int BorrowId { get; set; }

        //Navigation Properties for reach out to instances
        public User User { get; set; }
        public Book Book { get; set; }

        public string UserId { get; set; }
        public string? BookISBN { get; set; }

        public DateTime BorrowDate { get; set; }
        public DateTime ReturnDate { get; set; }
    }
}