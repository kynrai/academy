# Day 1 – Capstone Architecture Design

## Today's Focus
Define your capstone architecture, make explicit design decisions, and document them before writing a line of code.

## Tasks
- Choose your capstone project: a multi-service application that combines at least three of the skills from the course (e.g. a task management API with a Python backend, TypeScript frontend, PostgreSQL database, Redis cache, and an AI-powered summarisation feature using the Anthropic API).
- Write an Architecture Decision Record (ADR) for each major decision: (1) language/runtime per service, (2) database choice and schema approach, (3) inter-service communication (sync REST vs async queue), (4) container orchestration (Compose for demo, Kubernetes for production). Each ADR should have: Context, Decision, Consequences.
- Draw a system diagram showing every service, their communication paths, the data stores, and the external APIs. Include the Kubernetes deployment perspective (pods, services, ingress) and the Docker Compose perspective (for local dev).
- Define the interfaces between services as API contracts before implementing them: write OpenAPI YAML stubs (or GraphQL schema stubs) for every endpoint. Agree on error response shapes and auth mechanisms.
- Create the repository structure: a mono-repo with one directory per service (`services/api/`, `services/worker/`, `services/frontend/`), shared `infra/` for Terraform and Kubernetes manifests, and a root-level `docker-compose.yml`.
- Write a project `README.md` that will guide a fresh developer from `git clone` to a running local stack in under 10 commands. Keep it as a checklist to fill in as you build.

## Reading / Reference
- [Documenting Architecture Decisions (Michael Nygard)](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) — the original ADR format.
- [The C4 Model for software architecture](https://c4model.com/) — a practical diagramming approach: Context, Containers, Components, Code.
- [Monorepo vs multi-repo](https://semaphoreci.com/blog/what-is-monorepo) — trade-offs for a capstone-scale project.
