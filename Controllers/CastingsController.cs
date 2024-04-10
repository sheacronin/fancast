using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using fancast.Models;
using fancast.Services.AuthService;
using fancast.Services.CastingsService;

namespace fancast.Controllers;

[ApiController]
[Route("api")]
public class CastingsController : ControllerBase
{
  private readonly ICastingsService _castingsService;
  private readonly IAuthService _authService;
  private readonly ILogger<CastingsController> _logger;

  public CastingsController(ICastingsService castingsService, IAuthService authService, ILogger<CastingsController> logger)
  {
    _castingsService = castingsService;
    _authService = authService;
    _logger = logger;
  }

  [HttpGet("[controller]/{id}")]
  public async Task<ActionResult<Casting>> Get(int id)
  {
    Casting? casting = await _castingsService.Get(id);
    return casting == null ? NotFound() : Ok(casting);
  }

  [Authorize]
  [HttpPost("characters/{characterId}/[controller]")]
  public async Task<ActionResult<Casting>> CastCharacter(int characterId, [FromBody] int actorId)
  {
    var token = Request.Cookies["token"];
    User user = await _authService.GetCurrentUser(token!);
    CastingDto castingDto = new()
    {
      CharacterId = characterId,
      ActorId = actorId
    };
    Casting casting = await _castingsService.CreateCasting(castingDto, user);
    return CreatedAtAction(nameof(Get), new { id = casting.Id }, casting);
  }

  [Authorize]
  [HttpPut("[controller]/{id}")]
  public async Task<ActionResult<Casting>> SelectCasting(int id)
  {
    var token = Request.Cookies["token"];
    User user = await _authService.GetCurrentUser(token!);
    Casting casting = await _castingsService.SelectCasting(id, user);
    return Ok(casting);
  }
}