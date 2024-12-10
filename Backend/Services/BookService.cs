using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Repositories.Abstract;
using Backend.Repositories.Concrete;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

public class BookService
{
    private readonly IRepository<Book> _bookRepository;

    public BookService(IRepository<Book> bookRepository)
    {
        _bookRepository = bookRepository;
    }

    public async Task<IQueryable<Book>> GetAllAsync()
    {
        return _bookRepository.GetAll();
    }

    public async Task<List<Book>> SearchBooksAsync(BookDto filter)
    {
        IQueryable<Book> query = _bookRepository.GetAll(); 

       
        if (!string.IsNullOrEmpty(filter.ISBN))
        {
            query = query.Where(b => b.ISBN.ToLower().Contains(filter.ISBN.ToLower()));
        }
        if (!string.IsNullOrEmpty(filter.Author))
        {
            query = query.Where(b => b.BookAuthor.ToLower().Contains(filter.Author.ToLower()));
        }
        if (!string.IsNullOrEmpty(filter.Title))
        {
            query = query.Where(b => b.BookTitle.ToLower().Contains(filter.Title.ToLower()));
        }

        return await query.ToListAsync();
    }






}
