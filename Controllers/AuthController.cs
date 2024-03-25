using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.IdentityModel.Tokens.Jwt;
using fancast.Models;
using fancast.Data;

namespace fancast.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly FancastContext _context;

  public AuthController(FancastContext context)
  {
    _context = context;
  }

  [HttpPost("register")]
  public ActionResult<User> Register(UserDto userDto)
  {
    // TODO: prevent username duplicates
    // TODO: confirm password
    string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

    User user = new()
    {
      Username = userDto.Username,
      PasswordHash = passwordHash
    };

    _context.Users.Add(user);
    _context.SaveChanges();

    return Ok(user);
  }

  [HttpPost("login")]
  public ActionResult<string> Login(UserDto userDto)
  {
    User? user = _context.Users.SingleOrDefault(u => u.Username == userDto.Username);

    if (user == null)
    {
      return BadRequest(JsonSerializer.Serialize("User not found"));
    }

    if (!BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash))
    {
      return BadRequest(JsonSerializer.Serialize("Wrong password."));
    }

    string token = CreateToken(user);

    return Ok(JsonSerializer.Serialize(token));
  }

  private static string CreateToken(User user)
  {
    List<Claim> claims = new()
    {
      new(ClaimTypes.Name, user.Username)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
      Environment.GetEnvironmentVariable("SECRET_KEY")!));

    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

    var token = new JwtSecurityToken(
      claims: claims,
      expires: DateTime.Now.AddDays(1),
      signingCredentials: creds
    );

    var jwt = new JwtSecurityTokenHandler().WriteToken(token);

    return jwt;
  }
}
