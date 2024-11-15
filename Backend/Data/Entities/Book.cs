namespace Backend.Data.Entities
{
    public class Book
    {
        public string BookID { get; set; }
        public string BookTitle { get; set; }
        public string Author { get; set; }
        public DateTime YearOfPublication { get; set; }
        public string Publisher { get; set; }
        public string ImageUrl { get; set; }
        public bool BookStatus { get; set; }

    }
}
