const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./db/database');
const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve generated API documentation
app.use('/docs', express.static(path.join(__dirname, '../APIDOC')));

// Initialise database
initDb();

// Routes
app.use('/api/books', booksRouter);

/**
 * @api {get} / API health check
 * @apiName HealthCheck
 * @apiGroup General
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Boolean} success Status flag
 * @apiSuccess {String} message Welcome message
 * @apiSuccess {String} version API version
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Book Manager API is running',
    version: '1.0.0',
    docs: '/docs',
    client: 'Run CLIENT separately (e.g., http://localhost:8080)'
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Book Manager API endpoints',
    endpoints: [
      '/api/books',
      '/api/books/genres',
      '/api/books/:id'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Only start the server when not running under Jest
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Book Manager API running on http://localhost:${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/docs`);
  });
}

module.exports = app;
