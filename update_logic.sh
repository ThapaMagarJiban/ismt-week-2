#!/bin/bash
cd SURNAME_Forename/Solution/src/CommunityEventManagement

# Add missing functionalities to EventService
cat << 'INNER_EOF' > Services/IEventService.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityEventManagement.Models;

namespace CommunityEventManagement.Services
{
    public interface IEventService
    {
        Task<IEnumerable<Event>> GetAllEventsAsync(string venueFilter = null, string activityFilter = null, System.DateTime? dateFilter = null);
        Task<Event?> GetEventByIdAsync(int id);
        Task CreateEventAsync(Event newEvent);
        Task UpdateEventAsync(Event updatedEvent);
        Task DeleteEventAsync(int id);
        Task RegisterParticipantAsync(int eventId, int participantId);
        Task<IEnumerable<Registration>> GetRegistrationsForParticipantAsync(int participantId);
    }
}
INNER_EOF

cat << 'INNER_EOF' > Services/EventService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommunityEventManagement.Models;
using CommunityEventManagement.Repositories;
using Microsoft.EntityFrameworkCore;
using CommunityEventManagement.Data;

namespace CommunityEventManagement.Services
{
    public class EventService : IEventService
    {
        private readonly IRepository<Event> _eventRepository;
        private readonly ApplicationDbContext _context;

        public EventService(IRepository<Event> eventRepository, ApplicationDbContext context)
        {
            _eventRepository = eventRepository;
            _context = context;
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync(string venueFilter = null, string activityFilter = null, DateTime? dateFilter = null)
        {
            var query = _context.Events
                .Include(e => e.Registrations)
                .Include(e => e.EventVenues).ThenInclude(ev => ev.Venue)
                .Include(e => e.EventActivities).ThenInclude(ea => ea.Activity)
                .AsQueryable();

            if (!string.IsNullOrEmpty(venueFilter))
            {
                query = query.Where(e => e.EventVenues.Any(ev => ev.Venue.Name.Contains(venueFilter)));
            }

            if (!string.IsNullOrEmpty(activityFilter))
            {
                query = query.Where(e => e.EventActivities.Any(ea => ea.Activity.Type.Contains(activityFilter)));
            }

            if (dateFilter.HasValue)
            {
                query = query.Where(e => e.Date.Date == dateFilter.Value.Date);
            }

            return await query.ToListAsync();
        }

        public async Task<Event?> GetEventByIdAsync(int id)
        {
            return await _context.Events
                .Include(e => e.Registrations)
                .Include(e => e.EventVenues).ThenInclude(ev => ev.Venue)
                .Include(e => e.EventActivities).ThenInclude(ea => ea.Activity)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task CreateEventAsync(Event newEvent)
        {
            if (newEvent == null) throw new ArgumentNullException(nameof(newEvent));
            await _eventRepository.AddAsync(newEvent);
        }

        public async Task UpdateEventAsync(Event updatedEvent)
        {
            if (updatedEvent == null) throw new ArgumentNullException(nameof(updatedEvent));
            await _eventRepository.UpdateAsync(updatedEvent);
        }

        public async Task DeleteEventAsync(int id)
        {
            await _eventRepository.DeleteAsync(id);
        }

        public async Task RegisterParticipantAsync(int eventId, int participantId)
        {
            var existingRegistration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.EventId == eventId && r.ParticipantId == participantId);
            
            if (existingRegistration == null)
            {
                var registration = new Registration
                {
                    EventId = eventId,
                    ParticipantId = participantId,
                    RegistrationDate = DateTime.UtcNow,
                    Status = "Registered"
                };
                _context.Registrations.Add(registration);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new InvalidOperationException("Participant is already registered for this event.");
            }
        }
        
        public async Task<IEnumerable<Registration>> GetRegistrationsForParticipantAsync(int participantId)
        {
            return await _context.Registrations
                .Include(r => r.Event)
                .Where(r => r.ParticipantId == participantId)
                .ToListAsync();
        }
    }
}
INNER_EOF

# Update EventsController to support filtering and user registrations
cat << 'INNER_EOF' > Controllers/EventsController.cs
using Microsoft.AspNetCore.Mvc;
using CommunityEventManagement.Services;
using CommunityEventManagement.Models;
using System.Threading.Tasks;
using System;

namespace CommunityEventManagement.Controllers
{
    public class EventsController : Controller
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        public async Task<IActionResult> Index(string venueFilter, string activityFilter, DateTime? dateFilter)
        {
            ViewData["VenueFilter"] = venueFilter;
            ViewData["ActivityFilter"] = activityFilter;
            ViewData["DateFilter"] = dateFilter?.ToString("yyyy-MM-dd");

            var events = await _eventService.GetAllEventsAsync(venueFilter, activityFilter, dateFilter);
            return View(events);
        }

        public async Task<IActionResult> Details(int id)
        {
            var ev = await _eventService.GetEventByIdAsync(id);
            if (ev == null) return NotFound();
            return View(ev);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Name,Date,Description")] Event newEvent)
        {
            if (ModelState.IsValid)
            {
                await _eventService.CreateEventAsync(newEvent);
                return RedirectToAction(nameof(Index));
            }
            return View(newEvent);
        }
        
        public async Task<IActionResult> Register(int id)
        {
            var ev = await _eventService.GetEventByIdAsync(id);
            if (ev == null) return NotFound();
            return View(ev);
        }
        
        [HttpPost, ActionName("Register")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RegisterConfirmed(int id)
        {
            try
            {
                await _eventService.RegisterParticipantAsync(id, 1); // default participant ID 1
                TempData["Message"] = "Successfully registered!";
                return RedirectToAction(nameof(Details), new { id = id });
            }
            catch (Exception ex)
            {
                TempData["Error"] = ex.Message;
                return RedirectToAction(nameof(Details), new { id = id });
            }
        }
        
        public async Task<IActionResult> MyRegistrations()
        {
            var registrations = await _eventService.GetRegistrationsForParticipantAsync(1); // default participant ID 1
            return View(registrations);
        }
    }
}
INNER_EOF

# Ensure Participant ID 1 exists
cat << 'INNER_EOF' > Program.cs
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
INNER_EOF
