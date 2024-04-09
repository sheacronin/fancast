using TMDbLib.Client;
using TMDbLib.Objects.People;
using TMDbLib.Objects.General;
using TMDbLib.Objects.Search;
using fancast.Models;

namespace fancast.Services.ActorsService;

public class ActorsService : IActorsService
{
  private static readonly TMDbClient _client = new(Environment.GetEnvironmentVariable("TMDB_API_KEY"));

  public async Task<Actor> Get(int id)
  {
    Person person = await _client.GetPersonAsync(id);
    return new Actor(person);
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