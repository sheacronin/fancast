using System.ComponentModel.DataAnnotations;

namespace fancast.Models;

public class UserDto
{
  [Required(ErrorMessage = "Username must not be empty.")]
  [StringLength(18, MinimumLength = 3, ErrorMessage = "Username must be at least 3 characters and no more than 18 characters.")]
  public required string Username { get; set; }

  [Required(ErrorMessage = "Password must not be empty.")]
  [MinLength(3, ErrorMessage = "Password must be at least 3 characters.")]
  public required string Password { get; set; }

  public string? ConfirmPassword { get; set; }
}
