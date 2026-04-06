/**
 * Client-side utility function tests.
 * These tests run in a jsdom environment and validate helper logic
 * extracted from app.js without needing a live server.
 */

// ===================== Helpers under test =====================
// Replicated here because app.js is browser-targeted (no exports).

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} str - Raw string
 * @returns {string} HTML-escaped string
 */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Builds a query-string from a params object, omitting empty values.
 * @param {object} params
 * @returns {string}
 */
function buildQueryString(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) search.set(k, v);
  });
  return search.toString();
}

/**
 * Determines the CSS class for the availability badge.
 * @param {number} available - 1 or 0
 * @returns {string}
 */
function availBadgeClass(available) {
  return available ? 'badge-available' : 'badge-unavailable';
}

/**
 * Determines the label for the availability badge.
 * @param {number} available - 1 or 0
 * @returns {string}
 */
function availBadgeLabel(available) {
  return available ? '✅ Available' : '❌ Not Available';
}

const BOOK_COVER_FALLBACK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="104" viewBox="0 0 72 104"><rect width="72" height="104" rx="8" fill="#f0f4f8"/><rect x="8" y="12" width="56" height="80" rx="4" fill="#e2e8f0"/><text x="36" y="56" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="#4a5568">No Cover</text></svg>';
const BOOK_COVER_FALLBACK = `data:image/svg+xml,${encodeURIComponent(BOOK_COVER_FALLBACK_SVG)}`;

function normalizeIsbn(isbn) {
  return String(isbn || '').replace(/[^0-9Xx]/g, '').toUpperCase();
}

function bookCoverUrl(book) {
  const isbn = normalizeIsbn(book?.isbn);
  if (!isbn) return BOOK_COVER_FALLBACK;
  return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-M.jpg?default=false`;
}

// ===================== Tests =====================

describe('escHtml', () => {
  it('escapes angle brackets', () => {
    expect(escHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes ampersands', () => {
    expect(escHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('escapes double quotes', () => {
    expect(escHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('returns the string unchanged when no special characters', () => {
    expect(escHtml('The Hobbit')).toBe('The Hobbit');
  });

  it('coerces non-string input to string', () => {
    expect(escHtml(42)).toBe('42');
  });
});

describe('buildQueryString', () => {
  it('builds a query string from non-empty values', () => {
    const qs = buildQueryString({ q: 'tolkien', genre: 'Fantasy' });
    expect(qs).toContain('q=tolkien');
    expect(qs).toContain('genre=Fantasy');
  });

  it('omits empty string values', () => {
    const qs = buildQueryString({ q: '', genre: 'Fantasy' });
    expect(qs).not.toContain('q=');
    expect(qs).toContain('genre=Fantasy');
  });

  it('omits null and undefined values', () => {
    const qs = buildQueryString({ q: null, genre: undefined, available: '1' });
    expect(qs).toBe('available=1');
  });

  it('returns empty string when all values are empty', () => {
    const qs = buildQueryString({ q: '', genre: '' });
    expect(qs).toBe('');
  });
});

describe('availBadgeClass', () => {
  it('returns badge-available for 1', () => {
    expect(availBadgeClass(1)).toBe('badge-available');
  });

  it('returns badge-unavailable for 0', () => {
    expect(availBadgeClass(0)).toBe('badge-unavailable');
  });
});

describe('availBadgeLabel', () => {
  it('returns available label for truthy value', () => {
    expect(availBadgeLabel(1)).toMatch(/Available/);
  });

  it('returns not available label for falsy value', () => {
    expect(availBadgeLabel(0)).toMatch(/Not Available/);
  });
});

describe('normalizeIsbn', () => {
  it('removes non isbn chars and uppercases X', () => {
    expect(normalizeIsbn('978-0-261-10221-7')).toBe('9780261102217');
    expect(normalizeIsbn('0-8041-3902-x')).toBe('080413902X');
  });

  it('returns empty string for empty input', () => {
    expect(normalizeIsbn('')).toBe('');
    expect(normalizeIsbn(null)).toBe('');
  });
});

describe('bookCoverUrl', () => {
  it('returns OpenLibrary URL when isbn exists', () => {
    expect(bookCoverUrl({ isbn: '978-0-261-10221-7' })).toBe(
      'https://covers.openlibrary.org/b/isbn/9780261102217-M.jpg?default=false'
    );
  });

  it('returns local fallback data-url when isbn is missing', () => {
    expect(bookCoverUrl({ isbn: '' })).toBe(BOOK_COVER_FALLBACK);
  });
});
