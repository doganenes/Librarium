using Backend.Data.Context;
using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Repositories.Abstract;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Backend.Services
{
    public class UserService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<Book> _bookRepository;
        private readonly LibraryContext _dbContext;

        public UserService(IRepository<User> userRepository, IRepository<Book> bookRepository, LibraryContext dbContext)
        {
            _userRepository = userRepository;
            _bookRepository = bookRepository;
            _dbContext = dbContext;
        }

        public void AddFavoriteBook(string userId, string ISBN)
        {
            var user = _dbContext.Users
                .Include(u => u.FavouriteBooks)
                .FirstOrDefault(u => u.UserId == userId);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            var book = _dbContext.Books.FirstOrDefault(b => b.ISBN == ISBN);

            if (book == null)
            {
                throw new KeyNotFoundException("Book not found.");
            }

            if (!user.FavouriteBooks.Contains(book))
            {
                user.FavouriteBooks.Add(book);

                _dbContext.SaveChanges();
            }
            else
            {
                throw new InvalidOperationException("The book is already in the user's favorite list.");
            }
            {


            }

        }

        public void RemoveFavoriteBook(string userId, string ISBN)
        {
            var user = _dbContext.Users
                    .Include(u => u.FavouriteBooks)
                    .FirstOrDefault(u => u.UserId == userId);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            var book = user.FavouriteBooks.FirstOrDefault(b => b.ISBN == ISBN);

            if (book == null)
            {
                throw new InvalidOperationException("The book is not in the user's favorite list.");
            }

            user.FavouriteBooks.Remove(book);
            _dbContext.SaveChanges();

        }

        public async Task<List<BookDTO>> GetUserFavoriteBooksAsync(string userID)
        {
            var user = await _dbContext.Users
                .Include(u => u.FavouriteBooks)
                .FirstOrDefaultAsync(u => u.UserId == userID);

            if (user == null)
            {
                return null; 
            }

            var favoriteBooks = user.FavouriteBooks.Select(book => new BookDTO
            {
                ISBN = book.ISBN,
                title = book.BookTitle,
                author = book.BookAuthor
            }).ToList();

            return favoriteBooks; 
        }





    }
}
