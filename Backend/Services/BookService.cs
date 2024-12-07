using Backend.Data.Entities;
using Backend.Repositories.Abstract;

public class BookService
{
    private readonly IRepository<Book> _bookRepository;

    public BookService(IRepository<Book> bookRepository)
    {
        _bookRepository = bookRepository;
    }

    public async Task<List<Book>> GetAllBooksAsync()
    {
        var books = await _bookRepository.GetAllAsync();
        return books ?? new List<Book>();
    }
}
