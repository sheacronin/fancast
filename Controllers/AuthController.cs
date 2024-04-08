using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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

  [Authorize]
  [HttpGet("current-user")]
  public async Task<ActionResult<User>> GetCurrentUser()
  {
    string token = Request.Cookies["token"]!;
    User user = await _authService.GetCurrentUser(token);
    return Ok(user);
  }

  [HttpPost("register")]
  public async Task<ActionResult<User>> Register(UserDto userDto)
  {
    string error = await _authService.ValidateRegistration(userDto);
    if (error != string.Empty)
    {
      return BadRequest(error);
    }

    User user = await _authService.CreateUser(userDto);
    return Ok(user);
  }

  [HttpPost("login")]
  public async Task<ActionResult<User>> Login(UserDto userDto)
  {
    User? user = await _authService.FindUser(userDto.Username);

    string error = _authService.ValidateLogin(userDto, user);
    if (error != string.Empty)
    {
      return BadRequest(error);
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
