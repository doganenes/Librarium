namespace Backend.Data.Entities
{
    public class Borrow
    {
        public int BorrowId { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public Book Book { get; set; }
        public int BookId { get; set; }
        public DateTime BorrowDate { get; set; }
        public DateTime ReturnDate { get; set; }
    }
}
