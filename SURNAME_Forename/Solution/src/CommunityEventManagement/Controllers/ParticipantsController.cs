using Microsoft.AspNetCore.Mvc;
using CommunityEventManagement.Models;
using CommunityEventManagement.Repositories;
using System.Threading.Tasks;

namespace CommunityEventManagement.Controllers
{
    public class ParticipantsController : Controller
    {
        private readonly IRepository<Participant> _repository;

        public ParticipantsController(IRepository<Participant> repository)
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
        public async Task<IActionResult> Create([Bind("Name,Email,Phone")] Participant participant)
        {
            if (ModelState.IsValid)
            {
                await _repository.AddAsync(participant);
                return RedirectToAction(nameof(Index));
            }
            return View(participant);
        }
    }
}
