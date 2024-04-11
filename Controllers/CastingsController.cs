using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using fancast.Models;
using fancast.Services.AuthService;
using fancast.Services.CastingsService;
using fancast.Services.ActorsService;

namespace fancast.Controllers;

[ApiController]
[Route("api")]
public class CastingsController : ControllerBase
{
  private readonly ICastingsService _castingsService;
  private readonly IActorsService _actorsService;
  private readonly IAuthService _authService;
  private readonly ILogger<CastingsController> _logger;

  public CastingsController(ICastingsService castingsService, IActorsService actorsService, IAuthService authService, ILogger<CastingsController> logger)
  {
    _castingsService = castingsService;
    _actorsService = actorsService;
    _authService = authService;
    _logger = logger;
  }

  [HttpGet("[controller]/{id}")]
  public async Task<ActionResult<Casting>> Get(int id)
  {
    Casting? casting = await _castingsService.Get(id);
    return casting == null ? NotFound() : Ok(casting);
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
      casting.Actor = await _actorsService.Get(casting.ActorId);
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
      casting.Actor = await _actorsService.Get(casting.ActorId);
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
      casting.Actor = await _actorsService.Get(casting.ActorId);
      return Ok(casting);
    }
    catch (Exception e)
    {
      return BadRequest(e.Message);
    }
  }
}