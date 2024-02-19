using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Google.Cloud.Firestore;
using fancast.Models;

namespace fancast.Controllers;

[ApiController]
[Route("[controller]")]
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
}