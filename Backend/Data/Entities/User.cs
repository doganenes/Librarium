namespace Backend.Data.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public List<Book> ReadBooks { get; set; }
        public List<Book> BorrowBooks { get; set; }
        public List<Book> FavouriteBooks { get; set; }
        public bool Status { get; set; }
    }
}