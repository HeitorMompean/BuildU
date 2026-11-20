# Terraform baseline (R01-M)

Environment-separated staging/production roots compose reusable modules.
Bootstrap roots create remote state (S3 + DynamoDB lock) and GitHub OIDC roles only.

- No `terraform apply` has been run; no real resources exist.
- All unknown account/domain/mobile/provider values are variables (see `envs/*/variables.tf`).
- State is encrypted; production requires manual approval in CI.
- Run `terraform fmt -check -recursive`, then per root `terraform init -backend=false && terraform validate`.
