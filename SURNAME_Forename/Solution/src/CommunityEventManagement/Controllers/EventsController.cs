using Microsoft.AspNetCore.Mvc;
using CommunityEventManagement.Services;
using CommunityEventManagement.Models;
using System.Threading.Tasks;

namespace CommunityEventManagement.Controllers
{
    public class EventsController : Controller
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        public async Task<IActionResult> Index()
        {
            var events = await _eventService.GetAllEventsAsync();
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
        
        // Mock registration for a default participant (id=1)
        [HttpPost, ActionName("Register")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RegisterConfirmed(int id)
        {
            try
            {
                // In a real app, ParticipantId comes from logged-in user
                await _eventService.RegisterParticipantAsync(id, 1);
                TempData["Message"] = "Successfully registered!";
                return RedirectToAction(nameof(Details), new { id = id });
            }
            catch (System.Exception ex)
            {
                TempData["Error"] = ex.Message;
                return RedirectToAction(nameof(Details), new { id = id });
            }
        }
    }
}
