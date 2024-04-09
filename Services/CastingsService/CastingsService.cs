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

  public async Task<Casting?> GetCasting(int id) =>
    await _context.Castings.Include(c => c.Character).Include(c => c.Users)
      .FirstOrDefaultAsync(c => c.Id == id);

  public async Task<Casting> CreateCasting(CastingDto castingDto, User user)
  {
    // TODO: handle existing casting

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

  // TODO:
  public async Task SelectCasting(int castingId)
  {
    throw new NotImplementedException();
  }
}