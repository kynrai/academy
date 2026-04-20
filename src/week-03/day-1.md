# Day 1 – HTTP, Browsers, and APIs

## Today's Focus

Understand what happens when you visit a URL: how HTTP works, what a browser actually does with the response, the difference between a server that returns HTML and one that returns JSON, and how modern web pages combine both — loading HTML first, then using JavaScript to call an API and render the result.

## How HTTP Works

HTTP (HyperText Transfer Protocol) is the language a browser uses to ask a server for something, and the language a server uses to reply. Every interaction follows the same pattern:

1. The browser sends a **request** — a method (`GET`, `POST`, etc.), a URL, and headers.
2. The server sends back a **response** — a status code, headers, and a body.

```text
GET /index.html HTTP/1.1
Host: example.com

HTTP/1.1 200 OK
Content-Type: text/html
...body...
```

The `Content-Type` header tells the browser what kind of data is in the body. The two most common types in web development are:

| Content-Type | What it means |
| ------------ | ------------- |
| `text/html` | The body is an HTML document — the browser renders it as a page. |
| `application/json` | The body is JSON data — the browser displays it as raw text unless JavaScript handles it. |

## Anatomy of a Request

A full HTTP request has three parts: a **request line**, **headers**, and an optional **body**.

```text
GET /api/v2/pokemon?limit=5&offset=0 HTTP/1.1
Host: pokeapi.co
Accept: application/json
User-Agent: Mozilla/5.0
```

### HTTP Methods

The method describes the intended action:

| Method | Typical use |
| ------ | ----------- |
| `GET` | Retrieve a resource — no body, safe to repeat. |
| `POST` | Create a new resource — body contains the data. |
| `PUT` | Replace a resource entirely. |
| `PATCH` | Update part of a resource. |
| `DELETE` | Remove a resource. |

### Path Parameters

A path parameter is a variable segment embedded directly in the URL path. It identifies a specific resource:

```text
GET /api/v2/pokemon/pikachu
                   ^^^^^^^^ path parameter — the Pokémon name
```

The server reads this segment and uses it to look up the right record. Changing `pikachu` to `bulbasaur` returns a completely different resource.

### Query Parameters

Query parameters appear after a `?` in the URL, as `key=value` pairs separated by `&`. They modify or filter a request without identifying a different resource:

```text
GET /api/v2/pokemon?limit=5&offset=10
                    ^^^^^^^  ^^^^^^^^
                    page size  skip first 10
```

Query parameters are commonly used for: pagination, search terms, sort order, and filter criteria.

### Request Headers

Headers are key-value metadata sent alongside the request. Common ones:

| Header | Purpose |
| ------ | ------- |
| `Host` | The domain the request is directed to — required in HTTP/1.1. |
| `Accept` | The content types the client is willing to receive (e.g. `application/json`). |
| `Content-Type` | The format of the **request body** (e.g. `application/json` on a POST). |
| `Authorization` | Credentials — commonly `Bearer <token>` for APIs. |
| `User-Agent` | Identifies the client software (browser name and version, or tool name). |

## Anatomy of a Response

A response has a **status line**, **headers**, and a **body**.

```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: public, max-age=86400

{"name":"pikachu","height":4,"weight":60,...}
```

### Status Codes

Status codes are grouped by their first digit:

| Range | Meaning | Common examples |
| ----- | ------- | --------------- |
| `2xx` | Success | `200 OK`, `201 Created`, `204 No Content` |
| `3xx` | Redirect | `301 Moved Permanently`, `302 Found` |
| `4xx` | Client error | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found` |
| `5xx` | Server error | `500 Internal Server Error`, `503 Service Unavailable` |

### Response Headers

| Header | Purpose |
| ------ | ------- |
| `Content-Type` | The format of the response body. |
| `Content-Length` | Size of the body in bytes. |
| `Cache-Control` | How long and where the response can be cached. |
| `Set-Cookie` | Instructs the browser to store a cookie. |
| `Location` | On a `3xx` response, the URL to redirect to. |

## Three Ways a Page Can Work

### 1 — Server returns HTML directly

The browser requests a URL, the server returns an HTML document, and the browser renders it. No JavaScript required. This is how static sites and server-rendered apps work.

```text
Browser  →  GET /index.html  →  Server
Browser  ←  200 text/html   ←  Server
Browser renders the HTML
```

### 2 — Server returns JSON (an API)

The browser (or any client — a mobile app, a CLI, another server) requests a URL and the server returns structured data as JSON. The client decides what to do with it. APIs work this way.

```text
Client   →  GET /api/pokemon/pikachu  →  Server
Client   ←  200 application/json     ←  Server
Client reads the data and does something with it
```

### 3 — Browser loads HTML, then JavaScript calls an API

The browser loads an HTML page (which may be mostly empty). The page contains a `<script>` tag. The browser runs the script, which makes a `fetch()` call to an API, receives JSON, and uses JavaScript to build HTML from the data and insert it into the page. This is how most modern single-page applications work.

```text
Browser  →  GET /index.html            →  Server
Browser  ←  200 text/html (+ script)  ←  Server
Browser runs the script
Script   →  GET https://pokeapi.co/api/v2/pokemon/pikachu  →  API
Script   ←  200 application/json                          ←  API
Script builds HTML from the JSON and updates the page
```

## Key Concepts

| Term | Explanation |
| ---- | ----------- |
| HTTP | The request/response protocol browsers and servers use to communicate. |
| Client | Anything that makes a request — a browser, a mobile app, `curl`, another server. |
| Server | A program that listens for requests and sends back responses. |
| API | A server endpoint designed to be called by code, not a human — typically returns JSON. |
| HTTP method | The verb describing the action: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`. |
| Path parameter | A variable segment in the URL path that identifies a specific resource: `/pokemon/pikachu`. |
| Query parameter | A `key=value` pair appended after `?` to filter or modify a request: `?limit=5&offset=0`. |
| Header | Metadata sent with a request or response: `Content-Type`, `Accept`, `Authorization`. |
| Status code | A three-digit number in the response: `200` OK, `404` Not Found, `500` Server Error. |
| `Content-Type` | A header declaring the format of the body — on requests and responses. |
| `Accept` | A request header declaring what content type the client wants back. |
| `fetch()` | The browser's built-in JavaScript function for making HTTP requests from a page. |
| DOM | The browser's in-memory representation of the HTML on the page — JavaScript can read and modify it. |

## Tasks

### Task 1 — Explore headers, path params, and query params with curl

`curl` is a command-line tool that makes HTTP requests and prints the response. It is a fast way to see the raw exchange before writing any code.

Fetch a single Pokémon by name — this is a **path parameter**:

```sh
curl https://pokeapi.co/api/v2/pokemon/pikachu
```

Add `-i` to include the response headers in the output — look for `Content-Type` and `Cache-Control`:

```sh
curl -i https://pokeapi.co/api/v2/pokemon/pikachu
```

Fetch a **list** using query parameters to control pagination:

```sh
curl "https://pokeapi.co/api/v2/pokemon?limit=5&offset=0"
curl "https://pokeapi.co/api/v2/pokemon?limit=5&offset=5"
```

Note how changing `offset` returns a different page of results but the path stays the same.

Send a custom `Accept` request header to explicitly declare what format you want:

```sh
curl -H "Accept: application/json" https://pokeapi.co/api/v2/pokemon/1
```

Trigger a `404` deliberately and observe the status code:

```sh
curl -i https://pokeapi.co/api/v2/pokemon/notarealname
```

Now open DevTools in your browser (F12 → Network tab) and navigate to each of the same URLs. Click on each request and compare:

- **Headers** tab: the request headers your browser sent automatically vs the ones `curl` sent
- **Response** tab: the raw body
- The status code shown in the **Status** column

### Task 2 — HTML rendered directly by the browser

Create a file called `index.html` on your machine with the following content and open it in your browser (`File → Open`, or drag the file onto the browser window):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello HTTP</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 2rem auto; }
  </style>
</head>
<body>
  <h1>Hello from HTML</h1>
  <p>This page was returned as <code>text/html</code>.
     The browser rendered it directly — no JavaScript involved.</p>
</body>
</html>
```

Open DevTools (F12), go to the **Network** tab, reload the page, and find the request for `index.html`. Look at the **Headers** tab of that request and note the `Content-Type` of the response.

### Task 3 — Inspect a JSON API response

Open a new browser tab and navigate to:

```text
https://pokeapi.co/api/v2/pokemon/pikachu
```

The browser displays raw JSON — not a rendered page. The server returned `application/json` and the browser has no instructions for rendering it, so it just shows the text.

Look at the response in DevTools → Network → find the request → **Response** tab. Note the structure: `name`, `height`, `weight`, `sprites`, `types`.

### Task 4 — JavaScript fetches the API and builds HTML

Create a second file called `pokemon.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pokémon Lookup</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 2rem auto; }
    #card { border: 1px solid #ccc; border-radius: 8px; padding: 1rem; margin-top: 1rem; }
    img { display: block; }
    label { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Pokémon Lookup</h1>

  <label for="name">Pokémon name</label><br>
  <input id="name" type="text" value="pikachu">
  <button id="search">Search</button>

  <div id="card" hidden></div>

  <script>
    document.getElementById('search').addEventListener('click', async () => {
      const name = document.getElementById('name').value.trim().toLowerCase();
      const card = document.getElementById('card');
      card.hidden = true;

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

      if (!response.ok) {
        card.innerHTML = `<p>Could not find <strong>${name}</strong> (${response.status})</p>`;
        card.hidden = false;
        return;
      }

      const data = await response.json();

      card.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p><strong>Height:</strong> ${data.height / 10} m</p>
        <p><strong>Weight:</strong> ${data.weight / 10} kg</p>
        <p><strong>Types:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
      `;
      card.hidden = false;
    });
  </script>
</body>
</html>
```

Open `pokemon.html` in your browser. Open DevTools → **Network** tab. Click **Search**. Watch two requests appear:

1. The initial `pokemon.html` document load (`text/html`)
2. The `fetch()` call to the PokéAPI (`application/json`)

Click on the second request and look at the **Response** tab — this is the raw JSON the script received. Then look at the page — the browser is displaying the data the script built from that JSON.

Try searching for `bulbasaur`, `charizard`, and a name that does not exist. Observe the `200` and `404` status codes in the Network tab.

### Task 5 — Observe the difference with DevTools

With `pokemon.html` open and the Network tab recording, answer these questions:

- What `Content-Type` does the PokéAPI return?
- What HTTP method is the `fetch()` using?
- What is the response status code for a valid name? For an invalid one?
- At what point does the HTML on the page change — before or after the API response arrives?

## Reading / Reference

- MDN: [An overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- MDN: [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- MDN: [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- MDN: [HTTP headers reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- MDN: [How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work)
- MDN: [Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- MDN: [Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
