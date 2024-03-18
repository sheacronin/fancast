using fancast.Models;
using fancast.Data;
using Microsoft.EntityFrameworkCore;

namespace fancast.Services.CharactersService;

public class CharactersService : ICharactersService
{
  private readonly FancastContext _context;

  public CharactersService(FancastContext context)
  {
    _context = context;
  }

  public async Task<Character?> Get(int id)
  {
    return await _context.Characters.FirstOrDefaultAsync(c => c.Id == id);
  }

  public async Task<Character[]> GetByBook(string bookId)
  {
    return _context.Characters.Where(c => c.BookId == bookId).OrderBy(c => c.Name).ToArray();
  }

  public async Task AddActor(int id, int actorId)
  {
    Character character = _context.Characters.Find(id) ?? throw new InvalidOperationException("Character does not exist");
    var actorIds = character.ActorIds.ToList();
    actorIds.Add(actorId);
    character.ActorIds = actorIds.ToArray();
    _context.SaveChanges();
  }

  public async Task<Character> Create(Character character)
  {
    if (_context.Characters.Any(c => c.Id == character.Id))
    {
      throw new InvalidOperationException("Character with this ID already exists");
    }
    _context.Characters.Add(character);
    _context.SaveChanges();
    return character;
  }
}