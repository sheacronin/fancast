using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using fancast.Models;

namespace fancast.Controllers;

[ApiController]
[Route("api")]
public class CharactersController : ControllerBase
{
  private readonly ILogger<CharactersController> _logger;

  public CharactersController(ILogger<CharactersController> logger)
  {
    _logger = logger;
  }

  static readonly FirestoreDb db = FirestoreDb.Create("fancast-api");

  [HttpGet("[controller]/{id}")]
  public async Task<Character> Get(string id)
  {
    DocumentReference characterRef = db.Collection("characters").Document(id);
    DocumentSnapshot characterSnapshot = await characterRef.GetSnapshotAsync();
    return characterSnapshot.ConvertTo<Character>();
  }

  [HttpGet("books/{bookId}/[controller]")]
  public async Task<IEnumerable<Character>> GetByBook(string bookId)
  {
    Query charactersQuery = db.Collection("characters").WhereEqualTo("book_id", bookId);
    QuerySnapshot charactersSnapshot = await charactersQuery.GetSnapshotAsync();
    return charactersSnapshot.Select(character => character.ConvertTo<Character>()).ToArray();
  }

  [HttpPatch("[controller]/{id}")]
  public async Task<WriteResult> AddActor(string id, [FromBody] int actorId)
  {
    DocumentReference characterRef = db.Collection("characters").Document(id);
    DocumentSnapshot characterSnapshot = await characterRef.GetSnapshotAsync();
    var actorIds = characterSnapshot.GetValue<IList<int>>("actor_ids");
    actorIds.Add(actorId);
    return await characterRef.UpdateAsync("actor_ids", actorIds);
  }

  [HttpPost("[controller]")]
  public async Task<Character> Create([FromBody] Character character)
  {
    DocumentReference addedCharacterRef = await db.Collection("characters").AddAsync(character);
    DocumentSnapshot addedCharacter = await addedCharacterRef.GetSnapshotAsync();
    return addedCharacter.ConvertTo<Character>();
  }
}