using Microsoft.AspNetCore.Mvc;
using CommunityEventManagement.Models;
using CommunityEventManagement.Repositories;
using System.Threading.Tasks;

namespace CommunityEventManagement.Controllers
{
    public class ActivitiesController : Controller
    {
        private readonly IRepository<Activity> _repository;

        public ActivitiesController(IRepository<Activity> repository)
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
        public async Task<IActionResult> Create([Bind("Name,Type")] Activity activity)
        {
            if (ModelState.IsValid)
            {
                await _repository.AddAsync(activity);
                return RedirectToAction(nameof(Index));
            }
            return View(activity);
        }
    }
}
