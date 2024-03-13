using TMDbLib.Client;
using TMDbLib.Objects.People;
using TMDbLib.Objects.General;
using TMDbLib.Objects.Search;
using Google.Cloud.Firestore;
using fancast.Models;

namespace fancast.Services.ActorsService;

public class ActorsService : IActorsService
{
  static readonly TMDbClient client = new(Environment.GetEnvironmentVariable("TMDB_API_KEY"));
  static readonly FirestoreDb db = FirestoreDb.Create("fancast-api");

  public async Task<Actor> Get(int id)
  {
    Person person = await client.GetPersonAsync(id);
    return new Actor(person);
  }

  public async Task<Actor[]> GetByCharacter(string characterId)
  {
    DocumentReference characterRef = db.Collection("characters").Document(characterId);
    DocumentSnapshot characterSnapshot = await characterRef.GetSnapshotAsync();
    Character character = characterSnapshot.ConvertTo<Character>();

    // If there are no actors for the character, return an empty array.
    if (!character.ActorIds.Any())
    {
      return Array.Empty<Actor>();
    }

    IList<Actor> actors = new List<Actor>();
    foreach (int id in character.ActorIds)
    {
      Person person = await client.GetPersonAsync(id);
      Actor actor = new(person);
      actors.Add(actor);
    }
    return actors.ToArray();
  }

  public async Task<Actor[]> Search(string name)
  {
    SearchContainer<SearchPerson> results = await client.SearchPersonAsync(name);
    IList<Actor> actors = new List<Actor>();
    foreach (SearchPerson result in results.Results)
    {
      Person person = await client.GetPersonAsync(result.Id);
      Actor actor = new(person);
      actors.Add(actor);
    }
    return actors.ToArray();
  }
}