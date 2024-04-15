using fancast.Models;

namespace fancast.Services.CastingsService;

public interface ICastingsService
{
  Task<Casting?> Get(int id);
  Task<Casting[]> GetRecent(int userId, int limit);
  Task<Casting[]> Search(int? characterId = null, int? actorId = null);
  Task<Casting> CreateCasting(CastingDto castingDto, User user);
  Task<Casting> SelectCasting(int castingId, User user);
}