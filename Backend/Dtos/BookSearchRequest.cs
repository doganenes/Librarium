namespace Backend.Dtos
{
    public class BookSearchRequest
    {
       public string? ISBN { get; set; }
       public  string? author { get; set; }
       public  string? title { get; set; }
    }
}
