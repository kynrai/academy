# Day 4 – Terraform Modules and State

## Today's Focus
Organise Terraform with modules, manage remote state, and apply cost management practices.

## Tasks
- Refactor your Terraform into modules: create `modules/networking/` (VPC, subnets, IGW, NAT), `modules/ecs/` (cluster, task definition, service), and `modules/alb/` (ALB, target group, listener). Each module should have `variables.tf`, `main.tf`, and `outputs.tf`. Call them from a root `main.tf`.
- Configure remote Terraform state: create an S3 bucket and DynamoDB table for state locking. Add a `backend "s3"` block to your root module. Run `terraform init -migrate-state` to move local state to S3. Verify the `terraform.tfstate` is now in S3 and your local file is empty.
- Add resource tagging consistently: create a `locals.tf` with a `common_tags` map containing `Environment`, `Project`, `ManagedBy = "terraform"`. Apply this to every resource using `tags = local.common_tags`. Tagging enables cost allocation.
- Use the AWS Cost Explorer (or `aws ce get-cost-and-usage` CLI) to view the cost of resources you provisioned this week. Identify the most expensive component. Set up a billing alert: create a CloudWatch alarm that triggers when estimated charges exceed $5.
- Run `terraform plan` on your refactored code and confirm zero changes (pure refactor, no infrastructure changes). This validates your module extraction was correct.
- Write a `README.md` for each module documenting inputs, outputs, and an example usage block.

## Reading / Reference
- [Terraform: Modules](https://developer.hashicorp.com/terraform/language/modules).
- [Terraform: S3 backend](https://developer.hashicorp.com/terraform/language/settings/backends/s3).
- [AWS: AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/).
