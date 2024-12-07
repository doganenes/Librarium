﻿using Backend.Data.Entities;
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
       
        // ID ile kullanıcı bulmak
        public User GetUserById(int id)
        {
            return _userRepository.GetById(id);
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
