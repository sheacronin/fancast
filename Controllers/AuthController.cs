using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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

  [Authorize]
  [HttpGet("current-user")]
  public ActionResult<User> GetCurrentUser()
  {
    var token = Request.Cookies["token"];
    var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
    string id = jwt.Claims.First(claim => claim.Type == "Id").Value;
    var user = _context.Users.Find(int.Parse(id));

    return Ok(user);
  }

  [HttpPost("register")]
  public ActionResult<User> Register(UserDto userDto)
  {
    string error = ValidateRegistration(userDto);
    if (error != string.Empty)
    {
      return BadRequest(error);
    }

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
  public ActionResult<User> Login(UserDto userDto)
  {
    User? user = _context.Users.SingleOrDefault(u => u.Username == userDto.Username);

    string error = ValidateLogin(userDto, user);
    if (error != string.Empty)
    {
      return BadRequest(error);
    }

    string token = CreateToken(user!);

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

  private string ValidateRegistration(UserDto userDto)
  {
    string emptyError = ValidateNotEmpty(userDto);
    if (emptyError != string.Empty)
    {
      return emptyError;
    }

    if (_context.Users.Any(u => u.Username == userDto.Username))
    {
      return JsonSerializer.Serialize("Username is taken.");
    }

    if (userDto.Password != userDto.ConfirmPassword)
    {
      return JsonSerializer.Serialize("Passwords do not match.");
    }

    return string.Empty;
  }

  private static string ValidateLogin(UserDto userDto, User? user)
  {
    string emptyError = ValidateNotEmpty(userDto);
    if (emptyError != string.Empty)
    {
      return emptyError;
    }

    if (user == null)
    {
      return JsonSerializer.Serialize("User not found.");
    }

    if (!BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash))
    {
      return JsonSerializer.Serialize("Wrong password.");
    }

    return string.Empty;
  }

  private static string ValidateNotEmpty(UserDto userDto)
  {
    if (userDto.Username == string.Empty)
    {
      return JsonSerializer.Serialize("Username must not be empty.");
    }

    if (userDto.Password == string.Empty)
    {
      return JsonSerializer.Serialize("Password must not be empty.");
    }

    return string.Empty;
  }

  private static string CreateToken(User user)
  {
    List<Claim> claims = new()
    {
      new(ClaimTypes.Name, user.Username),
      new("Id", user.Id.ToString()),
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
