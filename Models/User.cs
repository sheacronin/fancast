using System.Text.Json.Serialization;

namespace fancast.Models;

public class User
{
  public int Id { get; set; }
  public string Username { get; set; } = string.Empty;
  [JsonIgnore]
  public string PasswordHash { get; set; } = string.Empty;
  public List<Casting> Castings { get; } = new();
}
