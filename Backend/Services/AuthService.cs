using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Repositories.Abstract;
using Backend.Utils.Security;

namespace Backend.Services
{
    public class AuthService
    {

        private readonly IRepository<User> _userRepository;
        private readonly IConfiguration configuration;

        public AuthService(IRepository<User> userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            this.configuration = configuration;
        }


        public User Register(UserDto userDto)
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

        public bool CheckEmailExists(string email)
        {
            return _userRepository.GetByEmail(u => u.Email == email) != null;
        }

        public Token Login(LoginDto loginDto)
        {
            // Veritabanında kullanıcıyı e-posta ile bul
            var user = _userRepository.GetByEmail(u => u.Email == loginDto.Email);

            
            // Şifre doğrulama
            bool isPasswordValid = SecurityHelper.VerifyPassword(loginDto.Password, user.Password);

            if (user !=null &&!isPasswordValid)
            {
                throw new Exception("Invalid password or email address.");
            }

            return Utils.Jwt.TokenHandler.CreateToken(configuration);
        }

    }
}
