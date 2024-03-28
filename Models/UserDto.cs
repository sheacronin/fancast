namespace fancast.Models;

public class UserDto
{
  public required string Username { get; set; }
  public required string Password { get; set; }
  public string? ConfirmPassword { get; set; }
}
