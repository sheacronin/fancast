using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Google.Apis.Books.v1;
using Google.Apis.Services;
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
          ImageLink = result.VolumeInfo.ImageLinks.Large
        };
      return book;
    }

    [HttpGet("search/{title}")]
    [OutputCache]
    public async Task<IList<Book>> SearchByTitle(string title)
    {
      var result = await Service.Volumes.List($"title={title}").ExecuteAsync();
      var books = result.Items.Select(book => new Book() {
        Id = book.Id, 
        Title = book.VolumeInfo.Title,
        Authors = book.VolumeInfo.Authors,
        Description = book.VolumeInfo.Description,
        ImageLink = book.VolumeInfo.ImageLinks.Large
      }).ToList();
      return books;
    }
}