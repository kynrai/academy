---
title: "Weekend Challenges"
---

These challenges extend the work of the week. Each one is self-contained — pick the order that interests you.

## Challenge 1 — Edit and Delete in Bibliotheca

Extend Bibliotheca with edit and delete support. The full set of routes for a complete CRUD app is:

| Method | Path | Purpose |
| ------ | ---- | ------- |
| `GET`  | `/books/{id}/edit` | Show a form pre-filled with the book's current values |
| `POST` | `/books/{id}` | Apply the edits, validate, redirect to the detail page on success |
| `POST` | `/books/{id}/delete` | Remove the book, redirect to `/books` |

Reuse the new-book template by extracting the form fields into a partial (`templates/_book_form.html`) and including it from both the new and edit templates with `{% include "_book_form.html" %}`.

For delete, use a small `<form method="post">` containing only a submit button — never a `<a href>` link. Deleting must be a POST so caches and crawlers can't trigger it.

## Challenge 2 — Pagination

`/books?q=` returns every match. Add pagination so the list shows up to 10 books per page:

- Accept a `page` query parameter (default `1`)
- Slice `data.books` based on `page` and the page size
- Render `Previous` and `Next` links at the bottom of the page that build URLs like `/books?page=2&q=programming`
- Hide the previous link on page 1 and the next link on the last page
- Keep the search query alive across page navigation

This exercises the pattern of using URLs as state — the user can bookmark `/books?q=programming&page=2` and come back to exactly that view.

## Challenge 3 — Template Engines in Other Languages

Pick one of the other three languages and rebuild the home, list, and detail pages of Bibliotheca from Day 4 in it:

- **Node.js + Express + EJS**: `npm install express ejs`, `app.set('view engine', 'ejs')`, `res.render('books', { books })`.
- **C# + ASP.NET Core + Razor Pages**: Razor is built into ASP.NET Core. Create `.cshtml` files and use the Razor view engine.
- **Go + `html/template`**: standard library. `template.Must(template.ParseFiles(...))` and `tmpl.Execute(w, data)`.

The data model and route structure are the same; what changes is how each language expresses templates and inheritance.

## Challenge 4 — A Single-Origin JSON API Inside Bibliotheca

Day 3's REST API and today's SSR app both serve language data; today they live in different projects. Add a JSON API alongside Bibliotheca so the same data is available two ways:

- `GET /api/books` returns all books as JSON
- `GET /api/books/{id}` returns one book as JSON, or `404`

Use the same `data` module — there should be one source of truth. The SSR pages and the JSON API consume it the same way.

Test with curl:

```sh
curl http://localhost:8000/api/books | head
curl http://localhost:8000/api/books/3
curl -i http://localhost:8000/api/books/999    # 404
```

This is the most common real-world architecture: an SSR site for humans, a JSON API for clients.

## Challenge 5 — greet CLI in All Four Languages

From Day 1, extend each `greet` tool to support a `--language` flag that changes the greeting language:

```sh
greet Alice --language es
# ¡Hola, Alice!

greet Alice --language fr
# Bonjour, Alice!
```

- Support at least English (default), Spanish, French, and German
- If an unsupported language code is given, print the available options and exit with status `1`
- Use each language's idiomatic argument parsing: `argparse` (Python), `node:util parseArgs` (Node.js), `args.Contains` or `System.CommandLine` (C#), and the `flag` package (Go)
- Both orders should work: `greet Alice --language es` and `greet --language es Alice`

## Reflection

1. Bibliotheca uses no client-side JavaScript and the user can do everything: browse, search, view, create. What does this say about how often a JS framework is genuinely required?
2. Day 4 noted that SSR ships finished HTML and CSR ships an empty shell + JS + JSON. For a public marketing site, which approach has better first-paint behaviour? What about for a Gmail-style inbox? Why?
3. Why does `<form method="post">` fit naturally with the redirect-after-POST pattern? What goes wrong if you return the new book's detail page directly from the POST instead of redirecting?
4. The data module is currently an in-memory list. If you replaced it with a database, which parts of the app would change? Which would not?
5. The `Add a book` link is a real `<a>` tag and the form is a real `<form>`. The browser already knows how to render and navigate them. What would you have to reimplement if you instead built this as a CSR app?
