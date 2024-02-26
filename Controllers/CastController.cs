using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
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

  static FirestoreDb Db
  {
    get
    {
      return FirestoreDb.Create("fancast-api");
    }
  }

  static readonly TMDbClient client = new(Environment.GetEnvironmentVariable("TMDB_API_KEY"));

  [HttpGet("{id}")]
  public async Task<Cast> Get(string id)
  {
    DocumentReference castRef = Db.Collection("cast").Document(id);
    DocumentSnapshot castSnapshot = await castRef.GetSnapshotAsync();
    return castSnapshot.ConvertTo<Cast>();
  }

  [HttpGet("character/{characterId}")]
  public async Task<IEnumerable<Cast>> GetCharacterCast(string characterId)
  {
    DocumentReference characterRef = Db.Collection("characters").Document(characterId);
    DocumentSnapshot characterSnapshot = await characterRef.GetSnapshotAsync();
    Character character = characterSnapshot.ConvertTo<Character>();

    // If there are no castings for the character, return an empty array.
    if (!character.CastIds.Any())
    {
      return Array.Empty<Cast>();
    }

    Query castQuery = Db.Collection("cast").WhereIn(FieldPath.DocumentId, character.CastIds);
    QuerySnapshot castSnapshot = await castQuery.GetSnapshotAsync();
    Cast[] castings = castSnapshot.Select(cast => cast.ConvertTo<Cast>()).ToArray();
    return castings;
  }

  [HttpGet("search/{query}")]
  [OutputCache(NoStore = true)]
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