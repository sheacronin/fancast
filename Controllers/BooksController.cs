using Microsoft.AspNetCore.Mvc;
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
}