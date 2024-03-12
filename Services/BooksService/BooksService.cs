using fancast.Models;
using GoogleBooks = Google.Apis.Books.v1;
using Google.Apis.Services;

namespace fancast.Services.BooksService;

public class BooksService : IBooksService
{
  static readonly GoogleBooks.BooksService service = new(new BaseClientService.Initializer
  {
    ApplicationName = "Fancast",
    ApiKey = Environment.GetEnvironmentVariable("GOOGLE_BOOKS_API_KEY")
  });

  public async Task<Book> Get(string id)
  {
    GoogleBooks.Data.Volume volume = await service.Volumes.Get(id).ExecuteAsync();
    return new Book(volume);
  }

  public async Task<Book[]> Search(string title)
  {
    var request = service.Volumes.List($"title={title}");
    request.OrderBy = GoogleBooks.VolumesResource.ListRequest.OrderByEnum.Relevance;
    request.LangRestrict = "en";
    GoogleBooks.Data.Volumes volumes = await request.ExecuteAsync();
    return volumes.Items.Select(volume => new Book(volume)).ToArray();
  }
}