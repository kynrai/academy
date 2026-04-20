# Weekend Challenges

## Challenge 1 — POST Endpoint

Add a `POST /api/languages` endpoint to your Day 5 server in your preferred language. The endpoint should:

- Accept a JSON request body with `name`, `display`, `typing`, and `paradigm` fields
- Return `400 Bad Request` with an error message if any required field is missing
- Append the new language to the in-memory list and return it with status `201 Created`

Test it with curl:

```sh
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"rust","display":"Rust","typing":"static","paradigm":"systems"}' \
  http://localhost:8000/api/languages
```

Then verify the new entry appears in the list:

```sh
curl http://localhost:8000/api/languages
```

After adding the POST endpoint, reload both `/` (SSR) and `/app` (CSR) in the browser. Both should show the new language — because both ultimately read from the same server-side list.

Test the validation: send a body with a missing field and confirm you get a `400` back, not a `500`.

## Challenge 2 — Template Engines

Building HTML with string concatenation works, but it becomes hard to maintain as pages grow. Template engines let you write HTML files with placeholder variables, and the server fills them in at request time.

Refactor your SSR route to use a template engine instead of an f-string or template literal:

- **Python:** Jinja2 (`uv add jinja2`). Create a `templates/` directory with an `index.html` file. Use `Jinja2Templates` from `fastapi.templating` to render it, passing `languages` as a context variable.
- **Node.js:** EJS (`npm install ejs`). Configure Express with `app.set('view engine', 'ejs')` and create a `views/index.ejs` file. Use `res.render('index', { languages })`.
- **C#:** Razor Pages (built into ASP.NET Core). Create a `.cshtml` file and use the Razor view engine to pass the language list to the template.
- **Go:** `html/template` (standard library, no extra dependency). Parse a template string or file with `template.Must(template.ParseFiles("index.html"))` and execute it with the language data.

The goal is to separate the HTML structure from the Go/Python/JS/C# code. The server code handles data; the template handles presentation.

## Challenge 3 — Language Detail View

Add a detail view to the CSR page from Day 4. When a user clicks "View details" on a language card, the page should:

1. Fetch `GET /api/languages/{name}` for that specific language
2. Render the detail in the same page — without a full page reload
3. Show a "Back to list" link that restores the list view

This is the foundation of a single-page application: one HTML file, multiple views, no page reloads.

To get started, add a `data-name` attribute to each card button:

```html
<button class="details-btn" data-name="${lang.name}">View details</button>
```

Then attach a click handler:

```js
document.getElementById('list').addEventListener('click', async e => {
  if (!e.target.matches('.details-btn')) return
  const name = e.target.dataset.name
  const response = await fetch(`${API}/api/languages/${name}`)
  const lang = await response.json()
  // render the detail view
})
```

## Challenge 4 — Language-Agnostic Frontend

Build a single static HTML page (no server required — just open the file in a browser) with a dropdown that switches between two backends:

```html
<select id="backend">
  <option value="http://localhost:8000">Python (port 8000)</option>
  <option value="http://localhost:3000">Node.js (port 3000)</option>
  <option value="http://localhost:5000">C# (port 5000)</option>
  <option value="http://localhost:8080">Go (port 8080)</option>
</select>
```

When the dropdown changes, re-fetch `/api/languages` from the selected backend and re-render the list. Confirm that switching backends returns identical data regardless of which language is serving it.

This exercise makes the language-agnostic nature of HTTP concrete: the frontend code is unchanged; only the origin changes.

## Challenge 5 — Reflection Questions

Think through these questions and write short answers — a few sentences each is enough:

1. What are two situations where you would choose SSR over CSR? What are two where you would choose CSR? Give a concrete example for each.

2. When would you use both SSR and CSR in the same application? (Hint: think about which parts of a page need to be immediately visible vs which parts are highly interactive.)

3. How does disabling JavaScript in the browser affect SSR pages vs CSR pages? What does this reveal about their respective dependencies?

4. What does CORS protect, and why does it only apply to browser-initiated requests? Why can `curl` call any API regardless of CORS headers?

5. In Day 5, the SSR page reads the `languages` list directly from server memory, while the CSR page fetches it from `/api/languages`. If you added a database later, which approach requires fewer changes and why?

## Recommended Reading

- web.dev: [Rendering on the Web](https://web.dev/articles/rendering-on-the-web) — if you have not read it yet, this is the best single article on SSR vs CSR vs SSG and when to use each
- MDN: [Progressive Enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) — the philosophy behind building pages that work without JavaScript first
- [The Twelve-Factor App](https://12factor.net/) — focus on factors III (Config), VI (Processes), and VII (Port Binding) as they relate to the servers you built this week
- MDN: [HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) — once your APIs are working, caching is the next lever for performance
