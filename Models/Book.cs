namespace fancast.Models;

public class Book
{
  public required string Id { get; set; }
  public required string Title { get; set; }
  public required IList<string> Authors { get; set; }
  public required string ImageLink { get; set; }
  public required string Description { get; set; }
}