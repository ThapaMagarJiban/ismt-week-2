# Low-Fidelity Wireframes (Initial Designs)

Assignment scope analyzed from the Book Manager project (CRUD + search/filter + API-backed UI).

## Screen A: Main Dashboard (Book List + Controls)

Includes:
- Header with app title/tagline
- Search row (input + Search + Clear)
- Filter row (Genre, Availability, Add Book CTA)
- Status/error area
- Book card grid with View/Edit/Delete actions
- Footer

```text
+---------------------------------------------------------------+
| Header: 📚 Book Manager                                       |
| Tagline: Manage your reading collection                       |
+---------------------------------------------------------------+
| [Search by title or author........] [Search] [Clear]          |
| Genre: [All Genres v]  Availability: [All v]   [+ Add Book]   |
+---------------------------------------------------------------+
| [Status Message Area: success/error/notice]                   |
+---------------------------------------------------------------+
| [Book Card]     [Book Card]     [Book Card]                   |
| [View Edit Del] [View Edit Del] [View Edit Del]               |
| [Book Card]     [Book Card]     [Book Card]                   |
| [View Edit Del] [View Edit Del] [View Edit Del]               |
+---------------------------------------------------------------+
| Footer                                                        |
+---------------------------------------------------------------+
```

## Screen B: Add/Edit Book Modal

Includes:
- Modal title changes by mode (Add New Book / Edit Book)
- Required fields: Title, Author, Genre, Year, ISBN
- Optional fields: Description, Available
- Actions: Save, Cancel, Close (X)

```text
             +----------------------------------+
             | X                                |
             | Modal Title: Add/Edit Book       |
             |----------------------------------|
             | Title*        [..............]   |
             | Author*       [..............]   |
             | Genre*        [..............]   |
             | Year*         [..............]   |
             | ISBN*         [..............]   |
             | Description   [..............]   |
             | Available     [Yes/No v]         |
             |----------------------------------|
             | [Save]                  [Cancel] |
             +----------------------------------+
```

## Screen C: View Book Details Modal (Read)

Includes:
- Same structure as Add/Edit for consistency
- Read-focused state (Save hidden/disabled)
- Close/Cancel only

```text
             +----------------------------------+
             | X                                |
             | Modal Title: Book Details        |
             |----------------------------------|
             | Title         [value]            |
             | Author        [value]            |
             | Genre         [value]            |
             | Year          [value]            |
             | ISBN          [value]            |
             | Description   [value]            |
             | Available     [value]            |
             |----------------------------------|
             |                         [Close]  |
             +----------------------------------+
```

## Screen D: Delete Confirmation Modal

Includes:
- Focused confirmation message with selected book title
- Destructive action emphasis
- Secondary cancel action

```text
            +-----------------------------------+
            | Confirm Delete                    |
            |-----------------------------------|
            | Are you sure you want to delete   |
            | "Book Title"?                     |
            |-----------------------------------|
            | [Delete]                [Cancel]  |
            +-----------------------------------+
```

## Screen E: Empty / Loading / Error / Validation States

- Loading list: `Loading books…`
- Empty list: `No books found.`
- API error fallback: `Could not load books. Is API running?`
- Form validation: highlight required fields and prompt completion

## Navigation & Flow (Low-Fi UX Flow)

1. Main list → **Add Book** → Save → list refresh + success status  
2. Main list → **Edit** → Save → card updated + success status  
3. Main list → **View** → Close → return to list  
4. Main list → **Delete** → Confirm → card removed + success status  
5. Search/filter change → list reload with current criteria  

## Priority for Initial Prototype

- **P1:** Main dashboard + card actions  
- **P2:** Add/Edit modal + validation  
- **P3:** View modal + delete confirmation  
- **P4:** Empty/loading/error state polish  

