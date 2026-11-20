# Round 1 — send these three prompts in parallel

## Muse Spark 1.3 — R01-M — foundation and infrastructure

```text
Work in the shared GitHub repository. Read AGENTS.md and all three documents under docs/architecture plus docs/product/pilot-scope.md. Complete only R01-M.

Create branch muse/01-foundation-infrastructure from latest main and one PR. You hold the ROOT + CONTRACTS leases for this scaffolding assignment. Do not commit to main or merge the PR.

Writable paths: root package/build/lint/workspace files and pnpm-lock.yaml; apps/mobile/**, apps/admin/**, apps/api/**, apps/worker/**; packages/backend/** except packages/backend/src/database/**, packages/domain/**, packages/api-client/**, packages/testing/** except packages/testing/postgis/**; infra/terraform/**; scripts/verification/**; .github/workflows/ci.yml and .github/CODEOWNERS. Do not create database files/migrations or implement feature business logic; those are reserved for the DB leaseholder.

Implement the minimal compilable monorepo exactly as documented. Select mutually compatible Node, TypeScript, Expo, Next.js, NestJS, Kysely, test, and Turborepo versions using official compatibility documentation, record the choices in the PR, install with pnpm, and commit the lockfile. Create thin API/worker composition roots, generated-client tooling, shared test harness, and prewired module/navigation registration. Keep shells small; later rounds implement features.

In the same assignment, implement the AWS infrastructure baseline in infra/terraform: bootstrap/state/OIDC, all modules and staging/production roots listed in file-and-infrastructure-spec.md. Include network, edge, ECR, database, messaging, media, auth, SES, config, compute, release_artifacts, and observability. Use variables for all unknown account/domain/mobile/provider values. Resources must be private, least-privilege, environment-separated, and cost-conscious. Do not apply Terraform, create real resources, or use credentials.

Checks: frozen install, lint, typecheck, unit smoke tests, builds; terraform fmt -check; backend=false init and validate for each environment/module where supported; verify no secret values. If a required tool is unavailable, report it rather than claiming validation. PR must include dependency decisions, file/lease scope, checks, and unresolved infrastructure inputs.
```

## GPT 6.2 — R01-G — architecture validation and REA boundary

```text
Read AGENTS.md, the architecture/product documents, and docs/rea/clean-room-plan.md. Complete only R01-G. Create branch gpt/01-architecture-validation from latest main and one PR. Lease: NONE.

Writable paths only: docs/adr/**, docs/architecture/validation-report.md, docs/rea/question-checklist.md, docs/rea/evidence-index.md, docs/rea/artifact-register.md. Do not edit code, infrastructure, root files, or canonical specifications.

Review the architecture for contradictions, missing ownership, race conditions, API/schema migration conflicts, security boundaries, deployment ordering, and mobile backward compatibility. Write ADRs for genuinely unresolved decisions, but do not redesign the accepted baseline or introduce new technologies. Produce a concise validation report with blockers versus non-blocking recommendations.

For REA, inspect only lawfully supplied local APK artifacts explicitly provided by the human. If none are present, record REA as unresolved and make no claims. Never bypass protections, copy code/assets, or treat static observations as runtime facts. Any findings must cite REA Evidence IDs and separate observed/inferred/unknown.

Run documentation consistency checks you can perform. Open one PR listing findings and remaining human decisions. Stop rather than inventing missing provider, business, or artifact facts.
```

## Claude — R01-C — security and privacy baseline

```text
Read AGENTS.md and all architecture/product documents. Complete only R01-C. Create branch claude/01-security-baseline from latest main and one PR. Lease: NONE.

Writable paths only: docs/security/** and docs/privacy/**. Do not modify code, infrastructure, prompts, contracts, or architecture.

Create threat-model.md covering customer, worker, admin, API, admin BFF, mobile, database, queue, media, Cognito, Wix, CI/CD, and manual payouts. Use concrete trust boundaries and abuse cases: token confusion, role escalation, IDOR, exact-location leakage, quote/booking races, forged payment returns, webhook replay, malicious media, notification-token theft, admin session risk, audit tampering, and financial duplicate settlement. Map each threat to planned controls and future verification rounds.

Create privacy-data-map.md classifying identity, precise location, media, device tokens, payment metadata, logs, analytics, backups, and retention/deletion ownership. Create security-acceptance-tests.md with testable requirements, without implementing tests yet. Do not assert that Wix supports any unproven capability and do not request or embed secrets.

Open one PR with scope, assumptions, documentation checks, and unresolved legal/privacy policy inputs.
```
