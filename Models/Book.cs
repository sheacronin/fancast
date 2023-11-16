namespace fancast.Models;

public class Book
{
  public required string Id { get; set; }
  public required string Title { get; set; }
  public IList<string>? Authors { get; set; }
  public string? ImageLink { get; set; }
  public string? Description { get; set; }
}