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

            [HttpDelete("deleteFavouriteBook")]
            public IActionResult RemoveFavouriteBook(string userId, string isbn)
            {
                try
                {
                    _userService.RemoveFavouriteBook(userId, isbn);
                    return NoContent();
                }
                catch (KeyNotFoundException ex)
                {
                    return NotFound(new { message = ex.Message }); // 404 Not Found
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(new { message = ex.Message }); // 400 Bad Request
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An unexpected error occurred", detail = ex.Message }); 
                }
            }
        }




    }
