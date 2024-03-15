using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using fancast.Models;
using fancast.Services.ActorsService;

namespace fancast.Controllers;

[ApiController]
[Route("api")]
public class ActorsController : ControllerBase
{
  private readonly IActorsService _actorsService;
  private readonly ILogger<ActorsController> _logger;

  public ActorsController(ILogger<ActorsController> logger, IActorsService actorsService)
  {
    _actorsService = actorsService;
    _logger = logger;
  }

  [HttpGet("[controller]/{id}")]
  public async Task<ActionResult<Actor>> Get(int id) => Ok(await _actorsService.Get(id));

  [HttpGet("characters/{characterId}/[controller]")]
  public async Task<ActionResult<Actor[]>> GetByCharacter(int characterId)
  {
    try
    {
      Actor[] actors = await _actorsService.GetByCharacter(characterId);
      return actors.Length == 0 ? NoContent() : Ok(actors);
    }
    catch (Exception e)
    {
      if (e.Message == "The character does not exist")
      {
        return BadRequest(e.Message);
      }
      throw new HttpRequestException();
    }
  }

  [HttpGet("[controller]")]
  public async Task<ActionResult<Actor[]>> Search([Required] string name)
  {
    Actor[] results = await _actorsService.Search(name);
    return results.Length == 0 ? NoContent() : Ok(results);
  }
}