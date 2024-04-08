using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
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
    var user = await _context.Users.FindAsync(int.Parse(id));
    return user!;
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
    await _context.Users.SingleOrDefaultAsync(u => u.Username == username);

  public async Task<string> ValidateRegistration(UserDto userDto)
  {
    string emptyError = ValidateNotEmpty(userDto);
    if (emptyError != string.Empty)
    {
      return emptyError;
    }

    if (await _context.Users.AnyAsync(u => u.Username == userDto.Username))
    {
      return JsonSerializer.Serialize("Username is taken.");
    }

    if (userDto.Password != userDto.ConfirmPassword)
    {
      return JsonSerializer.Serialize("Passwords do not match.");
    }

    return string.Empty;
  }

  public string ValidateLogin(UserDto userDto, User? user)
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

  public string ValidateNotEmpty(UserDto userDto)
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