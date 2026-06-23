#!/bin/bash
cd SURNAME_Forename/Solution/src/CommunityEventManagement

mkdir -p Controllers

cat << 'INNER_EOF' > Controllers/VenuesController.cs
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
INNER_EOF

cat << 'INNER_EOF' > Controllers/ActivitiesController.cs
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
INNER_EOF

cat << 'INNER_EOF' > Controllers/ParticipantsController.cs
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
INNER_EOF
