using Microsoft.EntityFrameworkCore;
using fancast.Models;

namespace fancast.Data;

public class FancastContext : DbContext
{
  public FancastContext(DbContextOptions<FancastContext> options) : base(options)
  {
  }

  public DbSet<Character> Characters { get; set; }
  public DbSet<User> Users { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<Character>().ToTable("characters");
    modelBuilder.Entity<User>().ToTable("users");
  }
}