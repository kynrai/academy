# Day 5 – Image Optimisation and Hardening

## Today's Focus
Optimise image size and startup time, and apply container security best practices.

## Tasks
- Audit your current images with `docker scout quickview` (or `trivy image your-image:latest` if Trivy is installed). Count the number of CVEs. Switch your base image from `python:3.12` to `python:3.12-slim` or `gcr.io/distroless/python3` and rescan. Record the reduction in vulnerabilities.
- Minimise layer count: combine multiple `RUN` commands into one using `&&` and clean up package manager caches in the same layer (`apt-get clean && rm -rf /var/lib/apt/lists/*`). Compare image sizes before and after.
- Add a `HEALTHCHECK` instruction to your backend Dockerfile: `HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost:8080/health || exit 1`. Run the container and watch `docker ps` to see the health status change from `starting` to `healthy`.
- Pin your base image to a specific digest for deterministic builds: `FROM python:3.12-slim@sha256:<digest>`. Get the digest with `docker inspect python:3.12-slim | grep Id`. Explain why using `:latest` is risky in production.
- Measure container startup time: run `time docker run --rm your-image echo hi`. Identify what makes startup slow (large image, slow init process) and fix one issue.
- Write a short `DOCKER.md` documenting: how to build, how to run locally, available environment variables, the Compose workflow, and how to run tests inside the container.

## Reading / Reference
- [Docker: Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/).
- [Trivy documentation](https://trivy.dev/latest/docs/) — Container Image scanning.
- [Chainguard images](https://www.chainguard.dev/chainguard-images) — distroless-style minimal secure images for various runtimes.
