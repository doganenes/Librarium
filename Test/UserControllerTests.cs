using Backend.Controllers;
using Backend.Data.Context;
using Backend.Data.Entities;
using Backend.Repositories.Abstract;
using Backend.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Test
{
    using Xunit.Abstractions;

    public class UserControllerTests
    {
        private readonly Mock<DbSet<User>> _userContext;
        private readonly UserService _userService;
        private readonly UserController _controller;
        private readonly IRepository<User> _userRepository;
        private readonly LibraryContext _libraryContext;
        private readonly ITestOutputHelper _output;

        public UserControllerTests(ITestOutputHelper output)
        {
            _userContext = new Mock<DbSet<User>>();
            _userService = new UserService(_libraryContext);
            _controller = new UserController(_userService);
            _output = output; // Injected test output helper
        }

        [Fact]
        public async Task GetUser_ShouldReturnOk_WhenUserExists()
        {
            var userId = "e69418db-8ca6-4db6-9092-beac26e6bf3f";
            var user = new User
            {
                UserId = userId,
                FirstName = "Eda",
                LastName = "Yılmaz",
                Email = "eda@mail.com"
            };

            var mockUserService = new Mock<UserService>();
            mockUserService.Setup(s => s.GetUserByIdAsync(userId)).ReturnsAsync(user);

            var userController = new UserController(mockUserService.Object); // Inject mocked service

            var result = await userController.GetUserById(userId);

            _output.WriteLine($"Result Type: {result.GetType()}");
            if (result is OkObjectResult okResult)
            {
                _output.WriteLine($"OkObjectResult Value: {okResult.Value}");
            }

            result.Should().BeOfType<OkObjectResult>();
            var okObjectResult = result as OkObjectResult;

            okObjectResult.Value.Should().BeEquivalentTo(new
            {
                user.UserId,
                user.FirstName,
                user.LastName,
                user.Email
            });
        }
    }

}