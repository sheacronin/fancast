using Microsoft.AspNetCore.Mvc;
using fancast.Models;
using fancast.Services.AuthService;

namespace fancast.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly IAuthService _authService;

  public AuthController(IAuthService authService)
  {
    _authService = authService;
  }

  [HttpGet("current-user")]
  public async Task<ActionResult<User?>> GetCurrentUser()
  {
    string token = Request.Cookies["token"]!;

    if (token is null)
    {
      return NoContent();
    }

    User user = await _authService.GetCurrentUser(token);
    return Ok(user);
  }

  [HttpPost("register")]
  public async Task<ActionResult<User>> Register([FromBody] UserDto userDto)
  {
    var problem = await _authService.ValidateRegistration(userDto);
    if (problem is not null)
    {
      if (problem.Status == 409)
      {
        return Conflict(problem);
      }
      return BadRequest(problem);
    }

    User user = await _authService.CreateUser(userDto);
    return Ok(user);
  }

  [HttpPost("login")]
  public async Task<ActionResult<User>> Login([FromBody] UserDto userDto)
  {
    User? user = await _authService.FindUser(userDto.Username);

    var problem = _authService.ValidateLogin(userDto, user);
    if (problem is not null)
    {
      if (problem.Status == 404)
      {
        return NotFound(problem);
      }
      return BadRequest(problem);
    }

    string token = _authService.CreateToken(user!);

    HttpContext.Response.Cookies.Append("token", token,
      new CookieOptions
      {
        Expires = DateTime.Now.AddDays(1),
        HttpOnly = true
      });

    return Ok(user);
  }

  [HttpPost("logout")]
  public ActionResult Logout()
  {
    HttpContext.Response.Cookies.Delete("token");

    return Ok();
  }
}
