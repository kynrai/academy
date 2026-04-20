# Day 5 – Infrastructure Reproducibility

## Today's Focus
Validate that your infrastructure is fully reproducible from code, then tear down and redeploy cleanly.

## Tasks
- Delete everything manually in the AWS console (or via `terraform destroy`). Clear your local state. Then provision the entire stack from scratch using only your Terraform code: `terraform init && terraform apply -auto-approve`. Time how long a full redeploy takes.
- Confirm the redeployed environment is identical to the original: same ALB DNS (it will differ since it is a new ALB — that is expected), same application behaviour, same log output. The important test is that nothing required manual steps.
- Write a `RUNBOOK.md` documenting: prerequisites (AWS credentials, Terraform version, Docker), the exact commands to bootstrap from zero, the commands to deploy a new image version, and the commands to destroy everything. Have a classmate follow your runbook on their machine.
- Add `terraform validate` and `terraform fmt -check` to your `Makefile` as a `lint` target. Run `tflint` (install separately) for additional static analysis. Fix any warnings.
- Review IAM permissions: run the AWS IAM Access Analyzer or manually review every policy you created. Can any be tightened further? Remove any `*` wildcards that are not strictly necessary.
- Calculate your week's AWS bill. Is it within your budget? Identify one change that would reduce cost (e.g. NAT Gateway alternatives, Fargate Spot capacity, smaller container sizes).

## Reading / Reference
- [Terraform: `terraform destroy`](https://developer.hashicorp.com/terraform/cli/commands/destroy).
- [tflint documentation](https://github.com/terraform-linters/tflint).
- [AWS IAM Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html).
