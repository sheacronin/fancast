using fancast.Models;

namespace fancast.Services.ActorsService;

public interface IActorsService
{
  Task<Actor> Get(int id);
  Task<Actor[]> GetByCharacter(int characterId);
  Task<Actor[]> Search(string name);
}