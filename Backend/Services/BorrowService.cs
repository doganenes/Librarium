using Backend.Data.Context;
using Backend.Data.Entities;
using Backend.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
public class BorrowService
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Book> _bookRepository;
    private readonly LibraryContext _dbContext;

    public BorrowService(IRepository<User> userRepository, IRepository<Book> bookRepository, LibraryContext dbContext)
    {
        _userRepository = userRepository;
        _bookRepository = bookRepository;
        _dbContext = dbContext;
    }

    public async Task BorrowBookAsync(string userId, string ISBN)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserId == userId);


        var overdueBooks = _dbContext.Borrows
            .Where(b => b.UserId == userId)
            .Where(b => EF.Functions.DateDiffDay(b.BorrowDate, DateTime.Now) > 14)
            .Where(b => EF.Functions.DateDiffDay(b.BorrowDate, b.ReturnDate) >= 14) // not returned
            .Count();

        var book = await _dbContext.Books.FirstOrDefaultAsync(b => b.ISBN == ISBN);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        if (book == null)
            throw new KeyNotFoundException("Book not found.");

        if (book.Availability == false)
            throw new InvalidOperationException("This book is already borrowed by another user.");

        if (overdueBooks >= 2)
            throw new InvalidOperationException("This user has been blacklisted.");
        if (await _dbContext.Borrows.CountAsync(b => b.UserId == userId && b.ReturnDate >= DateTime.Now) >= 2)
        {
            throw new InvalidOperationException("Users can only borrow up to 2 books at a time.");
        }


        var borrow = new Borrow
        {
            UserId = userId,
            BookISBN = ISBN,
            BorrowDate = DateTime.Now,
            ReturnDate = DateTime.Now.AddDays(14)
        };

        book.Availability = false;

        await _dbContext.Borrows.AddAsync(borrow);
        _dbContext.Books.Update(book);
        await _dbContext.SaveChangesAsync();
    }


    public async Task ReturnBookAsync(string userId, string ISBN)
    {
        var borrow = await _dbContext.Borrows
            .OrderBy(b => b.BorrowDate)
            .LastOrDefaultAsync(b => b.UserId == userId && b.BookISBN == ISBN);

        if (borrow == null)
            throw new InvalidOperationException("The book is not currently borrowed by the user.");

        var book = await _dbContext.Books.FirstOrDefaultAsync(b => b.ISBN == ISBN);
        if (book == null)
            throw new KeyNotFoundException("Book not found.");

        if (DateTime.Now >= borrow.ReturnDate) // return date expired
        {
            throw new InvalidOperationException("Either the book has been returned already, or the return time expired.");
        }

        book.Availability = true;

        borrow.ReturnDate = DateTime.Now;

        _dbContext.Borrows.Update(borrow);
        _dbContext.Books.Update(book);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<Borrow>> CheckOverdueBooksAsync()
    {
        var overdueBooks = _dbContext.Borrows
            .Where(b => EF.Functions.DateDiffDay(b.BorrowDate, DateTime.Now) > 14)
            .Where(b => EF.Functions.DateDiffDay(b.BorrowDate, b.ReturnDate) >= 14) // not returned
            .Include(b => b.Book)
            .Include(b => b.User)
            .ToList();

        return overdueBooks;
    }

    public async Task<List<Borrow>> GetBorrowsByUserIdAsync(string userId)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null)
            throw new KeyNotFoundException("User not found.");

        var borrows = await _dbContext.Borrows
            .Include(b => b.Book)
            .Where(b => b.UserId == userId)
            .ToListAsync();
        return borrows;
    }
}