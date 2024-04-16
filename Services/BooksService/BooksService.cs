using Microsoft.Extensions.Caching.Memory;
using fancast.Models;
using GoogleBooks = Google.Apis.Books.v1;
using Google.Apis.Services;

namespace fancast.Services.BooksService;

public class BooksService : IBooksService
{
  private static readonly GoogleBooks.BooksService _service = new(new BaseClientService.Initializer
  {
    ApplicationName = "Fancast",
    ApiKey = Environment.GetEnvironmentVariable("GOOGLE_BOOKS_API_KEY")
  });
  private readonly IMemoryCache _cache;
  private static readonly TimeSpan _cacheTime = TimeSpan.FromHours(6);

  public BooksService(IMemoryCache cache)
  {
    _cache = cache;
  }

  public async Task<Book?> Get(string id)
  {
    string cacheKey = $"book_{id}";

    Book? book = await _cache.GetOrCreateAsync(cacheKey, async entry =>
    {
      entry.SetSlidingExpiration(_cacheTime);

      try
      {
        GoogleBooks.Data.Volume volume = await _service.Volumes.Get(id).ExecuteAsync();
        return new Book(volume);
      }
      catch
      {
        return null;
      }
    });

    return book;
  }

  public async Task<Book[]> Search(string title)
  {
    string cacheKey = $"bookSearch_{title}";

    Book[]? books = await _cache.GetOrCreateAsync(cacheKey, async entry =>
    {
      entry.SetSlidingExpiration(_cacheTime);

      var request = _service.Volumes.List($"title={title}");
      request.OrderBy = GoogleBooks.VolumesResource.ListRequest.OrderByEnum.Relevance;
      request.LangRestrict = "en";
      GoogleBooks.Data.Volumes volumes = await request.ExecuteAsync();

      if (volumes.Items is null)
      {
        return Array.Empty<Book>();
      }

      return volumes.Items.Select(volume => new Book(volume)).ToArray();
    });

    return books!;
  }
}