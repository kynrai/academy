# Weekend Challenges

## Extended Challenges
- **Helm chart**: Package your Kubernetes manifests as a Helm chart (`helm create capstone`). Parameterise image tags, replica counts, resource limits, and environment-specific values in `values.yaml`. Create separate `values-dev.yaml` and `values-prod.yaml`. Deploy with `helm install capstone ./chart -f values-dev.yaml` and verify.
- **Horizontal Pod Autoscaler**: Add an HPA to your most traffic-sensitive deployment: `kubectl autoscale deployment api --cpu-percent=50 --min=2 --max=10`. Install the Kubernetes metrics server if not present. Load test with `hey` and watch `kubectl get hpa -w` as pods scale out and back in.
- **GitOps with ArgoCD**: Install ArgoCD in your cluster (`kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml`). Create an ArgoCD Application pointing at your Kubernetes manifests directory in your Git repo. Push a change and watch ArgoCD automatically sync the cluster. This is the GitOps pattern used in most modern production environments.
- **Observability stack**: Deploy a lightweight observability stack: Prometheus for metrics scraping, Grafana for dashboards. Add `/metrics` endpoints to your services using `prometheus-client` (Python) or `prom-client` (Node). Create a Grafana dashboard showing request rate, error rate, and latency (the RED method: Rate, Errors, Duration).
- **Chaos engineering**: Use `kubectl delete pod <pod-name>` to kill pods randomly while your load test is running. Confirm your application continues serving traffic (Kubernetes restarts the pod). Then kill both replicas simultaneously and observe the brief outage. Document the MTTR (Mean Time to Recovery).

## Recommended Reading
- [Kubernetes in Action (2nd ed.) by Marko Luksa](https://www.manning.com/books/kubernetes-in-action-second-edition) — the most thorough practical guide to Kubernetes.
- [Continuous Delivery by Jez Humble and David Farley](https://continuousdelivery.com/) — the book that defined modern CI/CD practices.
- [Site Reliability Engineering (Google)](https://sre.google/sre-book/table-of-contents/) — free online; chapters on Service Level Objectives, Error Budgets, and Incident Management are immediately applicable.
- [The Phoenix Project by Gene Kim](https://itrevolution.com/product/the-phoenix-project/) — a novel about DevOps transformation; read it to understand the organisational context your technical skills operate in.

## Reflection
- You built a multi-service containerised application in 10 weeks, starting from basic shell commands. What was the most difficult concept to internalise and why?
- Your CI pipeline enforces tests, linting, and security scanning before any code reaches production. What is the cost of this (slower iteration) and what is the benefit? Where is the right trade-off for a startup vs an enterprise?
- Kubernetes gives you self-healing, scaling, and rolling deployments. What are the operational costs of running Kubernetes yourself vs using a managed service (EKS, GKE)? At what team or traffic size does managed Kubernetes make financial sense?
- You used Terraform for infrastructure and Kubernetes manifests for workloads. What is the boundary between infrastructure-as-code and configuration management? Where does one end and the other begin?
- Looking back across all 10 weeks: which week's skills do you expect to use most often? Which tools do you want to go deeper on? Write a 6-month learning plan for yourself.
