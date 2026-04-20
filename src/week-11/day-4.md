# Day 4 – CI/CD Pipeline

## Today's Focus
Build a CI/CD pipeline that automatically builds, tests, and pushes container images on every push.

## Tasks
- Create a GitHub Actions workflow file at `.github/workflows/ci.yml`. On every push to any branch: (1) run all unit tests for each service using `docker compose run --rm <service> <test-command>`, (2) build Docker images, (3) run `docker scout` or `trivy` to scan images for critical CVEs, (4) fail the build if any critical vulnerability is found.
- Add a CD job that triggers only on push to `main`: (1) log in to your container registry (Docker Hub or ECR using OIDC, not static credentials), (2) build and push images tagged with both `latest` and the Git SHA (`${{ github.sha }}`), (3) update the Kubernetes deployment image tag using `kubectl set image` or a Kustomize image transformer.
- Store secrets in GitHub Actions Secrets (not in workflow files): `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `ANTHROPIC_API_KEY`. Reference them as `${{ secrets.DOCKERHUB_TOKEN }}`. Confirm they are masked in workflow logs.
- Add a matrix build step: run tests against two versions of your runtime (e.g. Python 3.11 and 3.12, or Node 20 and 22) to catch version-specific issues.
- Add a `lint` job that runs `ruff`/`eslint`, `mypy`/`tsc --noEmit`, and `terraform fmt -check` in parallel. The CI pipeline should require all jobs to pass before merging is allowed — configure this as a branch protection rule on `main`.
- View the Actions workflow run in the GitHub UI. Understand the job dependency graph. Calculate the total pipeline time and identify the slowest step. Add Docker layer caching using `actions/cache` or `docker/build-push-action`'s built-in cache to speed it up.

## Reading / Reference
- [GitHub Actions documentation](https://docs.github.com/en/actions).
- [Docker: Build and push Docker images action](https://github.com/docker/build-push-action).
- [GitHub: Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).
