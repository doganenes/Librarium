using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost("makeReview")]
        public async Task<IActionResult> MakeReview([FromQuery] ReviewDto review)
        {
            if (review == null)
            {
                return BadRequest(new { Error = "Review data cannot be null." });
            }

            try
            {
                await _reviewService.MakeReview(review);
                return Ok(new { Message = "Review submitted successfully." });
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

        [HttpGet("getBookReview")]
        public async Task<IActionResult> getBookReview([FromQuery] string ISBN)
        {
            if (ISBN == null)
            {
                return BadRequest(new { Error = "Review data cannot be null" });
            }
            try
            {
                var reviews = await _reviewService.GetBookReviews(ISBN);
                return Ok(reviews);
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

        [HttpDelete("deleteReview")]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            try
            {
                var authenticatedUser = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).ToString();

                if (authenticatedUser == null)
                {
                    throw new UnauthorizedAccessException("User ID not found in the token.");
                }
                await _reviewService.DeleteReview(reviewId,authenticatedUser);

                return Ok(new { Message = "Review deleted successfully." });
            }   
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}