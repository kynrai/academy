# Day 3 – Docker Networking and Volumes

## Today's Focus
Understand Docker networking and volumes, then wire multiple containers together manually before moving to Compose.

## Tasks
- Create a user-defined bridge network: `docker network create app-net`. Run your PostgreSQL container on it: `docker run -d --name postgres --network app-net -e POSTGRES_PASSWORD=secret postgres:16-alpine`. Run your backend on the same network: `docker run -d --name backend --network app-net -e DB_HOST=postgres your-backend-image`. Verify the backend can reach postgres by name.
- Explore the difference between bridge, host, and none network modes: run a container in each mode, check `ip addr` inside, and explain what connectivity each mode provides.
- Create a named volume for PostgreSQL data: `docker volume create pgdata`, then mount it: `docker run -d -v pgdata:/var/lib/postgresql/data ...`. Stop the container, remove it, start a new one with the same volume, and verify your data persists.
- Distinguish bind mounts from named volumes: mount your source code as a bind mount for local development (so edits are immediately reflected without rebuilding) and use a named volume for database data. Write a comment explaining when to use each.
- Use `docker exec -it postgres psql -U postgres` to connect to the database running in the container. Run a simple SQL query. This proves the application inside the container is working correctly.
- Clean up: `docker stop $(docker ps -q)`, `docker rm $(docker ps -aq)`, `docker network prune`, `docker volume prune`. Note which data survived and which did not.

## Reading / Reference
- [Docker: Networking overview](https://docs.docker.com/network/).
- [Docker: Volumes](https://docs.docker.com/storage/volumes/).
- [Docker: Use bind mounts](https://docs.docker.com/storage/bind-mounts/).
