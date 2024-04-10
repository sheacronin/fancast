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

  public async Task<Character?> Get(int id) =>
    await _context.Characters.Include(c => c.Castings).FirstOrDefaultAsync(c => c.Id == id);

  public async Task<Character[]> GetByBook(string bookId) =>
    await _context.Characters.Include(c => c.Castings)
      .Where(c => c.BookId == bookId).OrderBy(c => c.Name).ToArrayAsync();

  public async Task<Character> Create(Character character)
  {
    if (await _context.Characters.AnyAsync(c => c.Id == character.Id))
    {
      throw new InvalidOperationException("Character with this ID already exists");
    }
    _context.Characters.Add(character);
    await _context.SaveChangesAsync();
    return character;
  }
}