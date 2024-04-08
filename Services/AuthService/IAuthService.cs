using fancast.Models;

namespace fancast.Services.AuthService;

public interface IAuthService
{
  Task<User> GetCurrentUser(string token);
  Task<User> CreateUser(UserDto userDto);
  Task<User?> FindUser(string username);
  Task<string> ValidateRegistration(UserDto userDto);
  string ValidateLogin(UserDto userDto, User? user);
  string ValidateNotEmpty(UserDto userDto);
  string CreateToken(User user);
}