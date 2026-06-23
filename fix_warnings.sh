#!/bin/bash
cd SURNAME_Forename/Solution/src/CommunityEventManagement
sed -i 's/string venueFilter = null/string? venueFilter = null/' Services/IEventService.cs
sed -i 's/string activityFilter = null/string? activityFilter = null/' Services/IEventService.cs
sed -i 's/string venueFilter = null/string? venueFilter = null/' Services/EventService.cs
sed -i 's/string activityFilter = null/string? activityFilter = null/' Services/EventService.cs
sed -i 's/public async Task<IActionResult> Index(string venueFilter, string activityFilter, DateTime? dateFilter)/public async Task<IActionResult> Index(string? venueFilter, string? activityFilter, DateTime? dateFilter)/' Controllers/EventsController.cs
