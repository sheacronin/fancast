using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using fancast.Models;
using fancast.Data;

namespace fancast.Services.CharactersService;

public class CharactersService : ICharactersService
{
  private readonly FancastContext _context;
  private readonly IMemoryCache _cache;
  private static readonly TimeSpan _cacheTime = TimeSpan.FromHours(3);
  private static readonly MemoryCacheEntryOptions _cacheEntryOptions =
    new MemoryCacheEntryOptions().SetSlidingExpiration(_cacheTime);

  public CharactersService(FancastContext context, IMemoryCache cache)
  {
    _context = context;
    _cache = cache;
  }

  public async Task<Character?> Get(int id)
  {
    string cacheKey = $"character_{id}";

    return await _cache.GetOrCreateAsync(cacheKey, async entry =>
    {
      entry.SetSlidingExpiration(_cacheTime);
      return await _context.Characters.FirstOrDefaultAsync(c => c.Id == id);
    });
  }

  public async Task<Character[]> GetByBook(string bookId)
  {
    string cacheKey = $"charactersByBook_{bookId}";

    return await _cache.GetOrCreateAsync(cacheKey, async entry =>
    {
      entry.SetSlidingExpiration(_cacheTime);

      return await _context.Characters
        .Where(c => c.BookId == bookId).OrderBy(c => c.Name).ToArrayAsync();
    })
      ?? throw new Exception("There was an error with this book's character data.");
  }

  public async Task<Character> Create(Character character)
  {
    if (await _context.Characters.AnyAsync(c => c.Id == character.Id))
    {
      throw new InvalidOperationException("Character with this ID already exists");
    }
    _context.Characters.Add(character);
    await _context.SaveChangesAsync();

    // Update the cache
    string characterCacheKey = $"character_{character.Id}";
    _cache.Set(characterCacheKey, character, _cacheEntryOptions);

    string bookCharactersCacheKey = $"charactersByBook_{character.BookId}";
    _cache.TryGetValue(bookCharactersCacheKey, out Character[]? cachedBookCharacters);
    Character[] updatedBookCharacters;
    if (cachedBookCharacters is null)
    {
      updatedBookCharacters = new Character[] { character };
    }
    else
    {
      List<Character> charactersList = cachedBookCharacters.ToList();
      charactersList.Add(character);
      updatedBookCharacters = charactersList.OrderBy(c => c.Name).ToArray();
    }
    _cache.Set(bookCharactersCacheKey, updatedBookCharacters, _cacheEntryOptions);

    return character;
  }
}