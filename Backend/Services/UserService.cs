using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Repositories.Abstract;
using Backend.Repositories.Concrete;
using Microsoft.EntityFrameworkCore;
using Backend.Utils.Security;

namespace Backend.Services
{
    public class UserService
    {

        private readonly IRepository<User> _userRepository;


        public UserService(IRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        // Kullanıcıları listelemek
        public List<User> GetAllUsers()
        {
            return _userRepository.GetListAll();
        }

        // ID ile kullanıcı bulmak
        public User GetUserById(int id)
        {
            return _userRepository.GetById(id);
        }

        // Yeni kullanıcı eklemek
    
        public User AddUser(UserDto userDto)
        {
            string hashedPassword = SecurityHelper.HashPasswordWithHmacSha256(userDto.Password);

            User user = new User()
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                Password = hashedPassword,
                PhoneNumber = userDto.PhoneNumber,
                Role = "user"
            };
            _userRepository.Insert(user);
            return user;
        }

        public void UpdateUser(User user)
        {
            _userRepository.Update(user);
        }

        public void DeleteUser(int id)
        {
            var user = _userRepository.GetById(id);
            if (user != null)
            {
                _userRepository.Delete(user);
            }
        }

    }
}
