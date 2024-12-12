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

        var book = await _dbContext.Books.FirstOrDefaultAsync(b => b.ISBN == ISBN);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        if (book == null)
            throw new KeyNotFoundException("Book not found.");
        var activeBorrow = await _dbContext.Borrows
            .FirstOrDefaultAsync(b => b.BookISBN == ISBN && b.ReturnDate > DateTime.Now);

        if (activeBorrow != null)
            throw new InvalidOperationException("This book is already borrowed by another user.");

        var borrowLimitDate = DateTime.Now.AddDays(14);
        if (await _dbContext.Borrows.CountAsync(b => b.UserId == userId && b.ReturnDate <= borrowLimitDate) >= 2)
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

        await _dbContext.Borrows.AddAsync(borrow);
        await _dbContext.SaveChangesAsync();
    }

    public async Task ReturnBookAsync(string userId, string ISBN)
    {
        var borrowLimitDate = DateTime.Now.AddDays(14);

        var borrow = await _dbContext.Borrows
            .FirstOrDefaultAsync(b => b.UserId == userId && b.BookISBN == ISBN && b.ReturnDate == null);

        if (borrow == null)
            throw new InvalidOperationException("The book is not currently borrowed by the user.");

        borrow.ReturnDate = DateTime.Now;

        _dbContext.Borrows.Update(borrow);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<string>> CheckOverdueBooksAsync()
    {
        var borrowLimitDate = DateTime.Now.AddDays(14);
        var overdueBooks = await _dbContext.Borrows
            .Where(b => EF.Functions.DateDiffDay(b.BorrowDate, DateTime.Now) > 14 && b.ReturnDate == borrowLimitDate)
            .Select(b => b.BookISBN)
            .ToListAsync();

        return overdueBooks;
    }
}
