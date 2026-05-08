# Weekend Challenges

## Challenge 1 — POST Endpoint

Add a `POST /api/languages` endpoint to your Day 5 server. It should:

- Accept a JSON body with `name`, `display`, `typing`, and `paradigm` fields
- Return `400 Bad Request` with an error message if any required field is missing
- Append the new language to the in-memory list and return it with status `201 Created`

Test with curl:

```sh
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"rust","display":"Rust","typing":"static","paradigm":"systems"}' \
  http://localhost:8000/api/languages
```

Then verify the new entry appears:

```sh
curl http://localhost:8000/api/languages
```

Reload both `/` (SSR) and `/app` (CSR). Both should show the new language — because both read from the same server-side list.

## Challenge 2 — Template Engines

Building HTML with string concatenation works but becomes hard to maintain. Refactor your SSR route to use a template engine:

- **Python:** Jinja2 (`uv add jinja2`). Create a `templates/` directory with `index.html`. Use `Jinja2Templates` from `fastapi.templating`.
- **Node.js:** EJS (`npm install ejs`). Configure Express with `app.set('view engine', 'ejs')` and create a `views/index.ejs` file. Use `res.render('index', { languages })`.
- **C#:** Razor Pages (built into ASP.NET Core). Create a `.cshtml` file and use the Razor view engine.
- **Go:** `html/template` (standard library). Parse a template file with `template.Must(template.ParseFiles("index.html"))` and execute it with the language data.

The goal is to separate the HTML structure from the server code.

## Challenge 3 — Language Detail View

Add a detail view to the CSR page from Day 5. When a user clicks "View details" on a language card, the page should:

1. Fetch `GET /api/languages/{name}` for that specific language
2. Render the detail in the same page — without a full page reload
3. Show a "Back to list" link that restores the list view

Add a `data-name` attribute to each card:

```html
<button class="details-btn" data-name="${lang.name}">View details</button>
```

Then attach a click handler:

```js
document.getElementById('list').addEventListener('click', async e => {
  if (!e.target.matches('.details-btn')) return
  const name = e.target.dataset.name
  const response = await fetch(`/api/languages/${name}`)
  const lang = await response.json()
  // render the detail view
})
```

This is the foundation of a single-page application: one HTML file, multiple views, no page reloads.

## Challenge 4 — Language-Agnostic Frontend

Build a static HTML page with a dropdown that switches between backends:

```html
<select id="backend">
  <option value="http://localhost:8000">Python (port 8000)</option>
  <option value="http://localhost:3000">Node.js (port 3000)</option>
  <option value="http://localhost:5000">C# (port 5000)</option>
  <option value="http://localhost:8080">Go (port 8080)</option>
</select>
```

When the dropdown changes, re-fetch `/api/languages` from the selected backend and re-render the list. Confirm that switching backends returns identical data regardless of which language is serving it. The frontend code is unchanged — only the origin changes.

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
- Use each language's idiomatic argument parsing: `argparse` in Python, a library or manual parsing in Node.js, `System.CommandLine` or manual in C#, and the `flag` package in Go

## Reflection

1. What are two situations where you would choose SSR over CSR? What are two where you would choose CSR?
2. How does disabling JavaScript affect SSR pages vs CSR pages? What does this reveal about their respective dependencies?
3. What does CORS protect, and why does it only apply to browser-initiated requests? Why can `curl` call any API regardless of CORS headers?
4. In Day 5, the SSR page reads the `languages` list directly from server memory, while the CSR page fetches from `/api/languages`. If you added a database later, which approach requires fewer changes and why?
