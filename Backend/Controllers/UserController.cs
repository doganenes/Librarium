using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("addfavoritebooks")]
        public IActionResult AddFavoriteBook([FromQuery]string userId, [FromQuery] string ISBN)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(ISBN))
                {
                    return BadRequest("Book name cannot be empty.");
                }

                _userService.AddFavoriteBook(userId, ISBN);
                return Ok(new { Message = "Book added to favorites successfully" });
            }
         
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An unexpected error occurred.", Details = ex.Message });
            }
        }

        [HttpDelete("removeFavoriteBook")]
        public IActionResult RemoveFavoriteBook(string userId, string ISBN)
        {
            try
            {
                _userService.RemoveFavoriteBook(userId, ISBN);
                return NoContent(); 
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An unexpected error occurred.", Details = ex.Message });
            }
        }
    }




    }
