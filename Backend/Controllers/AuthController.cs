using Backend.Data.Entities;
using Backend.Dtos;
using Backend.Services;
using Backend.Utils.Jwt;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        private readonly AuthService _authService;

        public AuthController(IConfiguration configuration, AuthService authService)
        {
            _configuration = configuration;
            _authService = authService;
        }




        [HttpPost("register")]
        public IActionResult Register([FromQuery] UserDto dto)
        {
            if (_authService.CheckEmailExists(dto.Email))
            {
                return BadRequest(new { Message = "Email already exists!" });
            }

            var user = _authService.Register(dto);
            var resultDto = new UserDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            };

            return Ok(resultDto);
        }

        [HttpPost("login")]
        public IActionResult Login([FromQuery] LoginDto loginDto)
        {
            try
            {
                var token = _authService.Login(loginDto);
                return Ok(new { Token = token, Message = "Login successful." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        [HttpGet("getId")]
        public IActionResult getInfo(string t)
        {

            string userID = _authService.GetUserIdFromToken(t.ToString(), _configuration);

            return Ok(userID.ToString());

        }

    }
}
