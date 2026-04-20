# Day 2 – Multi-Stage Builds and Security

## Today's Focus
Write multi-stage Dockerfiles to produce lean production images, and containerise your frontend and backend services.

## Tasks
- Write a multi-stage Dockerfile for your TypeScript/Node.js backend from Week 4: Stage 1 (`FROM node:20 AS builder`) installs all deps and runs `npm run build`. Stage 2 (`FROM node:20-alpine AS runtime`) copies only the compiled `dist/` and production `node_modules`. Measure the image size difference: `docker images`.
- Write a Dockerfile for a simple static frontend (your HTML/JS from Week 2): use `FROM nginx:alpine`, copy the `dist/` folder to `/usr/share/nginx/html`, and expose port 80.
- For your backend, add a non-root user in the Dockerfile: `RUN addgroup -S app && adduser -S app -G app`, then `USER app`. Run `docker exec <container> whoami` to confirm. Explain why running as root in a container is a security risk.
- Add a `.dockerignore` file to each service: exclude `node_modules/`, `.git/`, `*.test.ts`, `coverage/`, and `.env`. Build again and verify the context size shrinks (visible in the `docker build` output line "Sending build context...").
- Use `ARG` and `ENV` in your Dockerfile: define `ARG NODE_ENV=production` and `ENV PORT=8080`. Override the ARG at build time: `docker build --build-arg NODE_ENV=development .`.
- Run both containers and confirm they start without errors. Check logs with `docker logs <container>` and resource usage with `docker stats`.

## Reading / Reference
- [Docker: Multi-stage builds](https://docs.docker.com/build/building/multi-stage/).
- [Docker security best practices](https://docs.docker.com/develop/security-best-practices/).
- [.dockerignore reference](https://docs.docker.com/reference/dockerfile/#dockerignore-file).
