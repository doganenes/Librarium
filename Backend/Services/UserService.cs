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

        public  void AddFavoriteBook(string userId, string ISBN)
        {
            var user =  _dbContext.Users
                .Include(u => u.FavouriteBooks)
                .FirstOrDefault(u => u.UserId == userId);

            var book =  _dbContext.Books
                .Include(b => b.FavoritedBy) 
                .FirstOrDefault(b => b.ISBN == ISBN);


            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            if (book == null)
            {
                throw new KeyNotFoundException("Book not found.");
            }

            if (!user.FavouriteBooks.Contains(book))
            {
                // Add book to user's favorite list
                user.FavouriteBooks.Add(book);

                // Add user to book's favoritedBy list
                book.FavoritedBy.Add(user);

                // Save changes to database
                _dbContext.SaveChanges();
            }
            else
            {
                throw new InvalidOperationException("The book is already in the user's favorite list.");
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

        public async Task<List<BookDto>> GetUserFavoriteBooksAsync(string userID)
        {

            var user = await _dbContext.Users
                .Include(u => u.FavouriteBooks)
                .FirstOrDefaultAsync(u => u.UserId == userID);

            if (user == null)
            {
                throw new Exception("User Empty");
            }

            var favoriteBooks = user.FavouriteBooks?.Select(book => new BookDto
            {
                BookISBN = book.ISBN,
                Title = book.BookTitle,
                Author = book.BookAuthor
            }).ToList();

            return favoriteBooks;
        }





    }
}
