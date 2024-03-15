using fancast.Models;

namespace fancast.Data;

public static class DbInitializer
{
  public static void Initialize(FancastContext context)
  {
    if (context.Characters.Any())
    {
      return; // Db has been seeded
    }

    var characters = new Character[]
    {
      new() { Name = "David", BookId = "0OBAjgEACAAJ", ActorIds = Array.Empty<int>() },
      new() { Name = "Giovanni", BookId = "0OBAjgEACAAJ", ActorIds = new int[] { 54815 } },
      new() { Name = "Hella", BookId = "0OBAjgEACAAJ", ActorIds = Array.Empty<int>() }
    };

    context.Characters.AddRange(characters);
    context.SaveChanges();
  }
}