using fancast.Models;

namespace fancast.Services.CharactersService;

public interface ICharactersService
{
  Task<Character> Get(string id);
  Task<Character[]> GetByBook(string bookId);
  Task AddActor(string id, int actorId);
  Task<Character> Create(Character character);
}