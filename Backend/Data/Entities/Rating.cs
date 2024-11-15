namespace Backend.Data.Entities
{
    public class Rating
    {
        public int RatingId { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public string BookId { get; set; }
        public int RatingValue { get; set; }

    }
}
