using fancast.Models;
using Google.Cloud.Firestore;

namespace fancast.Services.CharactersService;

public class CharactersService : ICharactersService
{
  static readonly FirestoreDb db = FirestoreDb.Create("fancast-api");

  public async Task<Character> Get(string id)
  {
    DocumentReference characterRef = db.Collection("characters").Document(id);
    DocumentSnapshot characterSnapshot = await characterRef.GetSnapshotAsync();
    return characterSnapshot.ConvertTo<Character>();
  }

  public async Task<Character[]> GetByBook(string bookId)
  {
    Query charactersQuery = db.Collection("characters").WhereEqualTo("book_id", bookId);
    QuerySnapshot charactersSnapshot = await charactersQuery.GetSnapshotAsync();
    return charactersSnapshot.Select(character => character.ConvertTo<Character>()).ToArray();
  }

  public async Task AddActor(string id, int actorId)
  {
    DocumentReference characterRef = db.Collection("characters").Document(id);
    DocumentSnapshot characterSnapshot = await characterRef.GetSnapshotAsync();
    var actorIds = characterSnapshot.GetValue<IList<int>>("actor_ids");
    actorIds.Add(actorId);
    await characterRef.UpdateAsync("actor_ids", actorIds);
  }

  public async Task<Character> Create(Character character)
  {
    DocumentReference newCharacterRef = await db.Collection("characters").AddAsync(character);
    DocumentSnapshot newCharacterSnapshot = await newCharacterRef.GetSnapshotAsync();
    return newCharacterSnapshot.ConvertTo<Character>();
  }
}