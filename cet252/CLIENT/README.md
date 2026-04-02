# Book Manager – Client Application

A lightweight vanilla JavaScript client that consumes the **Book Manager REST API**.

## Prerequisites

- Node.js 20+ and npm installed
- The **Book Manager API** must be running on `http://localhost:3000`
  (see `../API/README.md` for instructions)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server (optional)

```bash
npm start
```

This will serve the client at **http://localhost:8080**.

Open your browser and navigate to [http://localhost:8080](http://localhost:8080).

> You can also open the client directly from the API at **http://localhost:3000/** after starting `../API`.

---

## Features

| Feature | Description |
|---------|-------------|
| View all books | Browse books displayed in a responsive card grid |
| Search | Search by title or author using the search bar |
| Filter by genre | Dropdown to filter the book list by genre |
| Filter by availability | Show only available or unavailable books |
| Add a book | Click **+ Add Book** to open the form and create a new entry |
| View a book | Click **👁️ View** to read full book details (READ) |
| Edit a book | Click **✏️ Edit** on any card to update details |
| Delete a book | Click **🗑️ Delete** on any card; a confirmation dialog is shown |

---

## Running Tests

```bash
npm test
```

Tests are written with **Jest** and run in a jsdom environment to unit-test the client-side utility functions.

---

## Project Structure

```
CLIENT/
├── index.html      # Main HTML shell
├── styles.css      # Application styles
├── app.js          # All client-side JavaScript (fetch, render, events)
├── tests/          # Jest unit tests
│   └── app.test.js
├── package.json
└── README.md
```

---

## API Base URL

The client targets `http://localhost:3000/api` by default.
To change this, update the `API_BASE` constant at the top of `app.js`.
