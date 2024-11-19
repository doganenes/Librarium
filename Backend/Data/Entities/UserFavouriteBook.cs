namespace Backend.Data.Entities
{
    public class UserFavouriteBook
    {
        public User User { get; set; }
        public int UserId { get; set; }
        public Book Book { get; set; }
        public string ISBN { get; set; }

    }
}
