using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using fancast.Models;
using fancast.Data;

namespace fancast.Services.AuthService;

public class AuthService : IAuthService
{
  private readonly FancastContext _context;

  public AuthService(FancastContext context)
  {
    _context = context;
  }

  public async Task<User> GetCurrentUser(string token)
  {
    var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
    string id = jwt.Claims.First(claim => claim.Type == "Id").Value;
    User user = await _context.Users.Include(u => u.Castings).SingleAsync(u => u.Id == int.Parse(id));
    return user;
  }

  public async Task<User> CreateUser(UserDto userDto)
  {
    string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

    User user = new()
    {
      Username = userDto.Username,
      PasswordHash = passwordHash
    };

    await _context.Users.AddAsync(user);
    _context.SaveChanges();
    return user;
  }

  public async Task<User?> FindUser(string username) =>
    await _context.Users.Include(u => u.Castings).SingleOrDefaultAsync(u => u.Username == username);

  public async Task<ValidationProblemDetails?> ValidateRegistration(UserDto userDto)
  {
    Dictionary<string, string[]> details = new();

    if (await IsUsernameTaken(userDto.Username))
    {
      string[] errors = { "Username is taken." };
      details["Username"] = errors;
      return new ValidationProblemDetails(details)
      {
        Status = 409
      };
    }

    if (userDto.Password != userDto.ConfirmPassword)
    {
      string[] errors = { "Passwords do not match." };
      details["ConfirmPassword"] = errors;
      return new ValidationProblemDetails(details);
    }

    return null;
  }

  private async Task<bool> IsUsernameTaken(string username) =>
    await _context.Users.AnyAsync(u => u.Username == username);

  public ValidationProblemDetails? ValidateLogin(UserDto userDto, User? user)
  {
    Dictionary<string, string[]> details = new();

    if (user == null)
    {
      string[] errors = { "User not found." };
      details["Username"] = errors;
      return new ValidationProblemDetails(details)
      {
        Status = 404
      };
    }

    if (!BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash))
    {
      string[] errors = { "Wrong password." };
      details["Password"] = errors;
      return new ValidationProblemDetails(details);
    }

    return null;
  }

  public string CreateToken(User user)
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