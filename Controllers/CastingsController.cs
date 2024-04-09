using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using fancast.Models;
using fancast.Services.AuthService;
using fancast.Services.CastingsService;

namespace fancast.Controllers;

[ApiController]
[Route("api/[controller]")]
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

  [HttpGet("{id}")]
  public async Task<ActionResult<Casting>> Get(int id)
  {
    Casting? casting = await _castingsService.GetCasting(id);
    return casting == null ? NotFound() : Ok(casting);
  }

  [Authorize]
  [HttpPost]
  public async Task<ActionResult<Casting>> CastCharacter(CastingDto castingDto)
  {
    var token = Request.Cookies["token"];
    User user = await _authService.GetCurrentUser(token!);
    Casting casting = await _castingsService.CreateCasting(castingDto, user);
    return CreatedAtAction(nameof(Get), new { id = casting.Id }, casting);
  }
}