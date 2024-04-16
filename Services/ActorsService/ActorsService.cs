using Microsoft.Extensions.Caching.Memory;
using TMDbLib.Client;
using TMDbLib.Objects.People;
using TMDbLib.Objects.General;
using TMDbLib.Objects.Search;
using fancast.Models;

namespace fancast.Services.ActorsService;

public class ActorsService : IActorsService
{
  private static readonly TMDbClient _client = new(Environment.GetEnvironmentVariable("TMDB_API_KEY"));
  private readonly IMemoryCache _cache;
  private static readonly TimeSpan _cacheTime = TimeSpan.FromHours(6);

  public ActorsService(IMemoryCache cache)
  {
    _cache = cache;
  }

  public async Task<Actor?> Get(int id)
  {
    string cacheKey = $"actor_{id}";

    Actor? actor = await _cache.GetOrCreateAsync(cacheKey, async entry =>
    {
      entry.SetSlidingExpiration(_cacheTime);

      Person person = await _client.GetPersonAsync(id);
      return person is null ? null : new Actor(person);
    });

    return actor;
  }

  public async Task<Actor[]> Search(string name)
  {
    string cacheKey = $"actorSearch_{name}";

    Actor[]? actors = await _cache.GetOrCreateAsync(cacheKey, async entry =>
    {
      entry.SetSlidingExpiration(_cacheTime);

      SearchContainer<SearchPerson> results = await _client.SearchPersonAsync(name);
      IList<Actor> actorsList = new List<Actor>();
      foreach (SearchPerson result in results.Results)
      {
        Person person = await _client.GetPersonAsync(result.Id);
        Actor actor = new(person);
        actorsList.Add(actor);
      }
      return actorsList.ToArray();
    });

    return actors!;
  }
}