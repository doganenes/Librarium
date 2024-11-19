using Backend.Data.Entities;

namespace Backend.Services
{
    public interface IBookService
    {
        Task<List<Book>> GetAllBooksAsync();
    }
}