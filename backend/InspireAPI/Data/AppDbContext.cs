using InspireAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace InspireAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Session> Sessions { get; set; }
}