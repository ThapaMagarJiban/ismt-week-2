const request = require('supertest');

// Use an in-memory database for tests so we don't touch the real DB
process.env.NODE_ENV = 'test';

// Monkey-patch: replace database module with a test in-memory db
jest.mock('../db/database', () => {
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      genre TEXT NOT NULL,
      year INTEGER NOT NULL,
      isbn TEXT UNIQUE NOT NULL,
      description TEXT,
      available INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Seed a few records for tests
  db.prepare('INSERT INTO books (title, author, genre, year, isbn, description, available) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run('Test Book One', 'Author A', 'Fantasy', 2000, '978-0-000-00001-1', 'Description one', 1);
  db.prepare('INSERT INTO books (title, author, genre, year, isbn, description, available) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run('Test Book Two', 'Author B', 'Thriller', 2005, '978-0-000-00002-2', 'Description two', 0);
  db.prepare('INSERT INTO books (title, author, genre, year, isbn, description, available) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run('Another Fantasy', 'Author C', 'Fantasy', 2010, '978-0-000-00003-3', 'Description three', 1);

  return {
    getDb: () => db,
    initDb: () => db
  };
});

const app = require('../server');

describe('GET /', () => {
  it('returns health check JSON', async () => {
    const res = await request(app).get('/').set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/Book Manager API/);
  });

  it('returns JSON even for browser-style requests', async () => {
    const res = await request(app).get('/').set('Accept', 'text/html');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/Book Manager API/);
  });
});

describe('GET /api', () => {
  it('returns API entrypoint metadata', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.endpoints).toContain('/api/books');
  });
});

describe('GET /api/books', () => {
  it('returns all books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(3);
  });

  it('filters by genre', async () => {
    const res = await request(app).get('/api/books?genre=Fantasy');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data.every((b) => b.genre === 'Fantasy')).toBe(true);
  });

  it('filters by availability', async () => {
    const res = await request(app).get('/api/books?available=0');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].available).toBe(0);
  });

  it('searches by title', async () => {
    const res = await request(app).get('/api/books?q=Test');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
  });
});

describe('GET /api/books/genres', () => {
  it('returns unique genres', async () => {
    const res = await request(app).get('/api/books/genres');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toContain('Fantasy');
    expect(res.body.data).toContain('Thriller');
  });
});

describe('GET /api/books/:id', () => {
  it('returns a single book by id', async () => {
    const res = await request(app).get('/api/books/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(1);
    expect(res.body.data.title).toBe('Test Book One');
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).get('/api/books/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/books', () => {
  it('creates a new book', async () => {
    const newBook = {
      title: 'New Book',
      author: 'New Author',
      genre: 'Non-Fiction',
      year: 2023,
      isbn: '978-0-000-00099-9',
      description: 'A brand new book',
      available: 1
    };
    const res = await request(app).post('/api/books').send(newBook);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('New Book');
    expect(res.body.data.id).toBeDefined();
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/books').send({ title: 'Incomplete' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for duplicate ISBN', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({
        title: 'Duplicate ISBN',
        author: 'Someone',
        genre: 'Fiction',
        year: 2020,
        isbn: '978-0-000-00001-1'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/ISBN already exists/);
  });
});

describe('PUT /api/books/:id', () => {
  it('updates an existing book', async () => {
    const res = await request(app)
      .put('/api/books/1')
      .send({ title: 'Updated Title', available: 0 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Updated Title');
    expect(res.body.data.available).toBe(0);
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).put('/api/books/9999').send({ title: 'X' });
    expect(res.statusCode).toBe(404);
  });

  it('returns 400 when no fields are provided', async () => {
    const res = await request(app).put('/api/books/2').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('DELETE /api/books/:id', () => {
  it('deletes an existing book', async () => {
    const res = await request(app).delete('/api/books/3');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted/);
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).delete('/api/books/9999');
    expect(res.statusCode).toBe(404);
  });
});

describe('GET unknown route', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.statusCode).toBe(404);
  });
});
