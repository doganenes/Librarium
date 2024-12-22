namespace Backend.Dtos
{
    public class AddBookDto
    {
        public string? ISBN { get; set; }
        public string? BookTitle { get; set; }
        public string? BookAuthor { get; set; }
        public Int16? YearOfPublication { get; set; }
        public string? Publisher { get; set; }
        public string? ImageURL { get; set; }
        public string? BookShelf { get; set; }
    }
}
