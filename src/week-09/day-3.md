# Day 3 – Deploy Containers to ECS

## Today's Focus
Deploy your containerised application to a managed container service (ECS Fargate or Cloud Run) and connect it to the load balancer.

## Tasks
- Push your Docker image from Week 7 to ECR (Elastic Container Registry) or GCR: create the registry with Terraform (`aws_ecr_repository`), authenticate Docker with `aws ecr get-login-password | docker login`, tag your image with the registry URI, and push.
- Write a Terraform ECS Fargate task definition: specify the container image (ECR URI), CPU and memory, environment variables (from a `aws_secretsmanager_secret_version` or SSM parameter — not hard-coded), and the IAM task execution role.
- Create an ECS Service that runs 2 instances of your task, attached to your VPC's private subnet, with the `app-sg` security group. Register the service with the ALB target group from Tuesday.
- Wait for the deployment to stabilise: `aws ecs describe-services --cluster your-cluster --services your-service` should show `runningCount: 2`. Then `curl http://<alb-dns>/health` should return `{"status": "ok"}`.
- Simulate a deployment: update your Docker image (change a response message), push a new tag, update the task definition image tag in Terraform, and `terraform apply`. Watch ECS perform a rolling update — old tasks drain before new ones are registered.
- Enable container logging: add a `logConfiguration` block pointing to CloudWatch Logs. After the deployment, find your container logs in the AWS console and confirm application startup messages appear.

## Reading / Reference
- [AWS ECS documentation: Fargate launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html).
- [Terraform: aws_ecs_task_definition](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition).
- [AWS: Storing secrets with SSM Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html).
