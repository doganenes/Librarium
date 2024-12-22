using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

public class AdminController : ControllerBase
{
    private readonly AdminService _adminService;

    public AdminController(AdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpPost("addNewBook")]
    public async Task<IActionResult> AddNewBookAsync([FromBody] AddBookDto newBookDto)
    {
        if (newBookDto == null)
        {
            return BadRequest("Book data is required.");
        }

        try
        {
            await _adminService.AddNewBookAsync(newBookDto);
            return Ok("Book added successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
