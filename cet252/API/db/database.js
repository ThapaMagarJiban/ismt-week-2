const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'books.db');
const LEGACY_DB_PATH = path.join(__dirname, 'library.db');

let db;

/**
 * Get or create the database connection.
 * @returns {DatabaseSync} SQLite database instance
 */
function getDb() {
  if (!db) {
    const resolvedPath = fs.existsSync(DB_PATH)
      ? DB_PATH
      : (fs.existsSync(LEGACY_DB_PATH) ? LEGACY_DB_PATH : DB_PATH);
    db = new DatabaseSync(resolvedPath);
    db.exec('PRAGMA journal_mode = WAL');
    db.exec('PRAGMA foreign_keys = ON');
  }
  return db;
}

/**
 * Initialise the database schema and seed data if the table is empty.
 */
function initDb() {
  const database = getDb();

  database.exec(`
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

  database.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  database.exec('CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);');

  const count = database.prepare('SELECT COUNT(*) as cnt FROM books').get();
  if (count.cnt === 0) {
    const seedFile = path.join(__dirname, 'seed.js');
    if (fs.existsSync(seedFile)) {
      require(seedFile);
    }
  }

  return database;
}

module.exports = { getDb, initDb };
