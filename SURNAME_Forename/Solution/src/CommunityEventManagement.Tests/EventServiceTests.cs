using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Microsoft.EntityFrameworkCore;
using CommunityEventManagement.Models;
using CommunityEventManagement.Repositories;
using CommunityEventManagement.Services;
using CommunityEventManagement.Data;

namespace CommunityEventManagement.Tests
{
    public class EventServiceTests
    {
        private DbContextOptions<ApplicationDbContext> _dbContextOptions;

        public EventServiceTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "EventManagementTestDb")
                .Options;
        }

        [Fact]
        public async Task CreateEventAsync_ShouldCallRepositoryAddAsync()
        {
            // Arrange
            var mockRepo = new Mock<IRepository<Event>>();
            using var context = new ApplicationDbContext(_dbContextOptions);
            var service = new EventService(mockRepo.Object, context);
            var newEvent = new Event { Name = "Test Event", Date = DateTime.Now };

            // Act
            await service.CreateEventAsync(newEvent);

            // Assert
            mockRepo.Verify(r => r.AddAsync(newEvent), Times.Once);
        }

        [Fact]
        public async Task RegisterParticipantAsync_ShouldAddRegistration_WhenNotRegistered()
        {
            // Arrange
            using var context = new ApplicationDbContext(_dbContextOptions);
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
            
            var mockRepo = new Mock<IRepository<Event>>();
            var service = new EventService(mockRepo.Object, context);
            
            // Act
            await service.RegisterParticipantAsync(1, 1);

            // Assert
            var registration = await context.Registrations.FirstOrDefaultAsync();
            Assert.NotNull(registration);
            Assert.Equal(1, registration.EventId);
            Assert.Equal(1, registration.ParticipantId);
        }

        [Fact]
        public async Task RegisterParticipantAsync_ShouldThrowException_WhenAlreadyRegistered()
        {
            // Arrange
            using var context = new ApplicationDbContext(_dbContextOptions);
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
            
            context.Registrations.Add(new Registration { EventId = 1, ParticipantId = 1 });
            await context.SaveChangesAsync();

            var mockRepo = new Mock<IRepository<Event>>();
            var service = new EventService(mockRepo.Object, context);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => service.RegisterParticipantAsync(1, 1));
        }
    }
}
