namespace Backend.Data.Entities
{
    public class Book
    {
        public string BookID { get; set; }
        public string BookName { get; set; }
        public string BookTitle { get; set; }
        public string BooksAuthor { get; set; }
        public DateTime YearOfPublication { get; set; }
        public string Publisher { get; set; }
        public string ImageUrl { get; set; }
        public bool Availability { get; set; }
        public string BookShelf { get; set; }

    }
}
