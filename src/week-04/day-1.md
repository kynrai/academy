# Day 1 – Database Types and When to Use Them

## Today's Focus

Understand the landscape of database technologies. Not every problem needs the same database — the choice depends on the shape of the data, the access patterns, and the consistency requirements.

## What is a Database?

A database is a structured system for storing, querying, and updating data that persists beyond a single program run. Without a database, data lives only in memory and is lost when the process exits.

A web API that stores its data in a list variable will lose all data every time the server restarts. A database solves this by writing data to disk (or keeping it in managed memory with persistence) so it survives restarts, crashes, and deployments.

## The Main Types

### Relational Databases (SQL)

Data is organised into tables with rows and columns. Every row conforms to a fixed schema. Relationships between tables are expressed with foreign keys. SQL (Structured Query Language) is used to query and manipulate data.

| Property | Value |
| -------- | ----- |
| Data shape | Tables with fixed schemas |
| Query language | SQL |
| Consistency | ACID transactions |
| Best for | Structured data with clear relationships: users, orders, products, transactions |
| Examples | PostgreSQL, MySQL, SQLite, SQL Server |

### Document Databases

Data is stored as documents (JSON-like objects). There is no fixed schema — different documents in the same collection can have different fields. Good for data that naturally varies in shape.

| Property | Value |
| -------- | ----- |
| Data shape | JSON documents in collections |
| Query language | Language-specific query API |
| Consistency | Varies; typically eventual |
| Best for | Content, product catalogues, user profiles, event logs |
| Examples | MongoDB, CouchDB, Firestore |

### Key-Value Stores

The simplest model: a key maps to a value. Extremely fast, usually in-memory. No complex querying — you look things up by key.

| Property | Value |
| -------- | ----- |
| Data shape | Key → value |
| Query language | GET / SET commands |
| Consistency | Usually eventual |
| Best for | Caching, sessions, rate limiting, leaderboards, pub/sub |
| Examples | Redis, Memcached, DynamoDB (can be used this way) |

### Time-Series Databases

Optimised for data recorded over time: metrics, sensor readings, logs. The data model revolves around timestamps, and queries aggregate over time ranges. Examples: InfluxDB, TimescaleDB, Prometheus. Not covered in depth this week, but worth knowing they exist.

### Graph Databases

Optimised for data where relationships are as important as the data itself. Nodes represent entities; edges represent relationships. Used for social networks, recommendation engines, and fraud detection. Examples: Neo4j, Amazon Neptune. Not covered this week.

## The CAP Theorem

Distributed databases can guarantee at most two of three properties:

- **Consistency** — every read gets the latest write
- **Availability** — every request receives a response (not necessarily the latest data)
- **Partition tolerance** — the system keeps working despite network splits between nodes

Partition tolerance is not optional in practice — networks do fail. So the real trade-off is between consistency and availability when a partition occurs.

Relational databases typically prioritise CP (consistency and partition tolerance). Many NoSQL databases choose AP (availability and partition tolerance), accepting that reads may return slightly stale data.

## Choosing a Database

A practical decision guide:

- Need to query across multiple relationships? → Relational
- Data shape varies document to document? → Document
- Need sub-millisecond reads, caching, or ephemeral data? → Key-value
- Storing time-series metrics? → Time-series
- Complex relationships between entities matter more than the entities themselves? → Graph
- Default choice for a new project with unknown access patterns: **PostgreSQL**

Most production systems use more than one type. PostgreSQL for transactional data, Redis as a cache in front of it, and MongoDB for flexible content are a common combination.

## Key Concepts

| Term | Definition |
| ---- | ---------- |
| RDBMS | Relational Database Management System — the software that manages a relational database (e.g. PostgreSQL) |
| SQL | Structured Query Language — the standard language for querying relational databases |
| Schema | The defined structure of a table or database: column names, types, and constraints |
| Collection | The MongoDB equivalent of a table — a group of documents |
| Document | A JSON-like record stored in a document database |
| Key-value | The simplest database model: a unique key maps to a single value |
| ACID | Atomicity, Consistency, Isolation, Durability — the guarantees of a relational transaction |
| CAP theorem | A distributed systems theorem: a database can guarantee at most two of Consistency, Availability, and Partition tolerance |
| ORM | Object-Relational Mapper — a library that maps database rows to objects in code (e.g. SQLAlchemy, GORM, Entity Framework) |

## Tasks

- Research one real-world product that uses each database type and explain why it was chosen. For example: Instagram uses PostgreSQL; Redis is used for caching at almost every large web company; MongoDB is used by many content-heavy platforms. Look for engineering blog posts that explain the decision.

- Visit the documentation home pages for SQLite, PostgreSQL, MongoDB, and Redis. Find the "getting started" guide for each. Note how each one describes its data model differently. What does PostgreSQL call a database? What does MongoDB call the equivalent?

- Sketch on paper (or in a text file) a data model for a simple blog with posts, authors, comments, and tags. Think through:
  - How would you represent this in relational tables? What are the tables, primary keys, and foreign keys?
  - How would you represent a single post (with its author, comments, and tags) as a MongoDB document?
  - What data would you cache in Redis, and what TTL would be appropriate?

## Reading / Reference

- [PostgreSQL: About](https://www.postgresql.org/about/) — how PostgreSQL describes itself and its strengths
- [MongoDB: What is a Document Database?](https://www.mongodb.com/databases/document-database)
- [Redis: Data Types](https://redis.io/docs/data-types/) — the range of data structures Redis supports
- [Martin Fowler: NoSQL Distilled](https://martinfowler.com/books/nosql.html) — a concise summary of the NoSQL landscape
