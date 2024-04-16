using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using fancast.Models;
using fancast.Services.ActorsService;

namespace fancast.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActorsController : ControllerBase
{
  private readonly IActorsService _actorsService;
  private readonly ILogger<ActorsController> _logger;

  public ActorsController(IActorsService actorsService, ILogger<ActorsController> logger)
  {
    _actorsService = actorsService;
    _logger = logger;
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<Actor>> Get(int id)
  {
    Actor? actor = await _actorsService.Get(id);
    return actor is null ? NotFound() : Ok(actor);
  }

  [HttpGet]
  public async Task<ActionResult<Actor[]>> Search([Required] string name)
  {
    Actor[] results = await _actorsService.Search(name);
    return results.Length == 0 ? NoContent() : Ok(results);
  }
}