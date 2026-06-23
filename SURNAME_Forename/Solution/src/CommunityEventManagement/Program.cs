using Microsoft.EntityFrameworkCore;
using CommunityEventManagement.Data;
using CommunityEventManagement.Repositories;
using CommunityEventManagement.Services;
using CommunityEventManagement.Models;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=eventmanagement.db"));

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IEventService, EventService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
    
    // Seed initial participant
    if (!context.Participants.Any())
    {
        context.Participants.Add(new Participant { Name = "Default User", Email = "user@example.com", Phone = "123456789" });
        context.SaveChanges();
    }
}

app.Run();
