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
  public async Task<ActionResult<Character>> Get(int id)
  {
    Character? character = await _charactersService.Get(id);
    return character == null ? NotFound() : Ok(character);
  }

  [HttpGet("books/{bookId}/[controller]")]
  public async Task<ActionResult<Character[]>> GetByBook(string bookId)
  {
    Character[] characters = await _charactersService.GetByBook(bookId);
    return characters.Length == 0 ? NoContent() : Ok(characters);
  }

  [HttpPost("[controller]")]
  public async Task<ActionResult<Character>> Create([FromBody] Character character)
  {
    try
    {
      Character newCharacter = await _charactersService.Create(character);
      return CreatedAtAction(nameof(Get), new { id = newCharacter.Id }, newCharacter);
    }
    catch (Exception e)
    {
      if (e.Message == "Character with this ID already exists")
      {
        return Conflict(e.Message);
      }
      throw new HttpRequestException();
    }
  }
}