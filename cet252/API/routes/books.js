const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

/**
 * @api {get} /api/books Get all books
 * @apiName GetBooks
 * @apiGroup Books
 * @apiVersion 1.0.0
 *
 * @apiQuery {String} [genre] Filter by genre (case-insensitive)
 * @apiQuery {String} [author] Filter by author name (partial match)
 * @apiQuery {String} [q] Search by title or author (partial match)
 * @apiQuery {Number} [available] Filter by availability (1 = available, 0 = not available)
 *
 * @apiSuccess {Boolean} success Request status
 * @apiSuccess {Number} count Total number of results
 * @apiSuccess {Object[]} data Array of book objects
 * @apiSuccess {Number} data.id Unique book ID
 * @apiSuccess {String} data.title Book title
 * @apiSuccess {String} data.author Book author
 * @apiSuccess {String} data.genre Book genre
 * @apiSuccess {Number} data.year Publication year
 * @apiSuccess {String} data.isbn ISBN number
 * @apiSuccess {String} data.description Book description
 * @apiSuccess {Number} data.available Availability flag (1/0)
 * @apiSuccess {String} data.created_at Record creation timestamp
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "success": true,
 *     "count": 25,
 *     "data": [
 *       {
 *         "id": 1,
 *         "title": "The Hobbit",
 *         "author": "J.R.R. Tolkien",
 *         "genre": "Fantasy",
 *         "year": 1937,
 *         "isbn": "978-0-261-10221-7",
 *         "description": "A fantasy novel about the adventures of hobbit Bilbo Baggins.",
 *         "available": 1,
 *         "created_at": "2024-01-01 00:00:00"
 *       }
 *     ]
 *   }
 */
router.get('/', (req, res) => {
  const db = getDb();
  const { genre, author, q, available } = req.query;

  let sql = 'SELECT * FROM books WHERE 1=1';
  const params = [];

  if (genre) {
    sql += ' AND LOWER(genre) = LOWER(?)';
    params.push(genre);
  }
  if (author) {
    sql += ' AND LOWER(author) LIKE LOWER(?)';
    params.push(`%${author}%`);
  }
  if (q) {
    sql += ' AND (LOWER(title) LIKE LOWER(?) OR LOWER(author) LIKE LOWER(?))';
    params.push(`%${q}%`, `%${q}%`);
  }
  if (available !== undefined) {
    sql += ' AND available = ?';
    params.push(Number(available));
  }

  sql += ' ORDER BY title ASC';

  const books = db.prepare(sql).all(...params);
  res.json({ success: true, count: books.length, data: books });
});

/**
 * @api {get} /api/books/genres Get all genres
 * @apiName GetGenres
 * @apiGroup Books
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Boolean} success Request status
 * @apiSuccess {String[]} data Array of unique genre strings
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   { "success": true, "data": ["Classic", "Dystopian", "Fantasy"] }
 */
router.get('/genres', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT DISTINCT genre FROM books ORDER BY genre ASC').all();
  res.json({ success: true, data: rows.map((r) => r.genre) });
});

/**
 * @api {get} /api/books/:id Get a single book
 * @apiName GetBook
 * @apiGroup Books
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id Book unique ID
 *
 * @apiSuccess {Boolean} success Request status
 * @apiSuccess {Object} data Book object
 *
 * @apiError (404) BookNotFound The book with the given ID was not found
 * @apiErrorExample {json} 404 Error:
 *   HTTP/1.1 404 Not Found
 *   { "success": false, "message": "Book not found" }
 */
router.get('/:id', (req, res) => {
  const db = getDb();
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }
  res.json({ success: true, data: book });
});

/**
 * @api {post} /api/books Create a new book
 * @apiName CreateBook
 * @apiGroup Books
 * @apiVersion 1.0.0
 *
 * @apiBody {String} title Book title (required)
 * @apiBody {String} author Book author (required)
 * @apiBody {String} genre Book genre (required)
 * @apiBody {Number} year Publication year (required)
 * @apiBody {String} isbn ISBN number (required, must be unique)
 * @apiBody {String} [description] Book description
 * @apiBody {Number} [available=1] Availability (1 = available, 0 = not available)
 *
 * @apiSuccess (201) {Boolean} success Request status
 * @apiSuccess (201) {Object} data Created book object
 *
 * @apiError (400) ValidationError Required fields missing or ISBN already exists
 * @apiErrorExample {json} 400 Error:
 *   HTTP/1.1 400 Bad Request
 *   { "success": false, "message": "title, author, genre, year and isbn are required" }
 */
router.post('/', (req, res) => {
  const db = getDb();
  const { title, author, genre, year, isbn, description, available } = req.body;

  if (!title || !author || !genre || !year || !isbn) {
    return res.status(400).json({
      success: false,
      message: 'title, author, genre, year and isbn are required'
    });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO books (title, author, genre, year, isbn, description, available)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      title,
      author,
      genre,
      Number(year),
      isbn,
      description || null,
      available !== undefined ? Number(available) : 1
    );
    const newBook = db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newBook });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ success: false, message: 'ISBN already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

/**
 * @api {put} /api/books/:id Update a book
 * @apiName UpdateBook
 * @apiGroup Books
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id Book unique ID
 *
 * @apiBody {String} [title] Book title
 * @apiBody {String} [author] Book author
 * @apiBody {String} [genre] Book genre
 * @apiBody {Number} [year] Publication year
 * @apiBody {String} [isbn] ISBN number
 * @apiBody {String} [description] Book description
 * @apiBody {Number} [available] Availability (1/0)
 *
 * @apiSuccess {Boolean} success Request status
 * @apiSuccess {Object} data Updated book object
 *
 * @apiError (404) BookNotFound The book with the given ID was not found
 * @apiError (400) ValidationError No valid fields to update or ISBN conflict
 */
router.put('/:id', (req, res) => {
  const db = getDb();
  const { title, author, genre, year, isbn, description, available } = req.body;

  const existing = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }

  const fields = [];
  const values = [];

  if (title !== undefined) { fields.push('title = ?'); values.push(title); }
  if (author !== undefined) { fields.push('author = ?'); values.push(author); }
  if (genre !== undefined) { fields.push('genre = ?'); values.push(genre); }
  if (year !== undefined) { fields.push('year = ?'); values.push(Number(year)); }
  if (isbn !== undefined) { fields.push('isbn = ?'); values.push(isbn); }
  if (description !== undefined) { fields.push('description = ?'); values.push(description); }
  if (available !== undefined) { fields.push('available = ?'); values.push(Number(available)); }

  if (fields.length === 0) {
    return res.status(400).json({ success: false, message: 'No valid fields to update' });
  }

  try {
    values.push(req.params.id);
    db.prepare(`UPDATE books SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    const updated = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ success: false, message: 'ISBN already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

/**
 * @api {delete} /api/books/:id Delete a book
 * @apiName DeleteBook
 * @apiGroup Books
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id Book unique ID
 *
 * @apiSuccess {Boolean} success Request status
 * @apiSuccess {String} message Confirmation message
 *
 * @apiError (404) BookNotFound The book with the given ID was not found
 */
router.delete('/:id', (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }
  db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: `Book with id ${req.params.id} deleted successfully` });
});

module.exports = router;
