namespace fancast.Models;

public class Actor
{
  public required int Id { get; set; }

  public required string Name { get; set; }

  public required string Gender { get; set; }

  private string? _imageLink;

  public string? ImageLink
  {
    get
    {
      if (String.IsNullOrEmpty(_imageLink)) return null;

      return $"{_imageLinkBaseUrl}{_imageLink}";
    }
    set => _imageLink = value;
  }

  private readonly string _imageLinkBaseUrl = "https://image.tmdb.org/t/p/w500";
}