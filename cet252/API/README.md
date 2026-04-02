# Book Manager – REST API

A Node.js + Express REST API for managing a book manager, backed by SQLite via Node's built-in `node:sqlite` module.

## Prerequisites

- **Node.js 22.5.0 or later** (built-in `node:sqlite` is required)
- npm

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Seed the database (first run only)

```bash
npm run seed
```

This inserts 25 books into `db/library.db`.

### 3. Start the API server

```bash
npm start
```

The API will be available at **http://localhost:3000**.

### 4. (Optional) Development mode with auto-restart

```bash
npm run dev
```

### 5. Generate API documentation

```bash
npm run build:docs
```

Then open `../APIDOC/index.html` in your browser, or visit **http://localhost:3000/docs** while the server is running.

---

## Running Tests

```bash
npm test
```

Tests use Jest + Supertest against an in-memory SQLite database.

---

## API Endpoints

### CRUD mapping

- **Create** → `POST /api/books`
- **Read** → `GET /api/books` and `GET /api/books/:id`
- **Update** → `PUT /api/books/:id`
- **Delete** → `DELETE /api/books/:id`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | List all books (supports `?q=`, `?genre=`, `?available=`) |
| GET | `/api/books/genres` | List all unique genres |
| GET | `/api/books/:id` | Get a single book by ID |
| POST | `/api/books` | Create a new book |
| PUT | `/api/books/:id` | Update an existing book |
| DELETE | `/api/books/:id` | Delete a book |

You can also open `GET /api` to verify the API base path is running and to see available endpoint groups.

### Query Parameters for `GET /api/books`

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search by title or author (partial match) |
| `genre` | string | Filter by exact genre (case-insensitive) |
| `available` | 0 or 1 | Filter by availability |
| `author` | string | Filter by author (partial match) |

### Example Requests

**Get all Fantasy books:**
```
GET http://localhost:3000/api/books?genre=Fantasy
```

**Search by title:**
```
GET http://localhost:3000/api/books?q=hobbit
```

**Add a new book:**
```json
POST http://localhost:3000/api/books
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "genre": "Non-Fiction",
  "year": 2008,
  "isbn": "978-0-13-235088-4",
  "description": "A handbook of agile software craftsmanship.",
  "available": 1
}
```

---

## Project Structure

```
API/
├── server.js           # Express app entry point
├── db/
│   ├── database.js     # Database connection & init (node:sqlite)
│   └── seed.js         # Database seeding script
├── routes/
│   └── books.js        # /api/books router + apiDoc comments
├── tests/
│   └── books.test.js   # Jest + Supertest integration tests
├── apidoc.json         # apiDoc configuration
├── package.json
└── .gitignore
```

---

## Technical Notes

- Uses Node.js built-in `node:sqlite` (available in Node 22.5+) – no native compilation required
- All endpoints return JSON
- CORS is enabled for cross-origin client requests
- Generated API docs are written to `../APIDOC` and served at `/docs` (after running `npm run build:docs`)
