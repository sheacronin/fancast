using System.ComponentModel.DataAnnotations.Schema;

namespace fancast.Models;

public class Casting
{
  public int Id { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.Now.ToUniversalTime();
  public int CharacterId { get; set; }
  public Character Character { get; set; } = null!;
  public int ActorId { get; set; }
  [NotMapped]
  public Actor Actor { get; set; } = null!;
  public List<User> Users { get; } = new();
}