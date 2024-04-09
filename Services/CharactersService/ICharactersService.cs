using fancast.Models;

namespace fancast.Services.CharactersService;

public interface ICharactersService
{
  Task<Character?> Get(int id);
  Task<Character[]> GetByBook(string bookId);
  Task<Character> Create(Character character);
}