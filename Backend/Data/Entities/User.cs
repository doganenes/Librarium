using System.ComponentModel.DataAnnotations;

namespace Backend.Data.Entities
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public ICollection<Book> ReadBooks { get; set; }
        public ICollection<Borrow> BorrowBooks { get; set; }
        public ICollection<UserFavouriteBook> FavouriteBooks { get; set; }
        public bool Status { get; set; }
    }
}