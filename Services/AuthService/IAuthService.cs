using Microsoft.AspNetCore.Mvc;
using fancast.Models;

namespace fancast.Services.AuthService;

public interface IAuthService
{
  Task<User> GetCurrentUser(string token);
  Task<User> CreateUser(UserDto userDto);
  Task<User?> FindUser(string username);
  Task<ValidationProblemDetails?> ValidateRegistration(UserDto userDto);
  ValidationProblemDetails? ValidateLogin(UserDto userDto, User? user);
  string CreateToken(User user);
}