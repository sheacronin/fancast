using Google.Cloud.Firestore;

namespace fancast.Models;

[FirestoreData]
public class Cast
{
  [FirestoreDocumentId]
  public required string Id { get; set; }

  [FirestoreProperty("name")]
  public required string Name { get; set; }

  [FirestoreProperty("gender")]
  public required string Gender { get; set; }

  private string? _imageLink;
  [FirestoreProperty("imageLink")]
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