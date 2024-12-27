using Backend.Controllers;
using Backend.Data.Entities;
using Backend.Repositories.Abstract;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit.Abstractions;


namespace Backend.Tests.Controllers
{
    public class BookControllerTests
    {
        private readonly Mock<IRepository<Book>> _mockBookRepository;
        private readonly BookService _bookService;
        private readonly BookController _controller;
        private readonly ITestOutputHelper _output;

        public BookControllerTests(ITestOutputHelper output)
        {
            _mockBookRepository = new Mock<IRepository<Book>>();
            _bookService = new BookService(_mockBookRepository.Object);
            _controller = new BookController(_bookService);
            _output = output; 
        }

        [Fact]
        public async Task GetAllBooks_ShouldReturnOk_WhenBooksExist()
        {
            var books = new List<Book>{new Book { ISBN = "", BookTitle = "", BookAuthor = "John" }}.AsQueryable();

            _mockBookRepository.Setup(repo => repo.GetAll()).Returns(books);

            var result = await _controller.GetAllBooks();
            _output.WriteLine(result.ToString());

            foreach (var book in books)
            {
                _output.WriteLine($"Book Details - ISBN: {book.ISBN}, Title: {book.BookTitle}, Author: {book.BookAuthor}");
            }

            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            _output.WriteLine("Result confirmed as OkObjectResult");

            okResult.Value.Should().BeEquivalentTo(books);
            _output.WriteLine("The values ​​in the result are equal to the expected values.");
        }

    

        [Fact]
        public async Task GetAllBooks_ShouldReturnNotFound_WhenNoBooksExist()
        {
            var emptyQueryableBooks = new List<Book>().AsQueryable();
            _mockBookRepository.Setup(repo => repo.GetAll()).Returns(emptyQueryableBooks);

            var result = await _controller.GetAllBooks();

            if (result is NotFoundObjectResult notFoundResult)
            {
                _output.WriteLine($"Result Type: No books found");
            }

            result.Should().BeOfType<NotFoundObjectResult>()
                .Which.Value.Should().Be("No books found.");
        }
    }
}
