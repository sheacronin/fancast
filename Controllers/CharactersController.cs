using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using fancast.Models;

namespace fancast.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CharactersController : ControllerBase
{
  private readonly ILogger<CharactersController> _logger;

  public CharactersController(ILogger<CharactersController> logger)
  {
    _logger = logger;
  }

  static readonly FirestoreDb db = FirestoreDb.Create("fancast-api");

  [HttpGet("{id}")]
  public async Task<Character> Get(string id)
  {
    DocumentReference characterRef = db.Collection("characters").Document(id);
    DocumentSnapshot characterSnapshot = await characterRef.GetSnapshotAsync();
    return characterSnapshot.ConvertTo<Character>();
  }

  [HttpGet("book/{bookId}")]
  public async Task<IEnumerable<Character>> GetByBook(string bookId)
  {
    Query charactersQuery = db.Collection("characters").WhereEqualTo("book_id", bookId);
    QuerySnapshot charactersSnapshot = await charactersQuery.GetSnapshotAsync();
    return charactersSnapshot.Select(character => character.ConvertTo<Character>()).ToArray();
  }

  [HttpPut("{id}/addCasting")]
  public async Task<WriteResult> AddCasting(string id, [FromBody] string actorId)
  {
    Console.WriteLine($"Adding {actorId}");
    DocumentReference characterRef = db.Collection("characters").Document(id);
    DocumentSnapshot characterSnapshot = await characterRef.GetSnapshotAsync();
    var castIds = characterSnapshot.GetValue<IList<string>>("cast_ids");
    castIds.Add(actorId);
    return await characterRef.UpdateAsync("cast_ids", castIds);
  }
}