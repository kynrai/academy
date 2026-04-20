# Weekend Challenges

## Extended Challenges
- **Auto Scaling**: Add an ECS Auto Scaling policy to your service: scale out when CPU utilisation exceeds 70%, scale in when it drops below 30%. Use `aws-application-autoscaling` resources in Terraform. Load test with `hey -n 10000 -c 100 http://<alb-dns>/health` (install `hey`) and watch ECS spin up new tasks.
- **HTTPS with ACM**: Provision an ACM (AWS Certificate Manager) certificate for a domain you own (or use a subdomain of a free DNS service). Add an HTTPS listener (443) to your ALB and redirect HTTP to HTTPS. Confirm `curl -v https://your-domain/health` shows a valid certificate.
- **Terraform workspace**: Use Terraform workspaces to maintain separate `dev` and `staging` environments from the same codebase: `terraform workspace new staging && terraform apply`. Confirm that `dev` and `staging` state files are separate. Discuss why workspaces alone are insufficient for strong environment isolation.
- **Infrastructure drift detection**: Manually change a resource in the AWS console (e.g. edit a security group rule). Run `terraform plan` and observe the detected drift. Understand what `terraform refresh` does and when to use `terraform import` for resources created outside Terraform.
- **Object storage**: Add an S3 bucket to your stack with: versioning enabled, server-side encryption (AES-256), public access blocked, and a lifecycle rule that transitions objects to Glacier after 90 days. Write a small script that uploads a file, reads it back, and deletes it.

## Recommended Reading
- [Terraform: Up and Running (3rd ed.) by Yevgeniy Brikman](https://www.terraformupandrunning.com/) — the definitive practical book on Terraform.
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) — the five pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization.
- [Cloud Native Patterns by Cornelia Davis](https://www.manning.com/books/cloud-native-patterns) — design patterns for cloud-native applications.
- [Pulumi vs Terraform](https://www.pulumi.com/docs/concepts/vs/terraform/) — an alternative IaC approach using real programming languages.

## Reflection
- Your entire infrastructure is defined in code. What are the operational benefits? What new risks does "infrastructure as code" introduce that didn't exist with manual provisioning?
- You granted your ECS task an IAM role with `s3:GetObject`. What happens if an attacker exploits your application container — what cloud resources can they now access? How does the principle of least privilege limit the blast radius?
- NAT Gateways are expensive. Why do you need them for instances in private subnets? What is the alternative for instances that only need to communicate with other AWS services (hint: VPC endpoints)?
- Terraform state contains sensitive values (like database passwords). What are the risks of storing state in an S3 bucket, and how do you mitigate them?
- You ran `terraform destroy` and rebuilt from scratch. How long did it take? What is your Recovery Time Objective (RTO) if your production environment were accidentally destroyed?
