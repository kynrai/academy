# Week 3 – Web Development, APIs, and Browser-Server Interaction

## Overview

With all four language runtimes installed from Week 2, Week 3 focuses on the web layer in depth. The week progresses from how browsers interpret raw HTTP responses, through building server-rendered HTML pages and JSON REST APIs in all four languages, to connecting a JavaScript frontend to those APIs — and finally combining all three patterns into a single server. Every concept is reinforced in Python, Node.js, C#, and Go to make clear that HTTP is language-agnostic.

## What you will learn

| Day | Topic |
| --- | ----- |
| Day 1 | HTTP protocol — requests, responses, headers, methods, status codes, path and query parameters |
| Day 2 | How browsers work and server-side rendering in all four languages |
| Day 3 | REST APIs returning JSON — all four languages, path params, query params, status codes |
| Day 4 | Client-side rendering — JavaScript, the DOM, fetch(), and connecting to an API |
| Day 5 | Full-stack project — one server serving SSR, a JSON API, and a CSR shell |

## Objectives

By the end of this week you will be able to:

- Describe the full browser rendering pipeline from URL to painted pixels.
- Explain what server-side rendering (SSR) and client-side rendering (CSR) are and give a situation where each is appropriate.
- Build a server in any of the four languages that returns HTML (SSR) and JSON (API).
- Build a browser-based JavaScript frontend that fetches an API and updates the DOM.
- Write and test REST API endpoints with `curl`.
- Explain why HTTP is language-agnostic using your own working examples.

## Topics

### HTTP Fundamentals

- The request/response cycle: method, URL, headers, body, status code
- HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Path parameters (`/api/languages/python`) vs query parameters (`?typing=static`)
- Common request headers: `Accept`, `Content-Type`, `Authorization`, `User-Agent`
- Common response headers: `Content-Type`, `Cache-Control`, `Set-Cookie`
- Status code ranges: `2xx` success, `3xx` redirect, `4xx` client error, `5xx` server error
- `Content-Type: text/html` vs `Content-Type: application/json`

### Browser Rendering Pipeline

- DNS lookup → TCP connection → HTTP request → response → parse → render
- Bytes → characters → tokens → DOM nodes → DOM tree → CSSOM → render tree → layout → paint
- How `<script>` tags affect parsing; `defer` and `async`

### Server-Side Rendering

- Building complete HTML strings on the server
- Returning `Content-Type: text/html`
- SSR in Python (FastAPI + HTMLResponse), Node.js (Express), C# (ASP.NET Core), and Go (net/http)
- Why SSR works without JavaScript and is friendly to SEO

### REST API Design

- Resources as plural nouns, identified by URL
- Building endpoints with FastAPI, Express, ASP.NET Core, and Go `net/http`
- Path parameters and query parameters in each framework
- Returning appropriate status codes: `200`, `201`, `400`, `404`
- A `GET /health` endpoint as a deployment convention

### Client-Side Rendering and the DOM

- The DOM: the browser's live in-memory representation of the page
- `document.getElementById`, `querySelector`, `createElement`, `appendChild`
- `textContent` vs `innerHTML`
- `fetch()` — Promises, `await`, checking `response.ok`, parsing with `response.json()`
- Three async UI states: loading, error, success
- Cross-Origin Resource Sharing (CORS) — what it is, why it exists, how to enable it

### Full-Stack Architecture

- One server handling SSR routes, JSON API routes, and CSR shell routes
- The same JSON endpoint consumed by a browser frontend, `curl`, and other servers
- Comparing View Page Source vs the Elements tab for SSR vs CSR pages

## Deliverables

- A server-rendered HTML page built in one or more languages
- A JSON REST API with at least `GET /api/languages` and `GET /api/languages/{name}`
- A CSR frontend page that fetches the API and renders data with JavaScript
- A single full-stack server that demonstrates both SSR and CSR modes
- A `requests.sh` file with `curl` commands for every endpoint
