using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BorrowController : ControllerBase
    {
        private readonly BorrowService _borrowService;

        public BorrowController(BorrowService borrowService)
        {
            _borrowService = borrowService;
        }

        [HttpPost("borrowBook")]
        public async Task<IActionResult> BorrowBook([FromQuery] string userId, [FromQuery] string ISBN)
        {
            try
            {
                await _borrowService.BorrowBookAsync(userId, ISBN);
                return Ok(new { Message = "Book borrowed successfully." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("returnBook")]
        public async Task<IActionResult> ReturnBook([FromQuery] string userId, [FromQuery] string ISBN)
        {
            try
            {
                await _borrowService.ReturnBookAsync(userId, ISBN);
                return Ok(new { Message = "Book returned successfully." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }


        [HttpGet("overdueBooks")]
        public async Task<IActionResult> GetOverdueBooks()
        {
            var overdueBooks = await _borrowService.CheckOverdueBooksAsync();
            return Ok(overdueBooks);
        }

        [HttpGet("getBorrowsByUserId")]
        public async Task<IActionResult> GetBorrowsByUserId(string userId)
        {
            try
            {
                var borrows = await _borrowService.GetBorrowsByUserIdAsync(userId);
                if (!borrows.Any())
                    return Ok(new { Message = "This user has not borrowed any books." });

                var result = borrows.Select(b => new
                {
                    b.Book.BookTitle,
                    b.Book.BookAuthor,
                    b.Book.ISBN,
                    b.BorrowDate,
                    b.ReturnDate
                });

                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }
    }
}