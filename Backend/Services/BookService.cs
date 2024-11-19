using Backend.Data.Context;
using Backend.Data.Entities;
using Backend.Services;
using Microsoft.EntityFrameworkCore;

public class BookService : IBookService
{
    private readonly LibraryContext _libraryContext;

    public BookService(LibraryContext libraryContext)
    {
        _libraryContext = libraryContext;
    }

    public async Task<List<Book>> GetAllBooksAsync()
    {
        return await _libraryContext.Books.ToListAsync();
    }
}
