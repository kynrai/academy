# Weekend Challenges

## Extended Challenges
- **BuildKit and cache mounts**: Rewrite your Python Dockerfile using BuildKit cache mounts: `RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt`. Measure the speedup on a rebuild where only your source code changes (dependencies should be cached). Enable BuildKit with `DOCKER_BUILDKIT=1`.
- **Rootless Docker**: Research and configure rootless Docker (or Podman as a drop-in replacement). Run your Compose stack under rootless Docker. What limitations did you encounter? Why does rootless improve security?
- **Container networking deep dive**: Run `docker network inspect bridge` on a running container and find its IP. Then use `nsenter` or `docker exec` to run `netstat -tuln` inside the container. Map every listening port to the process that owns it.
- **Init systems in containers**: Add `tini` as a Docker init process (`ENTRYPOINT ["/tini", "--"]`) to your backend. Start the container, send a `SIGTERM`, and observe graceful shutdown. Compare to a container without an init process — what happens to zombie processes?
- **Multi-platform builds**: Build your image for both `linux/amd64` and `linux/arm64` using `docker buildx build --platform linux/amd64,linux/arm64 -t yourusername/app:multi .`. Push it to Docker Hub and pull it on a different architecture to verify.

## Recommended Reading
- [Docker Deep Dive by Nigel Poulton](https://nigelpoulton.com/books/) — a concise practical book covering all core concepts.
- [Container Security by Liz Rice](https://www.oreilly.com/library/view/container-security/9781492056690/) — Chapters 1–4 on container fundamentals and isolation.
- [OCI Image Specification](https://github.com/opencontainers/image-spec/blob/main/spec.md) — understand what a container image actually is at the layer level.
- [BuildKit documentation](https://docs.docker.com/build/buildkit/) — mount types, cache, and secrets.

## Reflection
- A container is not a VM — what kernel features (namespaces, cgroups) actually provide the isolation? What is a container NOT isolated from?
- Your Compose stack uses `depends_on: condition: service_healthy`. What would happen without this condition if the backend tried to connect to Postgres before it was ready?
- You pinned your base image to a specific digest. What is your update strategy? How would you know when a new version with security fixes is released?
- If a container is running as root and an attacker exploits a vulnerability in your application, what access do they gain? How does the non-root user you added change this?
- Docker Compose is excellent for local development. What does it NOT provide that you would need in production? (Think about: automatic restarts across machine reboots, scaling, rolling deploys, secret management.)
