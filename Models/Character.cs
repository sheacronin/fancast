using Google.Cloud.Firestore;

namespace fancast.Models;

[FirestoreData]
public class Character
{
  [FirestoreDocumentId]
  public required string Id { get; set; }

  [FirestoreProperty("name")]
  public required string Name { get; set; }

  [FirestoreProperty("book_id")]
  public required string BookId { get; set; }

  [FirestoreProperty("actor_ids")]
  public required IList<int> ActorIds { get; set; }
}
