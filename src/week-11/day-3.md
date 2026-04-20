# Day 3 – Kubernetes Deployment

## Today's Focus
Deploy the full project stack to Kubernetes: write manifests for all services, configure environment, and validate the deployment.

## Tasks
- Set up a local Kubernetes cluster with `minikube start` or `kind create cluster`. Confirm `kubectl cluster-info` shows a healthy cluster and `kubectl get nodes` shows the node ready.
- Write Kubernetes manifests for each service: a `Deployment` with `replicas: 2`, a `Service` (ClusterIP for internal, LoadBalancer/NodePort for externally accessible services), and `ConfigMap` and `Secret` resources for configuration and credentials.
- Write a `kustomization.yaml` in `infra/k8s/base/` that references all manifests. Create an `infra/k8s/overlays/local/` overlay that patches resource limits and replica counts for local development. Apply with `kubectl apply -k infra/k8s/overlays/local/`.
- Configure resource requests and limits for every container: `requests.cpu: "100m"`, `requests.memory: "128Mi"`, `limits.cpu: "500m"`, `limits.memory: "512Mi"`. Explain why requests and limits should not be identical and what happens when a container exceeds its memory limit.
- Add a `readinessProbe` and `livenessProbe` to every deployment using your `/health` endpoints. Watch `kubectl get pods -w` as you apply — observe pods cycling through `ContainerCreating`, `Running`, and becoming `Ready`.
- Confirm the application works end-to-end in Kubernetes: use `kubectl port-forward service/api 8080:8080` and `curl http://localhost:8080/` to verify.

## Reading / Reference
- [Kubernetes Basics tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/).
- [Kustomize documentation](https://kubectl.docs.kubernetes.io/guides/introduction/kustomize/).
- [Kubernetes: Configure Liveness, Readiness and Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).
