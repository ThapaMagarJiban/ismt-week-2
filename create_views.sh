#!/bin/bash
cd SURNAME_Forename/Solution/src/CommunityEventManagement/Views

# Events Index with Filters
cat << 'INNER_EOF' > Events/Index.cshtml
@model IEnumerable<CommunityEventManagement.Models.Event>

@{ ViewData["Title"] = "Events"; }

<h1>Community Events</h1>

<form method="get" asp-action="Index" class="mb-3">
    <div class="row">
        <div class="col-md-3">
            <input type="text" name="venueFilter" class="form-control" placeholder="Filter by Venue" value="@ViewData["VenueFilter"]" />
        </div>
        <div class="col-md-3">
            <input type="text" name="activityFilter" class="form-control" placeholder="Filter by Activity Type" value="@ViewData["ActivityFilter"]" />
        </div>
        <div class="col-md-3">
            <input type="date" name="dateFilter" class="form-control" value="@ViewData["DateFilter"]" />
        </div>
        <div class="col-md-3">
            <button type="submit" class="btn btn-secondary">Filter</button>
            <a asp-action="Index" class="btn btn-outline-secondary">Clear</a>
        </div>
    </div>
</form>

<p><a asp-action="Create" class="btn btn-primary">Create New Event</a></p>

<table class="table">
    <thead>
        <tr><th>Name</th><th>Date</th><th>Description</th><th>Actions</th></tr>
    </thead>
    <tbody>
@foreach (var item in Model) {
        <tr>
            <td>@item.Name</td>
            <td>@item.Date.ToString("g")</td>
            <td>@item.Description</td>
            <td><a asp-action="Details" asp-route-id="@item.Id">Details</a></td>
        </tr>
}
    </tbody>
</table>
INNER_EOF

# MyRegistrations View
cat << 'INNER_EOF' > Events/MyRegistrations.cshtml
@model IEnumerable<CommunityEventManagement.Models.Registration>
@{ ViewData["Title"] = "My Registrations"; }
<h1>My Registrations</h1>
<table class="table">
    <thead>
        <tr><th>Event Name</th><th>Date</th><th>Registration Date</th><th>Status</th></tr>
    </thead>
    <tbody>
@foreach (var item in Model) {
        <tr>
            <td>@item.Event.Name</td>
            <td>@item.Event.Date.ToString("g")</td>
            <td>@item.RegistrationDate.ToString("g")</td>
            <td>@item.Status</td>
        </tr>
}
    </tbody>
</table>
INNER_EOF

# Shared Layout Links
sed -i 's/<li class="nav-item">/<li class="nav-item">\n                            <a class="nav-link text-dark" asp-area="" asp-controller="Events" asp-action="MyRegistrations">My Registrations<\/a>\n                        <\/li>\n                        <li class="nav-item">\n                            <a class="nav-link text-dark" asp-area="" asp-controller="Venues" asp-action="Index">Venues<\/a>\n                        <\/li>\n                        <li class="nav-item">\n                            <a class="nav-link text-dark" asp-area="" asp-controller="Activities" asp-action="Index">Activities<\/a>\n                        <\/li>\n                        <li class="nav-item">\n                            <a class="nav-link text-dark" asp-area="" asp-controller="Participants" asp-action="Index">Participants<\/a>\n                        <\/li>\n                        <li class="nav-item">/' Shared/_Layout.cshtml

# Venues
mkdir -p Venues
cat << 'INNER_EOF' > Venues/Index.cshtml
@model IEnumerable<CommunityEventManagement.Models.Venue>
@{ ViewData["Title"] = "Venues"; }
<h1>Venues</h1>
<p><a asp-action="Create" class="btn btn-primary">Create New</a></p>
<table class="table">
    <thead><tr><th>Name</th><th>Address</th><th>Capacity</th></tr></thead>
    <tbody>
@foreach (var item in Model) {
        <tr><td>@item.Name</td><td>@item.Address</td><td>@item.Capacity</td></tr>
}
    </tbody>
</table>
INNER_EOF

cat << 'INNER_EOF' > Venues/Create.cshtml
@model CommunityEventManagement.Models.Venue
@{ ViewData["Title"] = "Create Venue"; }
<h1>Create Venue</h1>
<form asp-action="Create">
    <div class="form-group mb-3">
        <label asp-for="Name"></label><input asp-for="Name" class="form-control" />
    </div>
    <div class="form-group mb-3">
        <label asp-for="Address"></label><input asp-for="Address" class="form-control" />
    </div>
    <div class="form-group mb-3">
        <label asp-for="Capacity"></label><input asp-for="Capacity" class="form-control" type="number" />
    </div>
    <button type="submit" class="btn btn-primary">Create</button>
</form>
INNER_EOF

# Activities
mkdir -p Activities
cat << 'INNER_EOF' > Activities/Index.cshtml
@model IEnumerable<CommunityEventManagement.Models.Activity>
@{ ViewData["Title"] = "Activities"; }
<h1>Activities</h1>
<p><a asp-action="Create" class="btn btn-primary">Create New</a></p>
<table class="table">
    <thead><tr><th>Name</th><th>Type</th></tr></thead>
    <tbody>
@foreach (var item in Model) {
        <tr><td>@item.Name</td><td>@item.Type</td></tr>
}
    </tbody>
</table>
INNER_EOF

cat << 'INNER_EOF' > Activities/Create.cshtml
@model CommunityEventManagement.Models.Activity
@{ ViewData["Title"] = "Create Activity"; }
<h1>Create Activity</h1>
<form asp-action="Create">
    <div class="form-group mb-3">
        <label asp-for="Name"></label><input asp-for="Name" class="form-control" />
    </div>
    <div class="form-group mb-3">
        <label asp-for="Type"></label><input asp-for="Type" class="form-control" />
    </div>
    <button type="submit" class="btn btn-primary">Create</button>
</form>
INNER_EOF

# Participants
mkdir -p Participants
cat << 'INNER_EOF' > Participants/Index.cshtml
@model IEnumerable<CommunityEventManagement.Models.Participant>
@{ ViewData["Title"] = "Participants"; }
<h1>Participants</h1>
<p><a asp-action="Create" class="btn btn-primary">Create New</a></p>
<table class="table">
    <thead><tr><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
    <tbody>
@foreach (var item in Model) {
        <tr><td>@item.Name</td><td>@item.Email</td><td>@item.Phone</td></tr>
}
    </tbody>
</table>
INNER_EOF

cat << 'INNER_EOF' > Participants/Create.cshtml
@model CommunityEventManagement.Models.Participant
@{ ViewData["Title"] = "Create Participant"; }
<h1>Create Participant</h1>
<form asp-action="Create">
    <div class="form-group mb-3">
        <label asp-for="Name"></label><input asp-for="Name" class="form-control" />
    </div>
    <div class="form-group mb-3">
        <label asp-for="Email"></label><input asp-for="Email" class="form-control" />
    </div>
    <div class="form-group mb-3">
        <label asp-for="Phone"></label><input asp-for="Phone" class="form-control" />
    </div>
    <button type="submit" class="btn btn-primary">Create</button>
</form>
INNER_EOF
