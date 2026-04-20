# Day 2 – Networking IAM and Load Balancers

## Today's Focus
Build out your cloud network: subnets, security groups, load balancers, and IAM roles with least privilege.

## Tasks
- Extend your Terraform config with a private subnet (no direct internet access) alongside your public subnet. Add a NAT Gateway in the public subnet so instances in the private subnet can reach the internet for package installs.
- Define security groups as code: a `web-sg` that allows inbound `80` and `443` from `0.0.0.0/0`, and an `app-sg` that allows inbound on your app port only from the `web-sg` CIDR. Deny all other inbound traffic. Confirm your rules in the AWS console after `terraform apply`.
- Create an IAM role for an EC2 instance (or Cloud Run service account) with the principle of least privilege: allow `s3:GetObject` and `s3:PutObject` on a specific bucket ARN, and nothing else. Attach the role to your compute resource. Verify the instance can read from S3 but is denied `s3:DeleteObject`.
- Write an IAM policy document in Terraform using a `data "aws_iam_policy_document"` block (not inline JSON). Explain why using data sources for policies is preferable to `jsonencode()` or raw JSON strings.
- Provision an Application Load Balancer (ALB) in the public subnet. Create a target group and a listener on port 80 that forwards to the target group. Leave the targets empty for now — you will attach your app tomorrow.
- Add `outputs.tf` that outputs the ALB DNS name, VPC ID, and subnet IDs. Run `terraform output` after apply and use those values in the next task.

## Reading / Reference
- [AWS: Security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html).
- [Terraform: AWS IAM role and policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role).
- [AWS: IAM policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html).
