using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Google.Cloud.Firestore;
using fancast.Models;

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
}