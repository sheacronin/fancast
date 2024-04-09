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
  public DbSet<Casting> Castings { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<Character>().ToTable("characters");
    modelBuilder.Entity<User>().ToTable("users");
    modelBuilder.Entity<Casting>().ToTable("castings");

    modelBuilder.Entity<User>()
      .HasMany(e => e.Castings).WithMany(e => e.Users)
      .UsingEntity("user_castings");
  }
}