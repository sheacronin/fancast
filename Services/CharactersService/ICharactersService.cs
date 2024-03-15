using fancast.Models;

namespace fancast.Services.CharactersService;

public interface ICharactersService
{
  Task<Character?> Get(int id);
  Task<Character[]> GetByBook(string bookId);
  Task AddActor(int id, int actorId);
  Task<Character> Create(Character character);
}