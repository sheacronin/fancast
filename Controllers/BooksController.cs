using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using fancast.Models;
using fancast.Services.BooksService;

namespace fancast.Controllers;

[ApiController]
[Route("api")]
public class BooksController : ControllerBase
{
  private readonly IBooksService _booksService;
  private readonly ILogger<BooksController> _logger;

  public BooksController(ILogger<BooksController> logger, IBooksService booksService)
  {
    _booksService = booksService;
    _logger = logger;
  }

  [HttpGet("[controller]/{id}")]
  public async Task<ActionResult<Book>> Get(string id) => Ok(await _booksService.Get(id));


  [HttpGet("[controller]")]
  public async Task<ActionResult<Book[]>> Search([Required] string title) =>
    Ok(await _booksService.Search(title));
}