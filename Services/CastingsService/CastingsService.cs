using Microsoft.EntityFrameworkCore;
using fancast.Models;
using fancast.Data;

namespace fancast.Services.CastingsService;

public class CastingsService : ICastingsService
{
  private readonly FancastContext _context;

  public CastingsService(FancastContext context)
  {
    _context = context;
  }

  public async Task<Casting?> Get(int id) =>
    await _context.Castings
      .Include(c => c.Character)
      .Include(c => c.Users)
      .FirstOrDefaultAsync(c => c.Id == id);

  public async Task<Casting[]> Search(int? characterId = null, int? actorId = null) =>
    await _context.Castings
      .Where(c => c.CharacterId == characterId || c.ActorId == actorId)
      .ToArrayAsync();

  public async Task<Casting> CreateCasting(CastingDto castingDto, User user)
  {
    Casting casting = new()
    {
      CharacterId = castingDto.CharacterId,
      ActorId = castingDto.ActorId,
    };
    casting.Users.Add(user);

    await _context.Castings.AddAsync(casting);
    await _context.SaveChangesAsync();
    return casting;
  }

  public async Task<Casting> SelectCasting(int castingId, User user)
  {
    Casting casting = await _context.Castings.Include(c => c.Users).SingleAsync(c => c.Id == castingId);
    casting.Users.Add(user);
    await _context.SaveChangesAsync();
    return casting;
  }
}