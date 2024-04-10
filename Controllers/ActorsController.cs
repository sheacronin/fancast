using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using fancast.Models;
using fancast.Services.ActorsService;
using fancast.Services.CastingsService;

namespace fancast.Controllers;

[ApiController]
[Route("api")]
public class ActorsController : ControllerBase
{
  private readonly IActorsService _actorsService;
  private readonly ICastingsService _castingsService;
  private readonly ILogger<ActorsController> _logger;

  public ActorsController(IActorsService actorsService,
    ICastingsService castingsService,
    ILogger<ActorsController> logger)
  {
    _actorsService = actorsService;
    _castingsService = castingsService;
    _logger = logger;
  }

  [HttpGet("[controller]/{id}")]
  public async Task<ActionResult<Actor>> Get(int id) => Ok(await _actorsService.Get(id));

  [HttpGet("characters/{characterId}/[controller]")]
  public async Task<ActionResult<Actor[]>> GetByCharacter(int characterId)
  {
    Casting[] results = await _castingsService.Search(characterId);
    if (results.Length == 0)
    {
      return NoContent();
    }

    var actors = new List<Actor>();
    foreach (Casting casting in results)
    {
      Actor actor = await _actorsService.Get(casting.ActorId);
      actors.Add(actor);
    }

    return Ok(actors.OrderBy(a => a.Name).ToArray());
  }

  [HttpGet("[controller]")]
  public async Task<ActionResult<Actor[]>> Search([Required] string name)
  {
    Actor[] results = await _actorsService.Search(name);
    return results.Length == 0 ? NoContent() : Ok(results);
  }
}