/**
 * Seed script – populates the books table with 25 realistic records.
 * Run with: node db/seed.js
 */
const { getDb } = require('./database');

const books = [
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', year: 1937, isbn: '978-0-261-10221-7', description: 'A fantasy novel about the adventures of hobbit Bilbo Baggins.', available: 1 },
  { title: "Harry Potter and the Philosopher's Stone", author: 'J.K. Rowling', genre: 'Fantasy', year: 1997, isbn: '978-0-7475-3269-9', description: 'A young wizard discovers his magical heritage on his 11th birthday.', available: 1 },
  { title: '1984', author: 'George Orwell', genre: 'Dystopian', year: 1949, isbn: '978-0-452-28423-4', description: 'A chilling depiction of a totalitarian society where Big Brother watches all.', available: 1 },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic', year: 1960, isbn: '978-0-06-112008-4', description: 'A story of racial injustice and moral growth in the American South.', available: 1 },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', year: 1925, isbn: '978-0-7432-7356-5', description: 'A tale of wealth, love, and the American Dream in the Jazz Age.', available: 0 },
  { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', year: 1813, isbn: '978-0-14-143951-8', description: 'A witty story of love and social manners in Regency-era England.', available: 1 },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Classic', year: 1951, isbn: '978-0-316-76948-0', description: "A teenager's journey through disillusionment and alienation in New York City.", available: 1 },
  { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Dystopian', year: 1932, isbn: '978-0-06-085052-4', description: 'A vision of a future society controlled by technology and conditioning.', available: 0 },
  { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', year: 1954, isbn: '978-0-618-64015-7', description: 'An epic quest to destroy the One Ring and defeat the Dark Lord Sauron.', available: 1 },
  { title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', year: 1965, isbn: '978-0-441-17271-9', description: 'A sweeping science fiction saga set on the desert planet Arrakis.', available: 1 },
  { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', year: 1988, isbn: '978-0-06-231609-7', description: 'A philosophical story about following your dreams and personal legend.', available: 1 },
  { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', genre: 'Classic', year: 1866, isbn: '978-0-14-044913-6', description: 'A psychological portrait of a murderer and his path to redemption.', available: 1 },
  { title: 'The Da Vinci Code', author: 'Dan Brown', genre: 'Thriller', year: 2003, isbn: '978-0-385-50420-5', description: 'A symbologist uncovers a hidden religious mystery while investigating a murder.', available: 0 },
  { title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Non-Fiction', year: 2011, isbn: '978-0-06-231609-8', description: 'A brief history of humankind from the Stone Age to the present.', available: 1 },
  { title: 'The Hunger Games', author: 'Suzanne Collins', genre: 'Dystopian', year: 2008, isbn: '978-0-439-02348-1', description: 'A teenager fights for survival in a televised death competition.', available: 1 },
  { title: 'Norwegian Wood', author: 'Haruki Murakami', genre: 'Fiction', year: 1987, isbn: '978-0-375-70402-1', description: 'A nostalgic story of young love set in 1960s Tokyo.', available: 1 },
  { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', year: 2018, isbn: '978-0-7352-1129-2', description: 'Practical strategies for building good habits and breaking bad ones.', available: 1 },
  { title: 'The Martian', author: 'Andy Weir', genre: 'Science Fiction', year: 2011, isbn: '978-0-8041-3902-1', description: 'An astronaut stranded on Mars must survive using science and ingenuity.', available: 0 },
  { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Thriller', year: 2012, isbn: '978-0-307-58836-4', description: 'A psychological thriller about a marriage gone terrifyingly wrong.', available: 1 },
  { title: 'The Power of Now', author: 'Eckhart Tolle', genre: 'Self-Help', year: 1997, isbn: '978-1-57731-480-6', description: 'A guide to spiritual enlightenment through present-moment awareness.', available: 1 },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', genre: 'Dystopian', year: 1953, isbn: '978-0-345-34296-6', description: 'A fireman in a future America burns books in a society that outlaws reading.', available: 1 },
  { title: 'Educated', author: 'Tara Westover', genre: 'Memoir', year: 2018, isbn: '978-0-399-59050-4', description: 'A memoir about growing up in a survivalist family and the power of education.', available: 1 },
  { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', genre: 'Thriller', year: 2005, isbn: '978-0-307-47347-9', description: 'A journalist and a hacker investigate a decades-old disappearance.', available: 0 },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Non-Fiction', year: 2011, isbn: '978-0-374-27563-1', description: 'An exploration of the two systems that drive the way we think.', available: 1 },
  { title: 'The Secret History', author: 'Donna Tartt', genre: 'Fiction', year: 1992, isbn: '978-1-4000-3909-4', description: 'A group of classics students at a Vermont college commit a terrible crime.', available: 1 }
];

const db = getDb();

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

const insert = db.prepare(`
  INSERT OR IGNORE INTO books (title, author, genre, year, isbn, description, available)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const book of books) {
  insert.run(book.title, book.author, book.genre, book.year, book.isbn, book.description, book.available);
}

console.log(`Seeded ${books.length} books into the database.`);
