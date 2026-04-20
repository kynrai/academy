# Day 1 – Docker Images and Dockerfiles

## Today's Focus
Understand Docker's core concepts — images, containers, and registries — and write your first Dockerfiles.

## Tasks
- Install Docker Desktop (or Docker Engine on Linux). Run `docker run hello-world` and read the output carefully — it explains exactly what Docker did to run that container.
- Pull and explore an image: `docker pull python:3.12-slim`. Run an interactive shell: `docker run -it python:3.12-slim bash`. Install a package inside, exit, and confirm it is gone after the container stops. Explain what this demonstrates about container ephemeral state.
- Write a `Dockerfile` for your Python CLI utility from Week 3. Start with `FROM python:3.12-slim`, copy your source, install dependencies with `pip install --no-cache-dir -r requirements.txt`, and set a `CMD`. Build it: `docker build -t week3-cli:latest .`.
- Run the container and pass a file into it using a bind mount: `docker run -v $(pwd)/data:/data week3-cli:latest /data/input.csv`. Verify the output appears in your local `data/` directory.
- Inspect the image layers: `docker history week3-cli:latest`. Identify which layer is largest. Change the order of `COPY` and `RUN` instructions to maximise layer caching — rebuild twice and observe the second build is faster.
- Tag the image and push to Docker Hub (create a free account if needed): `docker tag week3-cli:latest yourusername/week3-cli:0.1.0` then `docker push`.

## Reading / Reference
- [Docker Getting Started](https://docs.docker.com/get-started/) — Parts 1–3: orientation, containers, images.
- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/) — all instructions explained.
- [Docker Hub](https://hub.docker.com/) — browse official images to see real Dockerfile patterns.
