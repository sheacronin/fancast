using TMDbLib.Objects.People;

namespace fancast.Models;

public class Actor
{
  private readonly static string _imageLinkBaseUrl = "https://image.tmdb.org/t/p/w500";
  private string? _imageLink;

  public Actor(Person person)
  {
    Id = person.Id;
    Name = person.Name;
    Gender = person.Gender.ToString();
    ImageLink = person.ProfilePath;
  }

  public int Id { get; set; }

  public string Name { get; set; }

  public string Gender { get; set; }

  public string? ImageLink
  {
    get
    {
      if (String.IsNullOrEmpty(_imageLink)) return null;

      return $"{_imageLinkBaseUrl}{_imageLink}";
    }
    set => _imageLink = value;
  }
}