using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> MakeReview([FromQuery] reviewDTO review)
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

    }
}
