# Day 5 – Full-Stack Project: SSR and CSR in One Server

## Today's Focus

Combine everything from this week into a single server that handles three different routes: a fully server-rendered HTML page, a JSON API, and a CSR shell. The goal is to see all three patterns running together and to verify that the same JSON API can be consumed by both the browser directly and by a JavaScript frontend.

## The Project

One server, three routes:

| Route | Pattern | What it returns |
| ----- | ------- | --------------- |
| `GET /` | SSR | A complete HTML page with a table of languages — no JS needed |
| `GET /api/languages` and `GET /api/languages/{name}` | REST API | JSON |
| `GET /app` | CSR shell | Minimal HTML with a `<script>` that fetches `/api/languages` |

The SSR page and the CSR page show the same data — but they get it differently. The SSR page reads the `languages` list directly (server memory). The CSR page sends its own HTTP request to `/api/languages` after the browser loads it.

This means the same JSON endpoint is used by:

- The CSR frontend (browser-initiated fetch)
- `curl` (direct API calls during development and testing)
- Any other client — a mobile app, a script, another server

## Reference Implementation — Python (FastAPI)

Pick one language and build the full server. The Python version is shown here in full; the structure maps directly to Node.js, C#, and Go with the same three route types.

`main.py`:

```python
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

languages = [
    {"name": "python", "display": "Python", "typing": "dynamic", "paradigm": "multi-paradigm"},
    {"name": "javascript", "display": "JavaScript", "typing": "dynamic", "paradigm": "multi-paradigm"},
    {"name": "csharp", "display": "C#", "typing": "static", "paradigm": "object-oriented"},
    {"name": "go", "display": "Go", "typing": "static", "paradigm": "procedural"},
]

# ── SSR route ──────────────────────────────────────────────────────────────
@app.get("/", response_class=HTMLResponse)
def ssr_page():
    rows = "\n".join(
        f'  <tr><td>{l["display"]}</td><td>{l["typing"]}</td><td>{l["paradigm"]}</td></tr>'
        for l in languages
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Languages – SSR</title>
<style>body{{font-family:sans-serif;max-width:700px;margin:2rem auto}}
table{{border-collapse:collapse;width:100%}}th,td{{border:1px solid #ddd;padding:8px;text-align:left}}
th{{background:#f4f4f4}}</style>
</head>
<body>
  <h1>Languages (Server-Side Rendered)</h1>
  <p>This HTML was built by Python and sent complete. No JavaScript needed.</p>
  <table><thead><tr><th>Language</th><th>Typing</th><th>Paradigm</th></tr></thead>
  <tbody>{rows}</tbody></table>
  <p><a href="/app">View the CSR version →</a></p>
</body>
</html>"""

# ── JSON API routes ────────────────────────────────────────────────────────
@app.get("/api/languages")
def list_languages(typing: Optional[str] = None):
    if typing:
        return [l for l in languages if l["typing"] == typing]
    return languages

@app.get("/api/languages/{name}")
def get_language(name: str):
    lang = next((l for l in languages if l["name"] == name.lower()), None)
    if not lang:
        raise HTTPException(status_code=404, detail=f"Language '{name}' not found")
    return lang

# ── CSR shell route ────────────────────────────────────────────────────────
@app.get("/app", response_class=HTMLResponse)
def csr_shell():
    return """<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Languages – CSR</title>
<style>body{font-family:sans-serif;max-width:700px;margin:2rem auto}
.card{border:1px solid #ddd;border-radius:6px;padding:1rem;margin:.5rem 0}
#status{color:#888;font-style:italic}</style>
</head>
<body>
  <h1>Languages (Client-Side Rendered)</h1>
  <p>This shell was sent by the server. JavaScript fetches the data and builds the list.</p>
  <p id="status">Loading...</p>
  <div id="list"></div>
  <p><a href="/">View the SSR version →</a></p>
  <script>
    fetch('/api/languages')
      .then(r => r.json())
      .then(languages => {
        document.getElementById('status').textContent = languages.length + ' languages loaded'
        document.getElementById('list').innerHTML = languages.map(l => `
          <div class="card">
            <h2>${l.display}</h2>
            <p>Typing: ${l.typing} | Paradigm: ${l.paradigm}</p>
          </div>`).join('')
      })
      .catch(err => {
        document.getElementById('status').textContent = 'Error: ' + err.message
      })
  </script>
</body>
</html>"""
```

Run:

```sh
uv run uvicorn main:app --port 8000 --reload
```

## Testing the Three Routes

**SSR page — returns finished HTML:**

```sh
curl http://localhost:8000/
```

The response body is a complete HTML document with a `<table>` containing all four languages. The `Content-Type` is `text/html`.

**JSON API — returns data:**

```sh
curl http://localhost:8000/api/languages
curl http://localhost:8000/api/languages/python
curl http://localhost:8000/api/languages/go
```

**CSR shell — returns minimal HTML:**

```sh
curl http://localhost:8000/app
```

The response body is an HTML document with an empty `<div id="list">`. The data only appears after the browser runs the embedded script.

**In the browser:**

- Open `http://localhost:8000/` — you see a table rendered immediately
- Open `http://localhost:8000/app` — you briefly see "Loading..." then the list appears
- Click the links between the two pages

## Comparing the Two Pages in DevTools

Open DevTools and compare `/` and `/app` side by side.

**View Page Source for `/`:**

The HTML source contains the full `<table>` with all four rows. The data is embedded in the document the server sent.

**View Page Source for `/app`:**

The HTML source contains `<div id="list"></div>` — empty. The data is not there yet.

**Elements tab for `/app`:**

After the script runs, `<div id="list">` contains four `.card` divs. These were created by JavaScript after the browser made a second request to `/api/languages`.

**Network tab for `/app`:**

Two requests appear: the `GET /app` document request and then a `GET /api/languages` fetch. For `/`, there is only one request — the data came with the HTML.

**Disable JavaScript and compare:**

Disable JavaScript (DevTools → Settings → Debugger → Disable JavaScript). Reload `/` — the table is still there. Reload `/app` — the list is empty, "Loading..." is frozen. SSR is resilient to JavaScript being unavailable; CSR depends on it entirely.

## The Language-Agnostic Point

The CSR frontend running in the browser does not know or care which language the server is written in. When the script calls `fetch('/api/languages')`, it sees HTTP — a `200 OK` response with `Content-Type: application/json` and a JSON body. The language on the other end is invisible.

To make this concrete:

- Build the Python server above on port 8000
- Build the Go server from Day 3 on port 8080 (with CORS enabled)
- In the CSR shell's `<script>`, change `fetch('/api/languages')` to `fetch('http://localhost:8080/api/languages')`
- Reload `/app` — the same cards appear, sourced from Go

The frontend code did not change. The contract — URL, method, response shape — is what matters.

## Adapting to Other Languages

The same three-route structure works in any language. The routes are:

1. A handler that returns `Content-Type: text/html` with a complete HTML string
2. Handlers that return `Content-Type: application/json` with serialised data
3. A handler that returns `Content-Type: text/html` with a minimal HTML shell containing a `<script>` that calls route 2

In Node.js: use `res.send(html)` for HTML routes and `res.json(data)` for JSON routes.

In C#: use `Results.Content(html, "text/html")` for HTML routes and return objects directly for JSON routes (ASP.NET Core serialises them automatically).

In Go: set `w.Header().Set("Content-Type", "text/html; charset=utf-8")` and write the HTML string for HTML routes; use `encoding/json` for JSON routes.

## Tasks

- Build the full-stack server in Python using the reference implementation above. Run it and confirm all three routes work with both `curl` and the browser.

- Visit `/` in the browser. Use **View Page Source** and confirm the language data is in the HTML source.

- Visit `/app` in the browser. Use **View Page Source** and confirm `<div id="list">` is empty in the source. Open the **Elements** tab and confirm it is populated after JS runs.

- Open the **Network** tab. Compare the number of requests made for `/` (one) vs `/app` (two).

- Disable JavaScript and visit both pages. Confirm `/` still shows the data and `/app` shows an empty list.

- Edit the `languages` list on the server: add a fifth language (e.g. `{"name": "rust", "display": "Rust", "typing": "static", "paradigm": "systems"}`). Restart the server and reload both `/` and `/app`. Both pages update — because both ultimately read from the same source of truth on the server.

- **Optional cross-language test:** if you also have the Go server from Day 3 running on port 8080, edit the CSR shell's fetch URL to point to port 8080 and confirm the frontend still renders correctly.

## Reading / Reference

- web.dev: [Rendering on the Web](https://web.dev/articles/rendering-on-the-web) — excellent comparison of SSR, CSR, SSG, and hybrid approaches
- MDN: [Progressive Enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)
