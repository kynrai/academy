---
title: "Day 4 – Server-Side Rendering: Foundations and the Bibliotheca Project"
---

## Today's Focus

Build the foundations of a multi-page server-rendered web app. Start by reviewing how Server-Side Rendering (SSR) and Client-Side Rendering (CSR) differ in the HTTP traffic each one produces. Then begin **Bibliotheca** — a book catalog you will continue and complete tomorrow.

The project deliberately uses no client-side framework. Every page is built on the server and shipped as complete HTML. The browser parses it, the user clicks links and submits forms, and the server responds with another complete page.

## SSR and CSR Through HTTP

In Day 2 you learned that every HTTP exchange is a request and a response, and that the response body can be HTML, JSON, or anything else — the `Content-Type` header tells the browser what to do with it. The choice between SSR and CSR is really a choice about what bytes the server ships and what the browser does next. Both can produce the same _visible_ result; what differs is the protocol traffic.

### Server-Side Rendering — one round trip, finished HTML

```text
Browser  →  GET /books/42                                    →  Server
Browser  ←  200 OK   Content-Type: text/html
            <html>...the entire page with data...</html>    ←  Server

Browser parses, lays out, paints. Done.
```

The server queries its data, picks a template, fills it with the data, and sends a complete HTML page. The response body contains everything the user will see. **One HTTP request, one HTTP response, one rendered page.**

### Client-Side Rendering — multiple round trips, JavaScript builds the page

```text
Browser  →  GET /books/42                                    →  Server
Browser  ←  200 OK   Content-Type: text/html
            <html><body><div id="root"></div>
            <script src="/app.js"></script></body></html>   ←  Server

Browser  →  GET /app.js                                      →  Server
Browser  ←  200 OK   Content-Type: application/javascript
            ...JavaScript bundle...                         ←  Server

Browser runs the JavaScript.

Script   →  GET /api/books/42                                →  Server
Script   ←  200 OK   Content-Type: application/json
            {"id": 42, "title": "...", ...}                ←  Server

JavaScript reads the JSON, builds HTML, inserts it into <div id="root">.
User finally sees the page.
```

The server returns an HTML shell with no real content. The browser downloads and runs a JavaScript bundle. The JavaScript makes a second HTTP request to a JSON API, receives JSON, and constructs the visible HTML in the browser. **Three or more HTTP requests, the page is empty until JavaScript has run.**

### Compare the network tab

| | SSR | CSR |
| - | --- | --- |
| HTTP requests for first paint | 1 | 2+ (HTML + JS, then API) |
| Bytes the browser receives | HTML with content | HTML shell + JS bundle + JSON |
| What the server returns | `text/html` | `text/html` (shell) and `application/json` |
| What "View Page Source" shows | The full content | An empty `<div>` |
| Renders without JavaScript | Yes | No |

### When SSR is the right choice

- **Public content that must be discoverable.** Search engines and social-media link previews see what the server returns directly. With SSR they see the real content; with CSR they see an empty shell.
- **First paint matters.** A logged-out homepage, a marketing page, an article — the user wants to read text, not wait for a JavaScript bundle to download and execute.
- **Forms-driven interaction.** Clicking links and submitting forms — what most web apps actually do — works perfectly with SSR and requires no JavaScript at all.
- **Avoiding the JS toolchain.** SSR apps have one language on the server, plain HTML in the browser, and no build step.

CSR has its place — highly interactive UIs, real-time apps, and cases where the same data is consumed by mobile and web clients — but the default for a content-driven site or app is SSR. That is what you will build today and tomorrow.

## Introducing Bibliotheca

Bibliotheca is a small book catalog. By the end of Day 5 it will have:

- A home page with featured books
- A book list with search via the URL (`/books?q=programming`)
- A detail page for each book (`/books/3`)
- A form to add a new book
- Server-side validation that re-renders the form with errors
- A consistent layout and stylesheet across every page

Today's goal: get the home, list, and detail pages working with templates and styles. Tomorrow's goal: add forms and validation.

## Setting Up

Use Python with FastAPI and Jinja2 templates. Other languages and frameworks could build the same thing (Node + Express + EJS, C# + ASP.NET Core Razor Pages, Go + `html/template`) — we picked one stack to focus on the SSR pattern, not the framework.

```sh
mkdir ~/projects/bibliotheca && cd ~/projects/bibliotheca
uv init
uv add fastapi uvicorn jinja2 python-multipart
```

`python-multipart` is what FastAPI uses to parse form data on Day 5.

Create the project structure:

```text
bibliotheca/
├── main.py
├── data.py
├── templates/
│   ├── layout.html
│   ├── home.html
│   ├── books.html
│   └── book.html
└── static/
    └── styles.css
```

## Seed Data

`data.py`:

```python
books = [
    {"id": 1, "title": "The Pragmatic Programmer", "author": "Andrew Hunt and David Thomas",
     "year": 1999, "genre": "Computing",
     "summary": "Practical advice for software developers — pragmatism, refactoring, automation, and the broken windows theory of code."},
    {"id": 2, "title": "Structure and Interpretation of Computer Programs", "author": "Hal Abelson and Gerald Jay Sussman",
     "year": 1985, "genre": "Computing",
     "summary": "Foundational text on programming using Scheme — abstraction, recursion, and the building blocks of computation."},
    {"id": 3, "title": "The Mythical Man-Month", "author": "Frederick P. Brooks",
     "year": 1975, "genre": "Computing",
     "summary": "Brooks's law and the human side of software engineering — adding manpower to a late project makes it later."},
    {"id": 4, "title": "Designing Data-Intensive Applications", "author": "Martin Kleppmann",
     "year": 2017, "genre": "Computing",
     "summary": "Modern data systems — relational, document, key-value stores, message brokers, and distributed consensus."},
    {"id": 5, "title": "Refactoring", "author": "Martin Fowler",
     "year": 1999, "genre": "Computing",
     "summary": "A catalog of refactorings — small, behaviour-preserving transformations that improve internal structure."},
    {"id": 6, "title": "Operating Systems: Three Easy Pieces", "author": "Remzi Arpaci-Dusseau and Andrea Arpaci-Dusseau",
     "year": 2018, "genre": "Computing",
     "summary": "Operating systems through three lenses: virtualization, concurrency, and persistence."},
]


def find_book(book_id: int):
    return next((b for b in books if b["id"] == book_id), None)


def search_books(query: str):
    q = query.lower()
    return [
        b for b in books
        if q in b["title"].lower()
        or q in b["author"].lower()
        or q in b["genre"].lower()
    ]
```

## The Application

`main.py`:

```python
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

import data

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    featured = data.books[:3]
    return templates.TemplateResponse(
        "home.html",
        {"request": request, "featured": featured},
    )


@app.get("/books", response_class=HTMLResponse)
def list_books(request: Request, q: str = ""):
    results = data.search_books(q) if q else data.books
    return templates.TemplateResponse(
        "books.html",
        {"request": request, "books": results, "q": q},
    )


@app.get("/books/{book_id}", response_class=HTMLResponse)
def book_detail(request: Request, book_id: int):
    book = data.find_book(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return templates.TemplateResponse(
        "book.html",
        {"request": request, "book": book},
    )
```

Three routes, each returning a complete HTML page built from a template.

## Templates

Jinja2 supports template inheritance — define a base layout once and have other pages extend it.

`templates/layout.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{% block title %}Bibliotheca{% endblock %}</title>
  <link rel="stylesheet" href="/static/styles.css">
</head>
<body>
  <header class="site-header">
    <a href="/" class="logo">Bibliotheca</a>
    <nav>
      <a href="/books">Browse</a>
    </nav>
  </header>
  <main>
    {% block content %}{% endblock %}
  </main>
  <footer class="site-footer">
    <p>Server-rendered. No JavaScript required.</p>
  </footer>
</body>
</html>
```

`templates/home.html`:

```html
{% extends "layout.html" %}

{% block content %}
<h1>Featured Books</h1>
<p>A small catalog of computing classics.</p>

<div class="book-grid">
  {% for book in featured %}
    <article class="book-card">
      <h2><a href="/books/{{ book.id }}">{{ book.title }}</a></h2>
      <p class="author">by {{ book.author }}</p>
      <p class="year">{{ book.year }}</p>
    </article>
  {% endfor %}
</div>

<p><a class="button" href="/books">Browse all books →</a></p>
{% endblock %}
```

`templates/books.html`:

```html
{% extends "layout.html" %}

{% block title %}Books – Bibliotheca{% endblock %}

{% block content %}
<h1>Books</h1>

<form action="/books" method="get" class="search-form">
  <input type="search" name="q" value="{{ q }}" placeholder="Search by title, author, or genre">
  <button type="submit">Search</button>
</form>

{% if q %}
  <p>Showing {{ books|length }} result(s) for "{{ q }}"
     — <a href="/books">clear</a></p>
{% else %}
  <p>{{ books|length }} books in the catalog.</p>
{% endif %}

<ul class="book-list">
  {% for book in books %}
    <li>
      <a href="/books/{{ book.id }}"><strong>{{ book.title }}</strong></a>
      <span class="author">by {{ book.author }}</span>
      <span class="year">({{ book.year }})</span>
    </li>
  {% else %}
    <li class="empty">No matches.</li>
  {% endfor %}
</ul>
{% endblock %}
```

`templates/book.html`:

```html
{% extends "layout.html" %}

{% block title %}{{ book.title }} – Bibliotheca{% endblock %}

{% block content %}
<article class="book-detail">
  <h1>{{ book.title }}</h1>
  <p class="author">by {{ book.author }}</p>
  <p class="meta">{{ book.year }} · {{ book.genre }}</p>
  <p class="summary">{{ book.summary }}</p>
  <p><a href="/books">← Back to all books</a></p>
</article>
{% endblock %}
```

Notice that the search form on the books page uses `method="get"` — submitting it builds a URL like `/books?q=pragmatic` and the browser navigates to it. The server reads the `q` query parameter and re-renders the page. **No JavaScript involved.** This is the behaviour of `<form>` elements that has been there since 1993.

## Styles

`static/styles.css`:

```css
:root {
  --fg: #1a1a1a;
  --bg: #fafaf7;
  --muted: #6b6b6b;
  --accent: #5b3a29;
  --border: #e0d8cc;
}

* { box-sizing: border-box; }

body {
  font-family: Georgia, serif;
  color: var(--fg);
  background: var(--bg);
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
  line-height: 1.5;
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: var(--accent);
}

nav a {
  color: var(--fg);
  text-decoration: none;
  margin-left: 1rem;
}

nav a:hover { color: var(--accent); }

main { min-height: 60vh; }

h1 { color: var(--accent); }

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.book-card {
  border: 1px solid var(--border);
  padding: 1rem;
  border-radius: 4px;
}

.book-card h2 {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
}

.book-card a, .book-list a strong {
  color: var(--fg);
  text-decoration: none;
  border-bottom: 1px solid var(--accent);
}

.book-card a:hover, .book-list a:hover strong {
  color: var(--accent);
}

.author, .meta, .year {
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0.2rem 0;
}

.search-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-form input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font: inherit;
}

.search-form button, .button {
  padding: 0.5rem 1rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  font: inherit;
}

.book-list {
  list-style: none;
  padding: 0;
}

.book-list li {
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border);
}

.book-list li.empty {
  color: var(--muted);
  font-style: italic;
}

.book-detail .summary {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.site-footer {
  margin-top: 4rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 0.9rem;
  text-align: center;
}
```

## Run It

```sh
uv run uvicorn main:app --port 8000 --reload
```

Visit `http://localhost:8000/`, then click through to `/books`, search, and click into a detail page.

## Inspect the Traffic

Open DevTools → **Network** tab and reload the home page. You should see exactly two HTTP requests:

- `GET /` returning `text/html`
- `GET /static/styles.css` returning `text/css`

That's it. Two requests for a fully rendered page — one for the HTML, one for the stylesheet. No JSON API calls, no JavaScript bundle.

Use **View Page Source** (`Cmd+U` / `Ctrl+U`) on the home page. The featured books are visible in the source as actual `<article>` elements. The search form on `/books` is a real `<form>` with `method="get"`. None of this content was constructed by JavaScript — it was assembled in Python and shipped as bytes.

## Tasks

- Create the project, install dependencies, build the four templates and the stylesheet, and run the server.
- Visit `/`, `/books`, `/books?q=pragmatic`, and `/books/3`. Confirm each page renders correctly.
- Use **View Page Source** on each page. Confirm the actual content is in the source.
- Disable JavaScript in DevTools (Settings → Debugger → Disable JavaScript). Reload every page. Use the search form. Click links. Everything still works — because nothing was relying on JavaScript.
- Open DevTools → **Network**. For each page, count the number of HTTP requests. Compare this to a typical CSR app you have used recently.
- Trigger a `404` by visiting `/books/999`. Confirm the error response.
- **Stretch:** add a fourth route, `GET /genres/{genre}`, that lists books in a single genre. Add a link to it from the detail page (`<p>More <a href="/genres/{{ book.genre }}">{{ book.genre }}</a> books</p>`).

## Reading / Reference

- [Jinja2 template designer documentation](https://jinja.palletsprojects.com/en/stable/templates/)
- [FastAPI templates guide](https://fastapi.tiangolo.com/advanced/templates/)
- MDN: [The HTML form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- web.dev: [Rendering on the Web](https://web.dev/articles/rendering-on-the-web)
