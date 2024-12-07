using Backend.Data.Context;
using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Repositories.Abstract;
using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly BookService _bookService;

        public BookController(BookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet("getAllBooks")]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _bookService.GetAllAsync();
            if (books == null)
            {
                return NotFound("No books found.");
            }
            return Ok(books);
        }

        [HttpPost("filter")]
        public async Task<IActionResult> FilterBook([FromQuery] BookSearchRequest filter)
        {
            var books = await _bookService.SearchBooksAsync(filter);

            if (books == null || !books.Any())
            {
                return NotFound("No books found matching the search criteria.");
            }

            return Ok(books);
        }





    }

}
