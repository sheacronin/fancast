using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Google.Apis.Books.v1;
using Google.Apis.Services;
using static Google.Apis.Books.v1.Data.Volume.VolumeInfoData;
using fancast.Models;

namespace fancast.Controllers;

[ApiController]
[Route("[controller]")]
public class BooksController : ControllerBase
{
    private readonly ILogger<BooksController> _logger;

    public BooksController(ILogger<BooksController> logger)
    {
        _logger = logger;
    }

    private static string? GetImageLink(ImageLinksData? data)
    {
      if (data == null) {
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

    static BooksService Service
    { 
      get 
      {
        return new BooksService(new BaseClientService.Initializer
        {
          ApplicationName = "Fancast",
          ApiKey = Environment.GetEnvironmentVariable("GOOGLE_BOOKS_API_KEY")
        });
      }
    }

    [HttpGet("{id}")]
    [OutputCache]
    public async Task<Book> Get(string id)
    {
      var result = await Service.Volumes.Get(id).ExecuteAsync();
      var book = new Book 
        { 
          Id = result.Id, 
          Title = result.VolumeInfo.Title,
          Authors = result.VolumeInfo.Authors,
          Description = result.VolumeInfo.Description,
          ImageLink = GetImageLink(result.VolumeInfo.ImageLinks)
        };
      return book;
    }

    [HttpGet("search/{title}")]
    [OutputCache]
    public async Task<IList<Book>> SearchByTitle(string title)
    {
      var request = Service.Volumes.List($"title={title}");
      request.OrderBy = VolumesResource.ListRequest.OrderByEnum.Relevance;
      request.LangRestrict = "en";
      var result = await request.ExecuteAsync();
      var books = result.Items.Select(book => new Book() {
        Id = book.Id, 
        Title = book.VolumeInfo.Title,
        Authors = book.VolumeInfo.Authors,
        Description = book.VolumeInfo.Description,
        ImageLink = GetImageLink(book.VolumeInfo.ImageLinks)
      }).ToList();
      return books;
    }
}