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
      new() { Name = "David", BookId = "0OBAjgEACAAJ" },
      new() { Name = "Giovanni", BookId = "0OBAjgEACAAJ" },
      new() { Name = "Hella", BookId = "0OBAjgEACAAJ" }
    };

    context.Characters.AddRange(characters);
    context.SaveChanges();
  }
}