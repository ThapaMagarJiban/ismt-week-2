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
