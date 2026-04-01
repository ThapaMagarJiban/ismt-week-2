# ismt-week-2 – Book Manager Prototype

A full-stack Book Manager prototype built with **Node.js**, **Express**, **SQLite**, and a vanilla JavaScript client.

## Repository Structure

```
cet252/
├── api/       # REST API (Node.js + Express + node:sqlite)
└── client/    # Vanilla JS web client (HTML/CSS/JS)
```

## Quick Start

### API

```bash
cd cet252/api
npm install
npm run seed   # Seed 25 books into the database
npm start      # Start API on http://localhost:3000
```

### Client

```bash
cd cet252/client
npm install
npm start      # Serve client on http://localhost:8080
```

See each folder's `README.md` for full details.

## Features

- Full CRUD REST API with SQLite (GET, POST, PUT, DELETE)
- 25 seed books across multiple genres
- Search, filter by genre and availability
- Responsive card-based UI
- API documentation (apiDoc)
- Integration tests (API) and unit tests (client)
