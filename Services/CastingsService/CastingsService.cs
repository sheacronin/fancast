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

  public async Task<Casting[]> GetRecent(int userId, int limit)
  {
    return await _context.Castings
      .Include(c => c.Character)
      .Include(c => c.Users)
      .Where(c => userId == -1 || c.Users.Any(u => u.Id == userId))
      .OrderByDescending(c => c.CreatedAt)
      .Take(limit)
      .ToArrayAsync();
  }

  public async Task<Casting[]> Search(int? characterId = null, int? actorId = null) =>
    await _context.Castings
      .Include(c => c.Users)
      .Where(c => c.CharacterId == characterId || c.ActorId == actorId)
      .ToArrayAsync();

  private async Task<bool> Exists(CastingDto castingDto) =>
    await _context.Castings
      .AnyAsync(c => c.CharacterId == castingDto.CharacterId && c.ActorId == castingDto.ActorId);

  public async Task<Casting> CreateCasting(CastingDto castingDto, User user)
  {
    // Check if this character/actor pair already exists
    bool castingExists = await Exists(castingDto);
    if (castingExists)
    {
      throw new InvalidOperationException("This character already has been cast with this actor.");
    }

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
    Casting casting = await _context.Castings
      .Include(c => c.Users)
      .FirstOrDefaultAsync(c => c.Id == castingId)
        ?? throw new InvalidOperationException("Casting with this ID does not exist.");

    // Check if the user already has selected this casting
    if (casting.Users.Any(u => u.Id == user.Id))
    {
      throw new InvalidOperationException("User has already selected this casting.");
    }

    // Check if the user has a different selected casting for this character
    Casting? existingCasting = user.Castings.FirstOrDefault(c => c.CharacterId == casting.CharacterId);
    if (existingCasting is not null)
    {
      // If so, remove that casting from the user's castings
      user.Castings.Remove(existingCasting);
    }

    // Add relationship between the user and this casting if no errors
    casting.Users.Add(user);
    await _context.SaveChangesAsync();
    return casting;
  }
}