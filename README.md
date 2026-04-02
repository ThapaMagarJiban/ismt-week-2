# ismt-week-2 – Book Manager Prototype

A full-stack Book Manager prototype built with **Node.js**, **Express**, **SQLite**, and a vanilla JavaScript client.

## Repository Structure

```
cet252/
├── API/       # REST API (Node.js + Express + node:sqlite)
├── CLIENT/    # Vanilla JS web client (HTML/CSS/JS)
└── APIDOC/    # Generated API docs (open APIDOC/index.html)
```

## Quick Start

### API

```bash
cd cet252/API
npm install
npm run seed   # Seed 25 books into the database
npm start      # Start API + serve client on http://localhost:3000
```

### Client

```bash
cd cet252/CLIENT
npm install
npm start      # Serve client on http://localhost:8080
```

You can use either URL for the UI:
- `http://localhost:3000/` (served by API)
- `http://localhost:8080/` (standalone client server)

See each folder's `README.md` for full details.

## Features

- Full CRUD REST API with SQLite (GET, POST, PUT, DELETE)
- 25 seed books across multiple genres
- Search, filter by genre and availability
- Responsive card-based UI
- API documentation (apiDoc)
- Integration tests (API) and unit tests (client)

## Design Deliverable

- Low-fidelity wireframes (initial designs): [`LOW_FIDELITY_WIREFRAMES.md`](./LOW_FIDELITY_WIREFRAMES.md)
