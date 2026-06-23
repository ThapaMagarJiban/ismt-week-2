using Microsoft.EntityFrameworkCore;
using CommunityEventManagement.Models;

namespace CommunityEventManagement.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Event> Events { get; set; }
        public DbSet<Participant> Participants { get; set; }
        public DbSet<Venue> Venues { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Registration> Registrations { get; set; }
        public DbSet<EventVenue> EventVenues { get; set; }
        public DbSet<EventActivity> EventActivities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Registration>()
                .HasKey(r => new { r.EventId, r.ParticipantId });

            modelBuilder.Entity<EventVenue>()
                .HasKey(ev => new { ev.EventId, ev.VenueId });

            modelBuilder.Entity<EventActivity>()
                .HasKey(ea => new { ea.EventId, ea.ActivityId });
        }
    }
}
