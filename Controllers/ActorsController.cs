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

  public ActorsController(IActorsService actorsService, ILogger<ActorsController> logger)
  {
    _actorsService = actorsService;
    _logger = logger;
  }

  [HttpGet("[controller]/{id}")]
  public async Task<ActionResult<Actor>> Get(int id) => Ok(await _actorsService.Get(id));

  [HttpGet("[controller]")]
  public async Task<ActionResult<Actor[]>> Search([Required] string name)
  {
    Actor[] results = await _actorsService.Search(name);
    return results.Length == 0 ? NoContent() : Ok(results);
  }
}