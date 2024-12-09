using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Repositories.Abstract;
using Backend.Repositories.Concrete;
using Microsoft.EntityFrameworkCore;
using Backend.Utils.Security;
using System.Linq;
using System.Collections.ObjectModel;

namespace Backend.Services
{
    public class UserService
    {

        private readonly IRepository<User> _userRepository;
        private readonly IRepository<Book> _bookRepository;

        public UserService(IRepository<User> userRepository, IRepository<Book> bookRepository)
        {
            _userRepository = userRepository;
            _bookRepository = bookRepository;
        }

        public User GetUserById(string userId)
        {
            return _userRepository.GetById(userId);
        }

        public void UpdateUser(User user)
        {
            _userRepository.Update(user);
        }

        public void DeleteUser(string userId)
        {
            var user = _userRepository.GetById(userId);
            if (user != null)
            {
                _userRepository.Delete(user);
            }
        }

        public void AddFavoriteBook(string userId, string ISBN)
        {
            var user = _userRepository.GetById(userId);
            var book = _bookRepository.GetById(ISBN);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            if (book == null)
            {
                throw new KeyNotFoundException("Book not found");
            }

            if (user.FavouriteBooks == null)
            {
                user.FavouriteBooks = new Collection<Book>();
            }

            if (book.FavoritedBy == null)
            {
                book.FavoritedBy = new Collection<User>();
            }

            if (!user.FavouriteBooks.Contains(book))
            {
                user.FavouriteBooks.Add(book);
                book.FavoritedBy.Add(user);

                _userRepository.Update(user);
                _bookRepository.Update(book);
            }
            else
            {
                throw new InvalidOperationException("Book is already in favourites!");
            }
        }


        public void RemoveFavouriteBook(string userId, string ISBN)
        {
            var user = _userRepository.GetById(userId);
            var book = _bookRepository.GetById(ISBN);
            Console.WriteLine(book);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            if (user.FavouriteBooks == null || !user.FavouriteBooks.Any())
            {
                throw new InvalidOperationException("User has no favourite books.");
            }

            if (book == null)
            {
                throw new KeyNotFoundException("Book not found in user's favourites.");
            }

            user.FavouriteBooks.Remove(book);

            _userRepository.Update(user);
        }

    }
}
