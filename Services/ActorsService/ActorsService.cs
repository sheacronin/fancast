using TMDbLib.Client;
using TMDbLib.Objects.People;
using TMDbLib.Objects.General;
using TMDbLib.Objects.Search;
using fancast.Models;
using fancast.Data;
using fancast.Services.CharactersService;

namespace fancast.Services.ActorsService;

public class ActorsService : IActorsService
{
  private static readonly TMDbClient _client = new(Environment.GetEnvironmentVariable("TMDB_API_KEY"));
  private readonly FancastContext _context;
  private readonly ICharactersService _charactersService;

  public ActorsService(FancastContext context, ICharactersService charactersService)
  {
    _context = context;
    _charactersService = charactersService;
  }


  public async Task<Actor> Get(int id)
  {
    Person person = await _client.GetPersonAsync(id);
    return new Actor(person);
  }

  public async Task<Actor[]> GetByCharacter(int characterId)
  {
    Character? character = await _charactersService.Get(characterId)
      ?? throw new InvalidOperationException("The character does not exist");

    // If there are no actors for the character, return an empty array.
    if (!character.ActorIds.Any())
    {
      return Array.Empty<Actor>();
    }

    IList<Actor> actors = new List<Actor>();
    foreach (int id in character.ActorIds)
    {
      Person person = await _client.GetPersonAsync(id);
      Actor actor = new(person);
      actors.Add(actor);
    }
    return actors.OrderBy(a => a.Name).ToArray();
  }

  public async Task<Actor[]> Search(string name)
  {
    SearchContainer<SearchPerson> results = await _client.SearchPersonAsync(name);
    IList<Actor> actors = new List<Actor>();
    foreach (SearchPerson result in results.Results)
    {
      Person person = await _client.GetPersonAsync(result.Id);
      Actor actor = new(person);
      actors.Add(actor);
    }
    return actors.ToArray();
  }
}