using System;
using System.Collections.Generic;
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

        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _context.Events
                .Include(e => e.Registrations)
                .Include(e => e.EventVenues).ThenInclude(ev => ev.Venue)
                .Include(e => e.EventActivities).ThenInclude(ea => ea.Activity)
                .ToListAsync();
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
    }
}
