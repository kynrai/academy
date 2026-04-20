# Day 2 – Dockerfiles and Compose Stack

## Today's Focus
Write Dockerfiles for all services and a Docker Compose file that brings the full local stack up in one command.

## Tasks
- Write production-quality Dockerfiles for each service: use multi-stage builds, non-root users, pinned base image digests, `.dockerignore` files, and `HEALTHCHECK` instructions. Apply every best practice from Week 7.
- Write `docker-compose.yml` for the full stack: all services, a PostgreSQL database, a Redis instance, and any other dependencies. Configure health checks with `condition: service_healthy` so services start in the correct order.
- Add a `docker-compose.override.yml` for development: bind-mount source code for hot-reload in each service, expose extra ports for debuggers, and set `DEBUG=true` environment variables.
- Write a `Makefile` at the repo root with targets: `make up` (start all services), `make down` (stop and remove), `make build` (build all images), `make logs` (tail all logs), `make test` (run all service tests inside containers using `docker compose run`).
- Verify the full stack from a cold start: run `make build && make up` with no cached layers. Confirm every service reaches `healthy` status and you can call the API via `curl http://localhost:8080/health`.
- Document the local development workflow in `README.md`: what `make up` does, how to add a new service, how to tail a specific service's logs, and how to run a one-off command inside a container.

## Reading / Reference
- Docker Compose docs: [Startup order](https://docs.docker.com/compose/startup-order/).
- [Docker Compose: Override files](https://docs.docker.com/compose/multiple-compose-files/merge/).
- [Makefile tutorial](https://makefiletutorial.com/) — a practical reference for Makefile syntax.
