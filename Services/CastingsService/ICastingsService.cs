using fancast.Models;

namespace fancast.Services.CastingsService;

public interface ICastingsService
{
  Task<Casting?> GetCasting(int id);
  Task<Casting> CreateCasting(CastingDto castingDto, User user);
  Task SelectCasting(int castingId);
}