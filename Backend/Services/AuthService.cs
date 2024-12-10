﻿using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Repositories.Abstract;
using Backend.Utils.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Services
{
    public class AuthService
    {

        private readonly IRepository<User> _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IRepository<User> userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            this._configuration = configuration;
        }


        public User Register(UserDto userDto)
        {
            string hashedPassword = SecurityHelper.HashPasswordWithHmacSha256(userDto.Password);

            User user = new User()
            {
                UserId = Guid.NewGuid().ToString(),
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
            var user = _userRepository.GetByEmail(u => u.Email == loginDto.Email);

            if (user == null)
            {
                throw new Exception("Email address or password is invalid.");
            }

            bool isPasswordValid = SecurityHelper.VerifyPassword(loginDto.Password, user.Password);

            if (!isPasswordValid)
            {
                throw new Exception("Email address or password is invalid.");
            }

            // Create a token and return it
            return Utils.Jwt.TokenHandler.CreateToken(_configuration, user.UserId, user.FirstName);
        }


        public  string GetUserIdFromToken(string token, IConfiguration configuration)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(configuration["Token:securityKey"]);
            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false, // Set to true in production and specify the issuer
                    ValidateAudience = false, // Set to true in production and specify the audience
                    ClockSkew = TimeSpan.Zero // No buffer time for expiration
                }, out SecurityToken validatedToken);

                return principal.FindFirst(ClaimTypes.NameIdentifier)?.Value.ToString();
                
            }
            catch (Exception ex)
            {
                // Log error for debugging and troubleshooting
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return null; // Token validation failed
            }
        }

    }



}

