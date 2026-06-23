using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CommunityEventManagement.Models
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Event : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;

        public virtual ICollection<Registration> Registrations { get; set; } = new List<Registration>();
        public virtual ICollection<EventVenue> EventVenues { get; set; } = new List<EventVenue>();
        public virtual ICollection<EventActivity> EventActivities { get; set; } = new List<EventActivity>();
    }

    public class Participant : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;

        public virtual ICollection<Registration> Registrations { get; set; } = new List<Registration>();
    }

    public class Venue : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int Capacity { get; set; }

        public virtual ICollection<EventVenue> EventVenues { get; set; } = new List<EventVenue>();
    }

    public class Activity : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // e.g., workshop, talk, game
        
        public virtual ICollection<EventActivity> EventActivities { get; set; } = new List<EventActivity>();
    }

    public class Registration
    {
        public int EventId { get; set; }
        public virtual Event Event { get; set; } = null!;

        public int ParticipantId { get; set; }
        public virtual Participant Participant { get; set; } = null!;

        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Registered"; // e.g., Registered, Cancelled
    }

    public class EventVenue
    {
        public int EventId { get; set; }
        public virtual Event Event { get; set; } = null!;

        public int VenueId { get; set; }
        public virtual Venue Venue { get; set; } = null!;
    }

    public class EventActivity
    {
        public int EventId { get; set; }
        public virtual Event Event { get; set; } = null!;

        public int ActivityId { get; set; }
        public virtual Activity Activity { get; set; } = null!;
    }
}
