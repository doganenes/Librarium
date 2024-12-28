using Backend.Controllers;
using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Repositories.Abstract;
using Backend.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit.Abstractions;

namespace Test
{
    public class AuthControllerTests
    {
        private readonly Mock<IRepository<User>> _mockAuthRepository;
        private readonly AuthService _authService;
        private readonly AuthController _authController;
        private readonly ITestOutputHelper _output;
        private readonly IConfiguration _configuration;

        public AuthControllerTests(ITestOutputHelper output)
        {
            _mockAuthRepository = new Mock<IRepository<User>>();
            _authService = new AuthService(_mockAuthRepository.Object, _configuration);
            _authController = new AuthController(_configuration,_authService);
            _output = output; 
        }

        [Fact]
        public async Task Login_ShouldReturnToken_WhenLoginIsSuccessful()
        {
            var loginDto = new LoginDto
            {
                Email = "b@b.com",
                Password = "B"
            };
          
            var token = new Token { AccessToken = "jwt-token" };
            var mockAuthService = new Mock<AuthService>(_mockAuthRepository.Object, _configuration);
            mockAuthService
                .Setup(x => x.Login(loginDto))
                .Returns(token);

            var controller = new AuthController(_configuration, mockAuthService.Object);

            var result = controller.Login(loginDto) as OkObjectResult;


            result.Should().NotBeNull();
            result.Value.Should().BeEquivalentTo(new { Token = token, Message = "Login successful." });
            _output.WriteLine("Valid result: Test is successful.");
            _output.WriteLine("Test is completed");
        }
    }

}

