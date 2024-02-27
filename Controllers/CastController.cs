using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using fancast.Models;
using TMDbLib.Client;
using TMDbLib.Objects.People;
using TMDbLib.Objects.General;
using TMDbLib.Objects.Search;

namespace fancast.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CastController : ControllerBase
{
  private readonly ILogger<CastController> _logger;

  public CastController(ILogger<CastController> logger)
  {
    _logger = logger;
  }

  static readonly FirestoreDb db = FirestoreDb.Create("fancast-api");

  static readonly TMDbClient client = new(Environment.GetEnvironmentVariable("TMDB_API_KEY"));

  [HttpGet("{id}")]
  public async Task<Cast> Get(int id)
  {
    Person person = await client.GetPersonAsync(id);
    return new Cast()
    {
      Id = person.Id.ToString(),
      Name = person.Name,
      Gender = person.Gender.ToString(),
      ImageLink = person.ProfilePath
    };
  }

  [HttpGet("character/{characterId}")]
  public async Task<IEnumerable<Cast>> GetCharacterCast(string characterId)
  {
    DocumentReference characterRef = db.Collection("characters").Document(characterId);
    DocumentSnapshot characterSnapshot = await characterRef.GetSnapshotAsync();
    Character character = characterSnapshot.ConvertTo<Character>();

    // If there are no castings for the character, return an empty array.
    if (!character.CastIds.Any())
    {
      return Array.Empty<Cast>();
    }

    IList<Cast> castings = new List<Cast>();
    foreach (string id in character.CastIds)
    {
      Person person = await client.GetPersonAsync(Int32.Parse(id));
      Cast casting = new()
      {
        Id = person.Id.ToString(),
        Name = person.Name,
        Gender = person.Gender.ToString(),
        ImageLink = person.ProfilePath
      };
      castings.Add(casting);
    }
    return castings;
  }

  [HttpGet("search/{query}")]
  public async Task<IEnumerable<Cast>> Search(string query)
  {
    SearchContainer<SearchPerson> results = await client.SearchPersonAsync(query);
    IList<Cast> people = new List<Cast>();
    foreach (SearchPerson result in results.Results)
    {
      Person person = await client.GetPersonAsync(result.Id);
      Cast casting = new()
      {
        Id = person.Id.ToString(),
        Name = person.Name,
        Gender = person.Gender.ToString(),
        ImageLink = person.ProfilePath
      };
      people.Add(casting);
    }
    return people;
  }
}