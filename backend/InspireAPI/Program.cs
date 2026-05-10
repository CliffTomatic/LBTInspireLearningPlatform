using InspireAPI.Data;
using InspireAPI.Settings;
using InspireAPI.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Services
builder.Services.AddSingleton<VideoService>();
// One instance per HTTP Request
builder.Services.AddScoped<SessionService>();

// Dynamic Session Tracking Settings
builder.Services.Configure<SessionTrackingSettings>(
    builder.Configuration.GetSection("SessionTracking"));

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SQLite - Register Database to be seen by controllers.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=MockServer/MockData/pulse.db";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
