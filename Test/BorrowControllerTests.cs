using System;
using System.Threading.Tasks;
using Backend.Controllers;
using Backend.Data.Context;
using Backend.Data.Entities;
using Backend.Repositories.Abstract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Backend.Tests.Controllers
{
    public class BorrowControllerTest
    {
        private readonly Mock<IRepository<User>> _mockUserRepository;
        private readonly Mock<IRepository<Book>> _mockBookRepository;
        private readonly LibraryContext _dbContext;  // Using LibraryContext directly
        private readonly Mock<BorrowService> _mockBorrowService;
        private readonly BorrowController _controller;
        private readonly ITestOutputHelper _output;


        public BorrowControllerTest(ITestOutputHelper output)
        {
            var options = new DbContextOptionsBuilder<LibraryContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _dbContext = new LibraryContext(options);

            _mockUserRepository = new Mock<IRepository<User>>();
            _mockBookRepository = new Mock<IRepository<Book>>();

            _mockBorrowService = new Mock<BorrowService>(_mockUserRepository.Object, _mockBookRepository.Object, _dbContext);
            _controller = new BorrowController(_mockBorrowService.Object);
            _output = output;
        }

        [Fact]
        public async Task BorrowBook_ShouldReturnOk_WhenBookIsBorrowedSuccessfully()
        {
            string userId = "user1";
            string isbn = "12345";

            _mockBorrowService.Setup(service => service.BorrowBookAsync(userId, isbn))
                .Returns(Task.CompletedTask);

            var result = await _controller.BorrowBook(userId, isbn);

            Assert.IsType<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            _output.WriteLine($"Book has ISBN {isbn} borrowed to : {userId}");
        }



        [Fact]
        public async Task ReturnBook_ShouldReturnOk_WhenBookIsReturnedSuccessfully()
        {
            string userId = "fc744935-7198-4411-b09f-a10fd6a9047d";
            string isbn = "033035566X";

            _mockBorrowService.Setup(service => service.ReturnBookAsync(userId, isbn))
                .Returns(Task.CompletedTask);

            var result = await _controller.ReturnBook(userId, isbn);

            Assert.IsType<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            _output.WriteLine($"Book has ISBN {isbn} returned successfully from : {userId}");
        }

    }
}
