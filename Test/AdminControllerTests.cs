using Backend.Controllers;
using Backend.Data.Context;
using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Repositories.Abstract;
using Backend.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestPlatform.Utilities;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Test
{
    public class AdminControllerTests
    {
        private readonly AdminService _adminService;
        private readonly BorrowService _borrowService;
        private readonly AdminController _adminController;
        private readonly LibraryContext _context;
        private readonly ITestOutputHelper _output;

        public AdminControllerTests(ITestOutputHelper output)
        {
            var options = new DbContextOptionsBuilder<LibraryContext>()
                .UseInMemoryDatabase(databaseName: "TestLibraryDatabase")
                .Options;

            _context = new LibraryContext(options);
            _adminService = new AdminService(Mock.Of<IRepository<Book>>(), _context, _borrowService);
            _adminController = new AdminController(_adminService);
            _output = output;
        }

        [Fact]
        public async Task AddNewBookAsync_ShouldReturnOk_WhenBookAddedSuccessfully()
        {
            var newBookDto = new AddBookDto
            {
                ISBN = "1234567890",
                BookTitle = "Test Book",
                BookAuthor = "Test Author",
                YearOfPublication = 2023,
                Publisher = "Test Publisher",
                ImageURL = "http://example.com/book.jpg",
                BookShelf = "A1"
            };

            var result = await _adminController.AddNewBookAsync(newBookDto);

            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult.Value.Should().Be("Book added successfully.");

            var bookInDb = await _context.Books.FirstOrDefaultAsync(b => b.ISBN == newBookDto.ISBN);
            bookInDb.Should().NotBeNull();
            _output.WriteLine($"The book ({newBookDto.ISBN} - {newBookDto.BookTitle}) added successfully.");
        }
    }
}