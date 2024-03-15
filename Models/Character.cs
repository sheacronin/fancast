namespace fancast.Models;

public class Character
{
  public int Id { get; set; }
  public required string Name { get; set; }
  public required string BookId { get; set; }
  public required int[] ActorIds { get; set; }
}
