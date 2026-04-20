# Day 4 – Docker Compose Orchestration

## Today's Focus
Write a Docker Compose file that orchestrates your full multi-service stack for local development.

## Tasks
- Write a `docker-compose.yml` that defines three services: `db` (PostgreSQL), `backend` (your Node/Python API), and `frontend` (nginx serving static files). Use service names as hostnames for inter-service communication.
- Configure `depends_on` with a health check condition: `db` service should have a `healthcheck` using `pg_isready`, and `backend` should use `condition: service_healthy` so it waits until Postgres is ready.
- Use a `.env` file for all secrets and configuration: `POSTGRES_PASSWORD`, `DB_NAME`, `API_PORT`. Reference them in `docker-compose.yml` with `${POSTGRES_PASSWORD}`. Never hard-code credentials in the Compose file.
- Add a `volumes` section for Postgres data persistence and a bind-mount overlay for your backend source code in development mode (so you can use `nodemon` or hot-reload without rebuilding the image).
- Define a development override: create `docker-compose.override.yml` that mounts source code and enables hot-reload. The base `docker-compose.yml` should be production-safe (no source mounts). Run with `docker compose up` (picks up the override automatically) and compare to `docker compose -f docker-compose.yml up` (production mode).
- Run `docker compose up -d`, then `docker compose logs -f backend` to tail logs. Run `docker compose ps` to see service health. Use `docker compose exec backend sh` to shell into the running backend container.

## Reading / Reference
- [Docker Compose file reference](https://docs.docker.com/compose/compose-file/).
- [Docker Compose: Networking](https://docs.docker.com/compose/networking/).
- [Docker Compose: Health checks](https://docs.docker.com/compose/compose-file/05-services/#healthcheck).
