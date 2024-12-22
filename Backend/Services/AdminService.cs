using Backend.Data.Context;
using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

public class AdminService
{
    private readonly IRepository<Book> _bookRepository;
    private readonly LibraryContext _context;

    public AdminService(IRepository<Book> bookRepository, LibraryContext context)
    {
        _bookRepository = bookRepository;
        _context = context;
    }

    public async Task AddNewBookAsync(AddBookDto bookDto)
    {
        var existingBook = await _context.Books
                                         .FirstOrDefaultAsync(b => b.ISBN == bookDto.ISBN);
        if (existingBook != null)
        {
            throw new InvalidOperationException("The book has already exists.");
        }

        var newBook = new Book
        {
            ISBN = bookDto.ISBN,
            BookTitle = bookDto.BookTitle,
            BookAuthor = bookDto.BookAuthor,
            YearOfPublication = bookDto.YearOfPublication,
            Publisher = bookDto.Publisher,
            ImageURL = bookDto.ImageURL,
            Availability = true,
            BookShelf = bookDto.BookShelf,
            AvgRating = 0
        };

        await _context.Books.AddAsync(newBook);
    }

}
