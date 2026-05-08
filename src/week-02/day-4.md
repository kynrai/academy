# Day 4 – Client-Side Rendering with JavaScript

## Today's Focus

Build a browser page that fetches data from the Day 3 API and renders it using JavaScript. Understand how this differs from SSR, how to inspect it in DevTools, and what CORS is and why it matters.

## What Client-Side Rendering Is

In **Client-Side Rendering (CSR)**, the server sends a minimal HTML skeleton — a `<head>`, a largely empty `<body>`, and a `<script>` tag. The browser runs the script, which calls an API, receives JSON, and builds the DOM from JavaScript.

| | Server-Side Rendering | Client-Side Rendering |
| - | -------------------- | -------------------- |
| What the server sends | Complete HTML with data | Empty HTML shell + JS |
| When content appears | Immediately on load | After JS fetches the API |
| Works without JavaScript | Yes | No |
| Page source shows content | Yes | No — source is the empty shell |
| Subsequent updates | Full page reload | JS updates DOM without reload |

## The DOM

The **Document Object Model (DOM)** is the browser's live in-memory tree representation of the current page. JavaScript can read and modify it at any time.

```js
// Find elements
const el = document.getElementById('list')
const card = document.querySelector('.card')
const cards = document.querySelectorAll('.card')

// Read and write content
el.textContent = 'Loading...'                      // safe — no HTML injection
el.innerHTML = '<strong>Hello</strong>'            // parses as HTML

// Create and insert elements
const div = document.createElement('div')
div.className = 'card'
div.textContent = 'Python'
document.getElementById('list').appendChild(div)
```

The difference between `textContent` and `innerHTML`:

- `textContent` sets plain text. Any HTML tags become literal characters. Use this for data from an API — it prevents accidental HTML injection.
- `innerHTML` parses the string as HTML. Useful for templates, but never insert untrusted user input this way.

## The fetch() API

`fetch()` is the browser's built-in function for making HTTP requests from JavaScript. It returns a Promise that resolves to a `Response` object.

```js
const response = await fetch('http://localhost:8000/api/languages')
if (!response.ok) throw new Error(`Server returned ${response.status}`)
const languages = await response.json()
```

Key things to know:

- `fetch()` only rejects on network failure. A `404` or `500` is a successful fetch — you must check `response.ok` yourself.
- `response.json()` returns another Promise that resolves to the parsed JSON.
- Use `await` inside an `async` function, or chain `.then()` calls.

## Three States Every Async UI Needs

Any UI that fetches data must handle three states explicitly:

| State | When | What to show |
| ----- | ---- | ------------ |
| Loading | Request sent, no response yet | "Loading…" message or spinner |
| Error | Network failure or non-OK status | Error message with enough detail to debug |
| Success | Response received and parsed | The actual data |

Failing to handle the error and loading states means users see a blank page or a frozen "Loading…" message when things go wrong.

## The CSR Page

Save the following as `languages-csr.html`. It calls the Day 3 API and renders the results, with a filter dropdown that sends a second request using a query parameter.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Languages (CSR)</title>
  <style>
    body { font-family: sans-serif; max-width: 700px; margin: 2rem auto; }
    .card { border: 1px solid #ddd; border-radius: 6px; padding: 1rem; margin: 0.5rem 0; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; }
    .static { background: #dbeafe; color: #1e40af; }
    .dynamic { background: #dcfce7; color: #166534; }
    #status { color: #888; font-style: italic; }
  </style>
</head>
<body>
  <h1>Programming Languages</h1>

  <label for="filter">Filter by typing:</label>
  <select id="filter">
    <option value="">All</option>
    <option value="static">Static</option>
    <option value="dynamic">Dynamic</option>
  </select>

  <p id="status">Loading...</p>
  <div id="list"></div>

  <script>
    const API = 'http://localhost:8000'  // change to 3000, 5000, or 8080 for other languages

    async function loadLanguages(typing = '') {
      const status = document.getElementById('status')
      const list = document.getElementById('list')

      status.textContent = 'Loading...'
      list.innerHTML = ''

      try {
        const url = typing ? `${API}/api/languages?typing=${typing}` : `${API}/api/languages`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`)
        }

        const languages = await response.json()
        status.textContent = `Showing ${languages.length} language(s)`

        languages.forEach(lang => {
          const card = document.createElement('div')
          card.className = 'card'
          card.innerHTML = `
            <h2>${lang.display}</h2>
            <p>Paradigm: ${lang.paradigm}</p>
            <span class="badge ${lang.typing}">${lang.typing} typing</span>
          `
          list.appendChild(card)
        })

      } catch (err) {
        status.textContent = `Error: ${err.message}. Is the API server running?`
      }
    }

    document.getElementById('filter').addEventListener('change', e => {
      loadLanguages(e.target.value)
    })

    loadLanguages()
  </script>
</body>
</html>
```

Open this file directly in your browser. You will likely see an error — because the browser is loading from `file://` and making a request to `http://localhost:8000`, which is a different origin. This is CORS.

## CORS

**Cross-Origin Resource Sharing (CORS)** is a browser security mechanism. When JavaScript on one origin makes a request to a different origin, the browser checks whether the server allows it.

The browser adds an `Origin` header to the request. If the server's response includes `Access-Control-Allow-Origin: *` (or an explicit origin), the browser allows the JavaScript to read the response. If not, the browser blocks it — even if the response arrived.

CORS only applies to browser-initiated requests. `curl` does not enforce CORS.

To make `languages-csr.html` work, add CORS headers to whichever Day 3 API server you are using:

### Python — FastAPI

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Node.js — Express

```sh
npm install cors
```

```js
const cors = require('cors')
app.use(cors())
```

### C# — ASP.NET Core

```csharp
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

// after var app = builder.Build():
app.UseCors();
```

### Go — net/http

```go
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        next(w, r)
    }
}
```

Then wrap each handler: `http.HandleFunc("/api/languages", corsMiddleware(listLanguages))`.

## Inspecting CSR in DevTools

Open `languages-csr.html` with your CORS-enabled API running. Open DevTools (F12).

**Network tab:** two requests appear — the HTML file itself and the API fetch. Click the API request. Note the request URL, the `Request Method` (`GET`), the `Access-Control-Allow-Origin` response header, and the JSON in the **Response** tab.

When you use the filter dropdown, a new request appears — the same URL with `?typing=static` appended.

**Elements tab:** after the page loads, expand `<div id="list">`. The `.card` divs inside it are **not in the HTML file** — they were created by JavaScript using `document.createElement` and `appendChild`.

**View Page Source vs Elements tab:** use `Cmd+U` / `Ctrl+U` to view the page source. It shows the original HTML file with `<div id="list">` empty. The Elements tab shows the live DOM after JavaScript ran. This is the essential difference between SSR and CSR — in SSR the two views are the same; in CSR they diverge.

## Tasks

- Start one of the Day 3 API servers and add CORS support. Open `languages-csr.html` in the browser and confirm the language cards appear.

- Open DevTools → **Network** tab. Identify the two requests. Click each and compare the `Content-Type` response header.

- Open DevTools → **Elements** tab. Confirm the `.card` elements are present in the DOM even though they are not in the source HTML file.

- Use **View Page Source** (`Cmd+U` / `Ctrl+U`). Compare the source to the Elements tab.

- Use the filter dropdown to select "static". Watch a new request appear in the Network tab. Click it and confirm the URL contains `?typing=static`.

- Stop the API server and reload the page. The error state should appear.

- Change the `API` constant from port `8000` to `3000`, `5000`, or `8080` (whichever other server you have running with CORS enabled). Reload. The same frontend now fetches from a completely different language's server — and it works identically.

## Reading / Reference

- MDN: [Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
- MDN: [Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- MDN: [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
