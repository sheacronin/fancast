using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using fancast.Models;
using fancast.Services.AuthService;
using fancast.Services.CastingsService;
using fancast.Services.ActorsService;
using fancast.Services.BooksService;

namespace fancast.Controllers;

[ApiController]
[Route("api")]
public class CastingsController : ControllerBase
{
  private readonly ICastingsService _castingsService;
  private readonly IActorsService _actorsService;
  private readonly IBooksService _booksService;
  private readonly IAuthService _authService;
  private readonly ILogger<CastingsController> _logger;

  public CastingsController(
    ICastingsService castingsService,
    IActorsService actorsService,
    IBooksService booksService,
    IAuthService authService,
    ILogger<CastingsController> logger
  )
  {
    _castingsService = castingsService;
    _actorsService = actorsService;
    _booksService = booksService;
    _authService = authService;
    _logger = logger;
  }

  [HttpGet("[controller]/{id}")]
  public async Task<ActionResult<Casting>> Get(int id)
  {
    Casting? casting = await _castingsService.Get(id);
    return casting == null ? NotFound() : Ok(casting);
  }


  [HttpGet("[controller]")]
  public async Task<ActionResult<Casting[]>> GetRecentCastings([FromQuery] int userId = -1, [FromQuery] int limit = 10)
  {
    Casting[] castings = await _castingsService.GetRecent(userId, limit);
    if (castings.Length == 0)
    {
      return NoContent();
    }

    // Create lists of books and actors so that the same resources
    // are not fetched multiple times
    List<Book> books = new();
    List<Actor> actors = new();

    foreach (Casting casting in castings)
    {
      Book? book = books.FirstOrDefault(b => b.Id == casting.Character.BookId);
      if (book is not null)
      {
        casting.Book = book;
      }
      else
      {
        Book? fetchedBook = await _booksService.Get(casting.Character.BookId);
        casting.Book = fetchedBook!;
        books.Add(fetchedBook!);
      }

      Actor? actor = actors.FirstOrDefault(a => a.Id == casting.ActorId);
      if (actor is not null)
      {
        casting.Actor = actor;
      }
      else
      {
        Actor? fetchedActor = await _actorsService.Get(casting.ActorId);
        casting.Actor = fetchedActor!;
        actors.Add(fetchedActor!);
      }
    }

    return Ok(castings);
  }

  [HttpGet("characters/{characterId}/[controller]")]
  public async Task<ActionResult<Casting[]>> GetCharacterCastings(int characterId)
  {
    Casting[] castings = await _castingsService.Search(characterId);
    if (castings.Length == 0)
    {
      return NoContent();
    }

    foreach (Casting casting in castings)
    {
      Actor? actor = await _actorsService.Get(casting.ActorId);
      casting.Actor = actor!;
    }
    return Ok(castings.OrderBy(c => c.Actor.Name).ToArray());
  }

  [Authorize]
  [HttpPost("characters/{characterId}/[controller]")]
  public async Task<ActionResult<Casting>> CastCharacter(int characterId, [FromBody] int actorId)
  {
    try
    {
      var token = Request.Cookies["token"];
      User user = await _authService.GetCurrentUser(token!);
      CastingDto castingDto = new()
      {
        CharacterId = characterId,
        ActorId = actorId
      };
      Casting casting = await _castingsService.CreateCasting(castingDto, user);
      Actor? actor = await _actorsService.Get(casting.ActorId);
      casting.Actor = actor!;
      return CreatedAtAction(nameof(Get), new { id = casting.Id }, casting);
    }
    catch (Exception e)
    {
      return BadRequest(e.Message);
    }
  }

  [Authorize]
  [HttpPut("[controller]/{id}")]
  public async Task<ActionResult<Casting>> SelectCasting(int id)
  {
    try
    {
      var token = Request.Cookies["token"];
      User user = await _authService.GetCurrentUser(token!);
      Casting casting = await _castingsService.SelectCasting(id, user);
      Actor? actor = await _actorsService.Get(casting.ActorId);
      casting.Actor = actor!;
      return Ok(casting);
    }
    catch (Exception e)
    {
      return BadRequest(e.Message);
    }
  }
}