using Backend.Services;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Backend.Controllers;
using Backend.Data.Entities;
using Backend.Repositories.Abstract;

namespace Backend.Tests.Controllers
{
    public class BookControllerTests
    {
        private readonly Mock<IRepository<Book>> _mockBookRepository;
        private readonly BookService _bookService;
        private readonly BookController _controller;

        public BookControllerTests()
        {
            // Mock the IRepository<Book>
            _mockBookRepository = new Mock<IRepository<Book>>();

            // Instantiate BookService with the mocked IRepository<Book>
            _bookService = new BookService(_mockBookRepository.Object);

            // Create the controller with the mocked BookService
            _controller = new BookController(_bookService);
        }

        [Fact]
        public async Task GetAllBooks_ShouldReturnOk_WhenBooksExist()
        {
            // Arrange
            var books = new List<Book>
        {
            new Book { ISBN = "", BookTitle = "", BookAuthor = "John" }
        }.AsQueryable();

            _mockBookRepository.Setup(repo => repo.GetAll()).Returns(books.AsQueryable());

            // Act
            var result = await _controller.GetAllBooks();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.Value.Should().BeEquivalentTo(books);
        }
    }


    //[Fact]
    //public async Task GetAllBooks_ShouldReturnNotFound_WhenNoBooksExist()
    //{
    //    // Arrange
    //    var emptyQueryableBooks = new List<Book>().AsQueryable(); // Empty list as IQueryable
    //    _mockBookService.Setup(service => service.GetAllAsync()).ReturnsAsync(emptyQueryableBooks);

    //    // Act
    //    var result = await _controller.GetAllBooks();

    //    // Assert
    //    var notFoundResult = result.Should().BeOfType<NotFoundObjectResult>().Subject;
    //    notFoundResult.Value.Should().Be("No books found.");
    //}

    //[Fact]
    //public async Task FilterBook_ShouldReturnNotFound_WhenNoMatchingBooksExist()
    //{
    //    // Arrange
    //    var filter = new BookDto { Title = "Nonexistent" };
    //    var emptyBookList = new List<Book>(); // Empty list for search result

    //    // Mock SearchBooksAsync to return an empty list
    //    _mockBookService.Setup(service => service.SearchBooksAsync(filter)).ReturnsAsync(emptyBookList);

    //    // Act
    //    var result = await _controller.FilterBook(filter);

    //    // Assert
    //    var notFoundResult = result.Should().BeOfType<NotFoundObjectResult>().Subject;
    //    notFoundResult.Value.Should().Be("No books found matching the search criteria.");
    //}
}
