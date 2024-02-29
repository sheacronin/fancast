using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using TMDbLib.Client;
using TMDbLib.Objects.People;
using TMDbLib.Objects.General;
using TMDbLib.Objects.Search;
using fancast.Models;

namespace fancast.Controllers;

[ApiController]
[Route("api")]
public class ActorsController : ControllerBase
{
  private readonly ILogger<ActorsController> _logger;

  public ActorsController(ILogger<ActorsController> logger)
  {
    _logger = logger;
  }

  static readonly FirestoreDb db = FirestoreDb.Create("fancast-api");

  static readonly TMDbClient client = new(Environment.GetEnvironmentVariable("TMDB_API_KEY"));

  [HttpGet("[controller]/{id}")]
  public async Task<Actor> Get(int id)
  {
    Person person = await client.GetPersonAsync(id);
    return new Actor()
    {
      Id = person.Id,
      Name = person.Name,
      Gender = person.Gender.ToString(),
      ImageLink = person.ProfilePath
    };
  }

  [HttpGet("characters/{characterId}/[controller]")]
  public async Task<IEnumerable<Actor>> GetByCharacter(string characterId)
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
      Actor actor = new()
      {
        Id = person.Id,
        Name = person.Name,
        Gender = person.Gender.ToString(),
        ImageLink = person.ProfilePath
      };
      actors.Add(actor);
    }
    return actors;
  }

  [HttpGet("[controller]")]
  public async Task<IEnumerable<Actor>> Search([Required] string name)
  {
    SearchContainer<SearchPerson> results = await client.SearchPersonAsync(name);
    IList<Actor> actors = new List<Actor>();
    foreach (SearchPerson result in results.Results)
    {
      Person person = await client.GetPersonAsync(result.Id);
      Actor actor = new()
      {
        Id = person.Id,
        Name = person.Name,
        Gender = person.Gender.ToString(),
        ImageLink = person.ProfilePath
      };
      actors.Add(actor);
    }
    return actors;
  }
}