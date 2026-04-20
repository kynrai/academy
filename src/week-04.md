# Week 4 – Databases

## Overview

After building web APIs in week 3, students need somewhere to store and retrieve data. This week introduces the three main categories of databases — relational, document, and key-value — and shows how to connect to each from Python, Node.js, C#, and Go.

Every example reinforces a single key insight: databases are accessed via a standard library or driver, and the SQL or query language is entirely independent of the application language. The same PostgreSQL table can be read by a Python script, a Node.js server, a C# application, and a Go binary simultaneously.

## Day Table

| Day | Topic |
| --- | ----- |
| Day 1 | Database types — relational, document, key-value, time-series; when to use each |
| Day 2 | SQLite — relational databases with zero server setup, SQL, and all four languages |
| Day 3 | PostgreSQL — production relational database, schema, queries, all four languages |
| Day 4 | MongoDB — document databases, schema-less design, CRUD in all four languages |
| Day 5 | Redis — key-value stores, caching, sessions; choosing the right database |

## Objectives

By the end of the week, students can:

- Explain the difference between relational, document, and key-value databases
- Write basic SQL: `CREATE TABLE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`
- Connect to SQLite, PostgreSQL, MongoDB, and Redis from Python, Node.js, C#, and Go
- Explain when each database type is appropriate for a given problem

## Topics

### Relational Databases

Data is organised into tables with rows and columns. Each table has a fixed schema — every row has the same columns. Relationships between tables are expressed with foreign keys. The query language is SQL (Structured Query Language), which is standardised and works across PostgreSQL, MySQL, SQLite, and SQL Server with minor differences.

Key concepts:

- **Tables, rows, and columns** — the fundamental unit of storage
- **Primary keys** — uniquely identify each row
- **Foreign keys** — link rows across tables
- **SQL** — the language for querying and manipulating relational data
- **ACID transactions** — Atomicity, Consistency, Isolation, Durability; the guarantee that a set of operations either all succeed or all fail cleanly

### Document Databases

Data is stored as documents (JSON-like objects) in collections. There is no fixed schema — different documents in the same collection can have different fields. This is useful for data that naturally varies in shape or embeds nested structures. The primary example this week is MongoDB.

### Key-Value Stores

The simplest model: a key maps to a value. Extremely fast because data lives in memory. No complex querying — you look things up by key. Used for caching, sessions, rate limiting, and ephemeral data. The primary example this week is Redis.

### Installation

**SQLite** — no setup required; it is a library embedded into the application.

**PostgreSQL** — macOS: `brew install postgresql@16 && brew services start postgresql@16`. Linux: `sudo apt install postgresql && sudo service postgresql start`.

**MongoDB** — macOS: `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`. Linux: follow the official apt repository instructions at docs.mongodb.com.

**Redis** — macOS: `brew install redis && brew services start redis`. Linux: `sudo apt install redis-server && sudo service redis-server start`.

## Deliverables

- A SQLite database with a `languages` table populated from all four language runtimes
- A PostgreSQL database with the same schema, with rows inserted from each language
- A MongoDB collection with the same documents, with arrays embedded in each document
- A Redis cache demonstrating `GET`, `SET`, and TTL-based expiry
- A written comparison (one paragraph) explaining when you would choose each database type
