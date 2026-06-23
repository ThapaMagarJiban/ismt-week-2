using Microsoft.AspNetCore.Mvc;
using CommunityEventManagement.Models;
using CommunityEventManagement.Repositories;
using System.Threading.Tasks;

namespace CommunityEventManagement.Controllers
{
    public class VenuesController : Controller
    {
        private readonly IRepository<Venue> _repository;

        public VenuesController(IRepository<Venue> repository)
        {
            _repository = repository;
        }

        public async Task<IActionResult> Index()
        {
            return View(await _repository.GetAllAsync());
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Name,Address,Capacity")] Venue venue)
        {
            if (ModelState.IsValid)
            {
                await _repository.AddAsync(venue);
                return RedirectToAction(nameof(Index));
            }
            return View(venue);
        }
    }
}
