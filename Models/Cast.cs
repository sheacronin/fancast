using Google.Cloud.Firestore;

namespace fancast.Models;

[FirestoreData]
public class Cast
{
  [FirestoreDocumentId]
  public required string Id { get; set; }

  [FirestoreProperty("name")]
  public required string Name { get; set; }

  [FirestoreProperty("gender")]
  public required string Gender { get; set; }

  [FirestoreProperty("imageLink")]
  public required string ImageLink { get; set; }
}