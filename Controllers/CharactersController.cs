using Microsoft.AspNetCore.Mvc;
using fancast.Models;
using fancast.Services.CharactersService;

namespace fancast.Controllers;

[ApiController]
[Route("api")]
public class CharactersController : ControllerBase
{
  private readonly ICharactersService _charactersService;
  private readonly ILogger<CharactersController> _logger;

  public CharactersController(ILogger<CharactersController> logger, ICharactersService charactersService)
  {
    _charactersService = charactersService;
    _logger = logger;
  }

  [HttpGet("[controller]/{id}")]
  public async Task<ActionResult<Character>> Get(string id) =>
    Ok(await _charactersService.Get(id));

  [HttpGet("books/{bookId}/[controller]")]
  public async Task<ActionResult<Character[]>> GetByBook(string bookId) =>
    Ok(await _charactersService.GetByBook(bookId));

  [HttpPatch("[controller]/{id}")]
  public async Task<ActionResult> AddActor(string id, [FromBody] int actorId)
  {
    await _charactersService.AddActor(id, actorId);
    return NoContent();
  }

  [HttpPost("[controller]")]
  public async Task<ActionResult<Character>> Create([FromBody] Character character)
  {
    Character newCharacter = await _charactersService.Create(character);
    return CreatedAtAction(nameof(Get), new { id = newCharacter.Id }, newCharacter);
  }
}