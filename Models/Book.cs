using Google.Apis.Books.v1.Data;
using static Google.Apis.Books.v1.Data.Volume.VolumeInfoData;

namespace fancast.Models;

public class Book
{
  public Book(Volume volume)
  {
    Id = volume.Id;
    Title = volume.VolumeInfo.Title;
    Authors = volume.VolumeInfo.Authors;
    Description = volume.VolumeInfo.Description;
    ImageLink = GetImageLink(volume.VolumeInfo.ImageLinks);
  }

  public string Id { get; set; }

  public string Title { get; set; }
  public IList<string> Authors { get; set; }
  public string? ImageLink { get; set; }
  public string Description { get; set; }

  private static string? GetImageLink(ImageLinksData? data)
  {
    if (data == null)
    {
      return null;
    }
    if (data.ExtraLarge != null)
    {
      return data.ExtraLarge;
    }
    if (data.Large != null)
    {
      return data.Large;
    }
    if (data.Medium != null)
    {
      return data.Medium;
    }
    if (data.Small != null)
    {
      return data.Small;
    }
    if (data.Thumbnail != null)
    {
      return data.Thumbnail;
    }
    return null;
  }
}