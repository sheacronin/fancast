using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using fancast.Models;
using fancast.Services.BooksService;

namespace fancast.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
  private readonly IBooksService _booksService;
  private readonly ILogger<BooksController> _logger;

  public BooksController(ILogger<BooksController> logger, IBooksService booksService)
  {
    _booksService = booksService;
    _logger = logger;
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<Book>> Get(string id)
  {
    Book? book = await _booksService.Get(id);
    return book is null ? NotFound() : Ok(await _booksService.Get(id));
  }

  [HttpGet]
  public async Task<ActionResult<Book[]>> Search([Required] string title)
  {
    Book[] results = await _booksService.Search(title);
    return results.Length == 0 ? NoContent() : Ok(results);
  }
}