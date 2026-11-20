# Bootstrap (R01-M)

Creates remote-state and GitHub OIDC roles only. Apply once per environment
with human approval before any env root is applied.

- S3 state bucket (versioned, encrypted, non-public) + DynamoDB lock table.
- GitHub OIDC provider + deployment role scoped to the exact org/repo/env.
- No application resources are created here.
