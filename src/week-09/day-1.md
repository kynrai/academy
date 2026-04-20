# Day 1 – Cloud Primitives and Terraform

## Today's Focus
Understand cloud service models and core primitives, then provision your first cloud resources with Terraform.

## Tasks
- Map the three service models to concrete examples: IaaS (you manage the OS — e.g. EC2, GCE VM), PaaS (provider manages runtime — e.g. Cloud Run, Elastic Beanstalk), managed services (fully abstracted — e.g. RDS, S3). For each model, write the tradeoff in terms of control vs operational burden.
- Install Terraform and the AWS CLI (or GCP/Azure equivalent). Configure credentials: `aws configure` sets `~/.aws/credentials`. Run `aws sts get-caller-identity` to confirm authentication. Never hard-code credentials in Terraform files — use environment variables or credential files.
- Write a minimal `main.tf` that provisions a VPC with a CIDR block, one public subnet, and an internet gateway. Run `terraform init`, `terraform plan`, and `terraform apply`. Read the plan output carefully before applying.
- Inspect `terraform.tfstate`: find your VPC resource and its attributes. Understand why this file must be stored remotely (S3 + DynamoDB lock) in a team environment — add a `backend` block to your config but comment it out for now.
- Add a `variables.tf` with `variable "region"`, `variable "env_name"`, and `variable "cidr_block"`. Move all hard-coded values out of `main.tf` into these variables. Create a `terraform.tfvars` file for your values and add it to `.gitignore`.
- Run `terraform destroy` and verify all resources were removed. Confirm in the AWS console that nothing was left behind.

## Reading / Reference
- [Terraform: Get Started with AWS](https://developer.hashicorp.com/terraform/tutorials/aws-get-started) — official tutorial series.
- [Terraform Language Documentation](https://developer.hashicorp.com/terraform/language) — Resources, Variables, Outputs.
- [AWS: VPC concepts](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html).
