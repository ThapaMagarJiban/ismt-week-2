using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityEventManagement.Models;

namespace CommunityEventManagement.Services
{
    public interface IEventService
    {
        Task<IEnumerable<Event>> GetAllEventsAsync();
        Task<Event?> GetEventByIdAsync(int id);
        Task CreateEventAsync(Event newEvent);
        Task UpdateEventAsync(Event updatedEvent);
        Task DeleteEventAsync(int id);
        Task RegisterParticipantAsync(int eventId, int participantId);
    }
}
