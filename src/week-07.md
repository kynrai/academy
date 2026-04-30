# Week 7 – I/O, Network, and Data Processing

| Day | Topic                                              |
| --- | -------------------------------------------------- |
| 1   | File I/O and JSON                                  |
| 2   | HTTP Clients – Making Network Requests             |
| 3   | HTTP Servers – Routing and Responses               |
| 4   | Data Processing Pipelines                          |
| 5   | Integration Project – Read, Process, Serve, Fetch  |

## Objectives

- Read and write files and serialise data as JSON in all four languages.
- Make HTTP requests and parse responses programmatically.
- Build a small HTTP server that serves structured data.
- Chain filter, transform, and aggregate steps into a processing pipeline.

## Topics

- Reading and writing text files.
- JSON serialisation and deserialisation.
- Making GET and POST requests: Python (`requests`/`httpx`), TypeScript (`fetch`), C# (`HttpClient`), Go (`net/http`).
- Parsing JSON API responses into typed structures.
- Building HTTP servers with route handlers and JSON responses.
- Request body parsing and response status codes.
- Filter → transform → aggregate pipelines.
- Sorting, grouping, and summarising datasets.
- CSV parsing as a practical processing exercise.

## Hands-On Activities

- Load a `products.json` file and deserialise it into typed structs in each language.
- Fetch data from a public REST API and print a summary.
- Build a `/products` and `/products/{id}` route in each language's HTTP server.
- Chain filter and map operations to produce a summary report from a dataset.
- Build the integration project: load from file, process, serve as API, and fetch from another language's server.

## Deliverables

- A file reader/writer that loads and saves product data as JSON.
- A working HTTP server with at least two endpoints returning JSON.
- An integration project combining file I/O, data processing, and HTTP serving.

## Assessment

- Live demo: server responds correctly to `curl` requests; data pipeline produces expected output.
