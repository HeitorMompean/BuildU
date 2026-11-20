# File and infrastructure specification

Status: binding implementation manifest. No cloud resources have been provisioned. Do not invent account IDs, domains, credentials, package versions, or provider capabilities.

## 1. Names and required inputs

```text
Project prefix:       hs
Workspace packages:   @hs/*
Environments:         staging, production
API port:             8080
Admin port:           3000

Staging hosts:        api-staging.<domain>, admin-staging.<domain>, links-staging.<domain>
Production hosts:     api.<domain>, admin.<domain>, links.<domain>
```

Required human-supplied values:

```text
GitHub organization and repository
AWS staging and production account IDs, region, and monthly budget
Root domain and DNS control
Alert email addresses
Apple Team ID and iOS bundle identifiers
Android package names and Play App Signing/release SHA-256 fingerprints
Expo project ID
Maps/geocoding provider and credentials
Wix plan, site/app identity, payment provider, country, currency, and API evidence
Launch legal, financial, worker-verification, and retention policies
```

Use placeholders and validation for missing values. Never commit real secrets or hardcode example values as production facts.

## 2. Repository file manifest

The following are the canonical locations. Round assignments may create only their authorized subset.

### Root

```text
AGENTS.md
README.md
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
turbo.json
tsconfig.base.json
eslint.config.mjs
.prettierignore
.prettierrc.json
.editorconfig
.gitattributes
.gitignore
.dockerignore
.github/
  CODEOWNERS
  pull_request_template.md
  ISSUE_TEMPLATE/task.yml
  workflows/ci.yml
  workflows/contracts.yml
  workflows/security.yml
  workflows/infrastructure.yml
  workflows/release.yml
  workflows/rollback.yml
  workflows/mobile-build.yml
  workflows/mobile-submit.yml
  workflows/mobile-update.yml
  workflows/restore-drill.yml
docs/
  architecture/system-architecture.md
  architecture/data-and-api-spec.md
  architecture/file-and-infrastructure-spec.md
  product/pilot-scope.md
  security/threat-model.md
  operations/github-setup.md
  operations/configuration.md
  operations/deployment.md
  operations/payments.md
  rea/clean-room-plan.md
  spikes/wix/
  adr/
  prompts/
  tasks/rounds.md
scripts/
  db/
  deployment/
  verification/
```

### `apps/api` and `apps/worker`

```text
apps/api/
  package.json
  tsconfig.json
  Dockerfile
  src/main.ts
  src/app.module.ts
  src/config.ts
  src/health.controller.ts
  src/openapi.ts
  test/
apps/worker/
  package.json
  tsconfig.json
  Dockerfile
  src/main.ts
  src/worker.module.ts
  src/config.ts
  src/sqs-listener.ts
  src/message-handler.ts
  test/
```

Pre-register shared modules in the composition roots during scaffolding so later feature tasks do not all edit the same registration file. Controllers and business modules live in `packages/backend`.

### `packages/backend`

```text
packages/backend/
  package.json
  tsconfig.json
  src/index.ts
  src/config/
    configuration.ts
    validation.ts
  src/database/
    database.module.ts
    connection.ts
    transaction.ts
    types.generated.ts
    kysely-codegen.config.ts
    migrations/0001_*.ts ... 0023_*.ts
  src/common/
    errors/
    guards/
    decorators/
    interceptors/
    pagination/
    testing/
  src/providers/
    cognito/
    expo/
    ses/
    sentry/
    storage/
  src/reliability/
    outbox/
    inbox/
    idempotency/
    scheduling/
    sqs/
  src/modules/
    auth/{auth.module.ts,auth.service.ts,cognito-token.service.ts,permissions.guard.ts}
    identity/{identity.module.ts,identity.controller.ts,identity.service.ts,identity.repository.ts,dto/}
    catalog/{catalog.module.ts,catalog.controller.ts,catalog.service.ts,catalog.repository.ts,dto/}
    workers/{workers.module.ts,workers.controller.ts,workers.service.ts,workers.repository.ts,dto/}
    jobs/{jobs.module.ts,jobs.controller.ts,jobs.service.ts,jobs.repository.ts,dto/}
    matching/{matching.module.ts,matching.controller.ts,matching.service.ts,matching.repository.ts,ranking.service.ts,dto/}
    quotes/{quotes.module.ts,quotes.controller.ts,quotes.service.ts,quotes.repository.ts,dto/}
    bookings/{bookings.module.ts,bookings.controller.ts,bookings.service.ts,bookings.repository.ts,dto/}
    payments/{payments.module.ts,payments.controller.ts,payments.service.ts,payments.repository.ts,payment-provider.ts,wix/,dto/}
    ledger/{ledger.module.ts,ledger.service.ts,ledger.repository.ts,posting-rules.ts}
    payouts/{payouts.module.ts,payouts.controller.ts,payouts.service.ts,payouts.repository.ts,dto/}
    media/{media.module.ts,media.controller.ts,media.service.ts,media.repository.ts,media-processor.ts,dto/}
    notifications/{notifications.module.ts,notifications.controller.ts,notifications.service.ts,notifications.repository.ts,push.service.ts,email.service.ts,dto/}
    reviews/{reviews.module.ts,reviews.controller.ts,reviews.service.ts,reviews.repository.ts,dto/}
    disputes/{disputes.module.ts,disputes.controller.ts,disputes.service.ts,disputes.repository.ts,dto/}
    audit/{audit.module.ts,audit.service.ts,audit.repository.ts}
    operations/{operations.module.ts,operations.service.ts,reconciliation.service.ts,scheduler.service.ts}
  test/
```

A module exports only its public application services. Repositories are module-private. `payments/wix` is the only Wix-specific implementation; domain, mobile, and admin code use provider-neutral payment contracts.

### `packages/domain`, `packages/api-client`, and `packages/testing`

```text
packages/domain/
  package.json
  tsconfig.json
  src/index.ts
  src/common/{ids.ts,money.ts,time.ts,result.ts}
  src/identity/{roles.ts,permissions.ts}
  src/jobs/{job.ts,job-transitions.ts}
  src/matching/{eligibility.ts,ranking.ts}
  src/quotes/{quote.ts,quote-transitions.ts}
  src/bookings/{booking.ts,booking-transitions.ts}
  src/payments/{payment.ts,payment-transitions.ts}
  src/ledger/{posting.ts,balance.ts}
  src/payouts/{payout.ts,payout-transitions.ts}
  src/reviews/{review-eligibility.ts}
  src/disputes/{dispute-transitions.ts}
  test/
packages/api-client/
  package.json
  tsconfig.json
  openapi/openapi.json
  openapi/generate.ts
  src/generated/
  src/index.ts
  test/
packages/testing/
  package.json
  tsconfig.json
  src/fixtures/
  src/factories/
  src/auth/
  src/aws/
  src/wix/
  src/postgis/
  src/e2e/
  test/
  maestro/
  playwright/
```

### `apps/mobile`

```text
apps/mobile/
  package.json
  tsconfig.json
  app.json
  app.config.ts
  eas.json
  babel.config.js
  metro.config.js
  index.ts
  app/
    _layout.tsx
    index.tsx
    (auth)/{sign-in.tsx,verify.tsx,consent.tsx}
    (customer)/{_layout.tsx,home.tsx,jobs.tsx,jobs/[id].tsx,quotes/[id].tsx,bookings.tsx,bookings/[id].tsx,reviews/[bookingId].tsx}
    (customer)/jobs/new/{_layout.tsx,service.tsx,details.tsx,location.tsx,schedule.tsx,review.tsx}
    (worker)/{_layout.tsx,opportunities.tsx,opportunities/[id].tsx,quotes/new/[jobId].tsx,bookings.tsx,bookings/[id].tsx,profile.tsx}
    settings/{_layout.tsx,account.tsx,notifications.tsx,privacy.tsx}
    payments/{checkout.tsx,return.tsx}
  src/
    api/client.ts
    auth/{auth-provider.tsx,cognito.ts,storage.ts}
    config/env.ts
    design-system/
    features/{identity,catalog,jobs,matching,quotes,bookings,payments,notifications,reviews,disputes}/
    location/
    notifications/
    navigation/guards.ts
    sentry.ts
  assets/
  tests/
```

Routes are prewired in Round 4. Feature work fills route bodies and feature directories; it must not redesign navigation. Payment return handling is informational only.

### `apps/admin`

```text
apps/admin/
  package.json
  tsconfig.json
  next.config.ts
  Dockerfile
  src/
    app/
      layout.tsx
      page.tsx
      (auth)/sign-in/page.tsx
      (dashboard)/{layout.tsx,users/page.tsx,workers/page.tsx,jobs/page.tsx,quotes/page.tsx,media/page.tsx,reviews/page.tsx,disputes/page.tsx,payments/page.tsx,payments/[id]/page.tsx,payouts/page.tsx,audit/page.tsx}
      api/auth/[...cognito]/route.ts
      api/bff/[...path]/route.ts
      api/health/live/route.ts
      api/health/ready/route.ts
      .well-known/apple-app-site-association/route.ts
      .well-known/assetlinks.json/route.ts
      open/[...path]/route.ts
      payments/wix/return/route.ts
    components/
    features/
    server/{api.ts,auth.ts,permissions.ts,config.ts,audit-context.ts}
    styles/
  tests/
```

The `links` hostname routes to this same Next.js service. Do not add a separate links application or CloudFront stack. AASA and assetlinks are public, correct JSON, and contain no secrets. BFF routes never expose admin tokens to browser JavaScript.

### Scripts

```text
scripts/db/{migrate.ts,codegen.ts,seed-synthetic.ts,check-migrations.ts,restore-verify.ts}
scripts/deployment/{build-images.ts,record-digests.ts,deploy-ecs.ts,smoke-test.ts,rollback-ecs.ts}
scripts/verification/{check-generated.ts,check-boundaries.ts,check-secrets.ts}
```

Deployment scripts must be callable from GitHub Actions and locally with explicit environment selection. No script may silently apply Terraform, restore RDS, run down migrations, or execute real payouts.

## 3. AWS topology

Use separate staging and production accounts, each in one approved region. Each environment has its own state, VPC, ALB, ECS cluster, RDS, Cognito pools, buckets, queues, keys, secrets, and DNS records. No resource is shared across environments.

### Network

Two Availability Zones per environment:

| Environment | VPC | Public A/B | App A/B | Data A/B |
| --- | --- | --- | --- | --- |
| staging | `10.20.0.0/20` | `10.20.0.0/24`, `10.20.1.0/24` | `10.20.4.0/24`, `10.20.5.0/24` | `10.20.8.0/24`, `10.20.9.0/24` |
| production | `10.40.0.0/20` | `10.40.0.0/24`, `10.40.1.0/24` | `10.40.4.0/24`, `10.40.5.0/24` | `10.40.8.0/24`, `10.40.9.0/24` |

Public subnets contain only ALB and NAT gateways. ECS and RDS use private subnets. Staging starts with one NAT; production uses two, one per AZ. Always create an S3 gateway endpoint. Add interface endpoints only after cost/requirements review.

Security groups:

- ALB accepts TCP 443 from the internet and redirects TCP 80 to HTTPS.
- API tasks accept 8080 only from the ALB; admin tasks accept 3000 only from the ALB.
- Worker tasks have no inbound rule.
- RDS accepts 5432 only from runtime and migration security groups.
- Egress is limited to required AWS/provider endpoints. Do not use unrestricted egress without an approved reason.

### Edge routing

ACM certificates cover the three environment hostnames. Route 53 aliases point to the ALB. Host rules route API to API, and both admin and links to the admin target group. Health checks use the lightweight live endpoints. TLS policy and headers are set deliberately; admin responses include CSP, frame, referrer, and content-type protections.

## 4. Compute and data starting sizes

| Resource | Staging | Production |
| --- | --- | --- |
| API Fargate | 512 CPU / 1024 MiB, 1 task | 512 CPU / 1024 MiB, 2 tasks |
| Admin Fargate | 512 CPU / 1024 MiB, 1 task | 512 CPU / 1024 MiB, 2 tasks |
| Worker Fargate | 1024 CPU / 2048 MiB, 1 task | 1024 CPU / 2048 MiB, 1 task |
| RDS | PostgreSQL 16, Single-AZ | PostgreSQL 16, Multi-AZ |
| RDS storage | 20 GiB GP3, autoscale cap 100 GiB | 20 GiB GP3, autoscale cap 100 GiB |
| Backups | 7 days | 14 days |
| RDS access | Private only | Private only, deletion protection |

Confirm PostgreSQL/PostGIS and instance-class availability in the selected region before apply. Use cost-aware instance sizes selected by the human, not invented in the specification. Production RDS has deletion protection and a final-snapshot policy. Staging may omit deletion protection only with explicit approval.

Database roles are separate:

- master/bootstrap: account-managed initial setup only;
- migrator: DDL and migration execution from the standalone migration task;
- runtime: only required CRUD/execute permissions, no DDL;
- private-address/reporting access: only explicitly authorized operational reads.

Runtime cannot mutate ledger/audit history and cannot disable constraints. Migration credentials are not present in normal runtime task definitions.

## 5. Messaging and scheduling

Per environment:

```text
hs-<environment>-domain-jobs
hs-<environment>-domain-jobs-dlq
hs-<environment>-scheduler-dlq
```

- SQS standard queues; long polling 20 seconds.
- Initial visibility timeout 120 seconds, adjusted only from measured processing limits.
- Source retention four days; DLQ retention 14 days.
- `maxReceiveCount=5` before DLQ.
- EventBridge Scheduler emits a one-minute scheduler tick.
- PostgreSQL `scheduled_actions.due_at` remains authoritative.
- Consumers deduplicate by stable message/event identity and are safe under retries and out-of-order delivery.
- CloudWatch alarms cover oldest message, DLQ depth, failures, and scheduler misses.

## 6. Media

One private versioned S3 bucket per environment with blocked public access, encryption, lifecycle rules, and separate quarantine/processed prefixes. Uploads use random object keys and short-lived presigned uploads constrained by content length/type.

Initial limits: 10 MiB per asset; JPEG, PNG, or WebP. Detect actual bytes rather than trusting MIME. Strip EXIF/GPS metadata. Reject SVG, executables, polyglots where detectable, decompression bombs, and oversize images. Objects remain quarantined until processing/scanning completes. Only `ready` assets can receive short-lived authorized downloads. Deletion and retention follow the approved policy.

## 7. Identity, notifications, and configuration

- Separate Cognito customer/worker and admin user pools per environment.
- Admin self-sign-up disabled; admin TOTP MFA required.
- Token verification checks signature, issuer, client, expiry, and `token_use=access`.
- Customer/worker role assignment and admin permissions are also represented locally; clients cannot grant them.
- Expo push and SES credentials/configuration are environment-specific. SES starts in sandbox until production access is approved.
- Secrets Manager holds provider credentials, webhook secrets, database passwords, and signing material.
- SSM Parameter Store holds non-secret environment configuration. Do not put secrets in `NEXT_PUBLIC_*`, Expo extra fields, images, or Terraform state outputs.
- KMS keys and key policies are environment-scoped. Enable rotation where supported and avoid one globally shared key.

## 8. Terraform module manifest

```text
infra/terraform/
  versions.tf
  README.md
  modules/
    kms/{main.tf,variables.tf,outputs.tf}
    network/{main.tf,variables.tf,outputs.tf}
    edge/{main.tf,variables.tf,outputs.tf}
    ecr/{main.tf,variables.tf,outputs.tf}
    database/{main.tf,variables.tf,outputs.tf}
    messaging/{main.tf,variables.tf,outputs.tf}
    media/{main.tf,variables.tf,outputs.tf}
    auth/{main.tf,variables.tf,outputs.tf}
    ses/{main.tf,variables.tf,outputs.tf}
    config/{main.tf,variables.tf,outputs.tf}
    compute/{main.tf,variables.tf,outputs.tf}
    release_artifacts/{main.tf,variables.tf,outputs.tf}
    observability/{main.tf,variables.tf,outputs.tf}
  envs/
    staging/{main.tf,providers.tf,backend.tf,variables.tf,terraform.tfvars.example,outputs.tf}
    production/{main.tf,providers.tf,backend.tf,variables.tf,terraform.tfvars.example,outputs.tf}
  bootstrap/
    README.md
    staging/{main.tf,providers.tf,backend.tf,variables.tf,outputs.tf}
    production/{main.tf,providers.tf,backend.tf,variables.tf,outputs.tf}
```

Module responsibilities:

- `kms`: environment keys, aliases, rotation, scoped policies.
- `network`: VPC, subnets, routes, NAT, endpoints, security groups.
- `edge`: ALB, listeners, target groups, ACM, Route 53 records.
- `ecr`: API/admin/worker repositories, immutable digest use, scanning, lifecycle.
- `database`: RDS subnet group, parameter group, instance, monitoring, master secret.
- `messaging`: SQS queues/DLQs, redrive, scheduler role/tick.
- `media`: private buckets, policies, CORS limited to app origins where required, lifecycle.
- `auth`: both Cognito pools, clients, groups, MFA/sign-up policy.
- `ses`: identities/configuration sets and required DNS records.
- `config`: Secrets Manager/SSM resources without embedding secret values.
- `compute`: ECS cluster, task roles/execution roles, task definitions, services, scaling, log groups.
- `release_artifacts`: release records and image-digest metadata, protected by environment.
- `observability`: dashboards, alarms, metric filters, SNS alert destinations.

Environment roots compose modules. Bootstrap roots create only remote-state/locking and GitHub OIDC deployment roles. Terraform state is encrypted and non-public. Production applies require manual approval. Every PR runs fmt/validate/plan only for the authorized environment; no automated apply on pull request.

## 9. GitHub Actions and release

Workflow contracts:

- `ci.yml`: install frozen lockfile, lint, typecheck, unit/integration tests, builds, boundary checks.
- `contracts.yml`: regenerate OpenAPI/client and fail on an uncommitted diff or incompatible change.
- `security.yml`: dependency, secret, IaC, and container scans; no secret values in logs.
- `infrastructure.yml`: Terraform fmt/validate/plan; controlled apply only after approval.
- `release.yml`: build once, scan, record image digests, migrate, deploy staging, smoke test, production approval, promote identical digests.
- `rollback.yml`: deploy a previously recorded healthy image/task definition; never auto-restore RDS or run down migrations.
- `mobile-build.yml`: EAS native binaries after native/config changes.
- `mobile-submit.yml`: manually approved store submission.
- `mobile-update.yml`: signed/staged compatible OTA update only.
- `restore-drill.yml`: scheduled/manual isolated restore validation without replacing production.

Release order:

1. Build and scan API/admin/worker once; push by immutable digest and record provenance.
2. Deploy staging with the same digests.
3. Run one standalone ECS migration task using the API image and migrator role.
4. Deploy/stabilize services and run synthetic smoke tests.
5. Require human production approval.
6. Promote identical image digests, run the production standalone migration, then deploy services.
7. Record release, digests, migration version, commit SHA, and smoke results.

Prefer backward-compatible expand migrations before deployment and contract cleanup later. Rollback selects a known-good application release and verifies schema compatibility. Never automatically restore a database or reverse financial migrations.

## 10. Mobile delivery

`runtimeVersion` uses Expo fingerprint policy:

```json
{ "runtimeVersion": { "policy": "fingerprint" } }
```

Native dependency, permission, bundle, signing, or native configuration changes require new binaries. OTA updates must target a compatible runtime, use a staging channel first, and be signed where supported by the approved EAS configuration. Store submission and production OTA require human approval.

## 11. Observability and readiness

CloudWatch retains environment-appropriate logs with no secrets, tokens, exact addresses, or payment payloads. Record request/correlation IDs. Alarms cover ALB 5xx/latency, ECS unhealthy tasks/restarts, RDS storage/connections/CPU, SQS age/DLQ, media-processing failures, Cognito/integration errors where observable, Wix reconciliation lag, and failed scheduled actions.

Before production launch, test: staging restore drill, production backup/restore procedure, queue poison-message recovery, missed-webhook reconciliation, admin access revocation, mobile upgrade compatibility, application rollback, and budget alerting. Passing these checks is a human go/no-go decision, not an automatic deployment.
