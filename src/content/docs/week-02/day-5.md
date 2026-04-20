---
title: "Day 5 – Forms, Validation, and Completing Bibliotheca"
---

## Today's Focus

Continue the Bibliotheca project. Add a form to create new books, handle the form submission on the server, validate the input, and use the redirect-after-POST pattern to avoid duplicate submissions on refresh. Everything continues to work without JavaScript.

By the end of today the catalog supports adding new books through a real HTML form — the same way every server-rendered web app has worked for thirty years.

## How HTML Forms Work

You used a search form on Day 4 with `method="get"`. Here is the full picture.

A form has two attributes that determine what HTTP request the browser sends when the user submits it:

```html
<form action="/books" method="post">
  ...inputs...
  <button type="submit">Save</button>
</form>
```

| Attribute | Purpose |
| --------- | ------- |
| `action` | The URL the browser sends the request to. Defaults to the current page if omitted. |
| `method` | The HTTP method. Either `get` or `post` for native HTML forms. |

When the user clicks **Save**, the browser:

1. Reads every `name="..."` field inside the form.
2. Builds an HTTP request to the `action` URL using the chosen `method`.
3. Replaces the current page with the server's response.

### GET forms put the data in the URL

`<form method="get">` builds a URL with the form data as query parameters and navigates to it. The search form on Day 4 worked this way — submitting it sent `GET /books?q=pragmatic`. GET forms are appropriate for read-only operations where the URL is meaningful (search, filter, pagination) — the user can bookmark or share the resulting URL.

### POST forms put the data in the request body

`<form method="post">` sends the form data as the request body, with `Content-Type: application/x-www-form-urlencoded`:

```text
POST /books HTTP/1.1
Host: localhost:8000
Content-Type: application/x-www-form-urlencoded
Content-Length: 73

title=Refactoring&author=Martin+Fowler&year=1999&genre=Computing
```

The body is URL-encoded: spaces become `+`, special characters become `%XX`. Every input with a `name` attribute contributes one `key=value` pair. Inputs without `name` are not submitted.

POST is appropriate for operations that change server state (creating, updating, deleting).

### Why POST and not GET for changes

GET requests are supposed to be **safe** (no side effects) and **idempotent** (repeating them does the same thing). Browsers, search engines, and link-preview crawlers assume this and may prefetch GET URLs in the background. If your "delete book" link were a GET, a tool fetching link previews could trigger a deletion. POST signals a state change — caches and crawlers do not follow POST URLs.

## Adding the New Book Form

You need two new routes:

- `GET /books/new` — show the form
- `POST /books` — handle the submission

Update the imports at the top of `main.py`:

```python
from fastapi import FastAPI, Request, HTTPException, Form
from fastapi.responses import HTMLResponse, RedirectResponse
```

Add the two routes and a small validation helper:

```python
@app.get("/books/new", response_class=HTMLResponse)
def new_book_form(request: Request):
    return templates.TemplateResponse(
        "new_book.html",
        {"request": request, "errors": {}, "values": {}},
    )


@app.post("/books")
def create_book(
    request: Request,
    title: str = Form(""),
    author: str = Form(""),
    year: str = Form(""),
    genre: str = Form(""),
    summary: str = Form(""),
):
    values = {"title": title, "author": author, "year": year, "genre": genre, "summary": summary}
    errors = validate(values)

    if errors:
        return templates.TemplateResponse(
            "new_book.html",
            {"request": request, "errors": errors, "values": values},
            status_code=400,
        )

    new_id = max(b["id"] for b in data.books) + 1
    data.books.append({
        "id": new_id,
        "title": title.strip(),
        "author": author.strip(),
        "year": int(year),
        "genre": genre.strip(),
        "summary": summary.strip(),
    })

    return RedirectResponse(url=f"/books/{new_id}", status_code=303)


def validate(values):
    errors = {}
    if not values["title"].strip():
        errors["title"] = "Title is required."
    if not values["author"].strip():
        errors["author"] = "Author is required."
    if not values["year"].strip():
        errors["year"] = "Year is required."
    else:
        try:
            y = int(values["year"])
            if y < 0 or y > 2100:
                errors["year"] = "Year must be between 0 and 2100."
        except ValueError:
            errors["year"] = "Year must be a whole number."
    if not values["genre"].strip():
        errors["genre"] = "Genre is required."
    return errors
```

The `Form()` declarations tell FastAPI to read each value from the form-encoded request body. `python-multipart` (installed yesterday) makes that possible.

## The Form Template

`templates/new_book.html`:

```html
{% extends "layout.html" %}

{% block title %}Add a Book – Bibliotheca{% endblock %}

{% block content %}
<h1>Add a Book</h1>

{% if errors %}
  <p class="form-error-summary">Please correct the errors below.</p>
{% endif %}

<form action="/books" method="post" class="book-form">
  <p>
    <label for="title">Title</label>
    <input id="title" name="title" type="text" value="{{ values.title }}" autofocus>
    {% if errors.title %}<span class="error">{{ errors.title }}</span>{% endif %}
  </p>
  <p>
    <label for="author">Author</label>
    <input id="author" name="author" type="text" value="{{ values.author }}">
    {% if errors.author %}<span class="error">{{ errors.author }}</span>{% endif %}
  </p>
  <p>
    <label for="year">Year</label>
    <input id="year" name="year" type="text" value="{{ values.year }}">
    {% if errors.year %}<span class="error">{{ errors.year }}</span>{% endif %}
  </p>
  <p>
    <label for="genre">Genre</label>
    <input id="genre" name="genre" type="text" value="{{ values.genre }}">
    {% if errors.genre %}<span class="error">{{ errors.genre }}</span>{% endif %}
  </p>
  <p>
    <label for="summary">Summary</label>
    <textarea id="summary" name="summary" rows="4">{{ values.summary }}</textarea>
  </p>
  <p>
    <button type="submit">Save</button>
    <a href="/books">Cancel</a>
  </p>
</form>
{% endblock %}
```

Each input has a `name` attribute (the form data key) and a `value` set from the `values` dict so the form re-displays the user's input when validation fails. Each potential error is rendered next to the field it applies to.

Add a link from the books list to the form. At the top of `templates/books.html`, just before the search form, insert:

```html
<div class="page-actions">
  <a class="button" href="/books/new">+ Add a book</a>
</div>
```

And a few extra styles in `static/styles.css`:

```css
.book-form label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.book-form input,
.book-form textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font: inherit;
}

.book-form .error {
  display: block;
  color: #b91c1c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-error-summary {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 0.6rem 0.8rem;
  border-radius: 4px;
}

.page-actions {
  margin-bottom: 1rem;
}
```

## Redirect-After-POST

After successfully creating a book, the server returns:

```python
return RedirectResponse(url=f"/books/{new_id}", status_code=303)
```

`303 See Other` tells the browser: "the result of your POST is at this other URL — go there with a GET". The user's address bar updates, and refreshing the page does **not** resubmit the form. This is the **Post/Redirect/Get** pattern (PRG). Without it, hitting refresh after a POST would either ask the user "are you sure you want to resubmit?" or silently submit the form again, creating duplicate records.

## Inspect the Traffic

Run the server and open DevTools → **Network**. Visit `/books/new`, fill in valid data, and submit.

You should see two HTTP requests:

1. `POST /books` returning `303 See Other` with a `Location: /books/7` header
2. `GET /books/7` returning the new book's detail page

The browser handled the redirect automatically. Click the POST request and look at the **Payload** tab — you can see the form-encoded body that was sent.

Now submit the form with an invalid year. The response is `400 Bad Request` and the same form is re-rendered with the user's input preserved and an error message next to the bad field. **No JavaScript ran.** The validation, the re-rendering, and the error display all happened on the server.

## Tasks

- Add the `GET /books/new` and `POST /books` routes, the `new_book.html` template, and the form styles. Add the **Add a book** link on the books list page.
- Submit the form with valid data. Confirm:
  - The browser ends up on the new book's detail page
  - Refreshing that detail page does **not** re-submit the form
  - The new book appears on `/books` and is searchable
- Submit with empty fields. Confirm the form re-renders with errors next to the empty fields and the input you did fill in is preserved.
- Submit with `year=99999` and `year=abc`. Confirm both validations trigger.
- Disable JavaScript and repeat every interaction above. Everything still works.
- Open DevTools → **Network**. Submit a valid form and watch the two-request sequence: `POST /books` → `303` with `Location` header → `GET /books/{id}`.
- **Stretch:** add a `POST /books/{book_id}/delete` route that removes a book and redirects to `/books`. Add a delete button at the bottom of the detail page — a tiny `<form action="/books/{{ book.id }}/delete" method="post">` with a single submit button. Use a separate confirmation page if you want to avoid accidental deletions, rather than a JavaScript confirm dialog.

## Reflection

- The home page, list, search, detail page, and form all work without a single line of client-side JavaScript. What does this tell you about how complex web apps actually need to be?
- The same JSON API from Day 3 could have powered a CSR version of this site. What would the user-visible differences be? What would the network tab look like for a single page? What would happen on first paint?
- POST + redirect + GET is more HTTP traffic than a single AJAX request. Why is it preferred here?
- If you needed to add a feature that genuinely benefits from CSR (e.g. live drag-and-drop reordering, real-time updates), where would you add it — alongside the SSR pages, or as a replacement?

## Reading / Reference

- MDN: [The HTML form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- MDN: [Sending form data](https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data)
- MDN: [HTTP 303 See Other](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303)
- [The Post/Redirect/Get pattern](https://en.wikipedia.org/wiki/Post/Redirect/Get)
- FastAPI: [Form data](https://fastapi.tiangolo.com/tutorial/request-forms/)
