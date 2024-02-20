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
}