using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
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

    static FirestoreDb Db
    { 
      get 
      {
        return FirestoreDb.Create("fancast-api");
      }
    }

    [HttpGet("{id}")]
    public async Task<Character> Get(string id)
    {
      DocumentReference characterRef = Db.Collection("characters").Document(id);
      DocumentSnapshot characterSnapshot = await characterRef.GetSnapshotAsync();
      return characterSnapshot.ConvertTo<Character>();
    }

    [HttpGet("book/{bookId}")]
    public async Task<IEnumerable<Character>> GetByBook(string bookId)
    {
      Query charactersQuery = Db.Collection("characters").WhereEqualTo("book_id", bookId);
      QuerySnapshot charactersSnapshot = await charactersQuery.GetSnapshotAsync();
      return charactersSnapshot.Select(character => character.ConvertTo<Character>()).ToArray();
    }
}