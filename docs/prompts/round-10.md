# Round 10 — Muse and Claude in parallel; GPT review only after both merge

## Muse Spark 1.3 — R10-M — containers and release baseline

```text
Read AGENTS.md and release sections of file-and-infrastructure-spec.md. Complete only R10-M. Branch muse/10-release-baseline; one PR. Lease: ROOT.

Writable paths only: app Dockerfiles and .dockerignore, .github/workflows/{release.yml,rollback.yml,mobile-build.yml,mobile-submit.yml,mobile-update.yml,restore-drill.yml}, scripts/deployment/**, infra/terraform/modules/release_artifacts/**, infra/terraform/modules/compute/** only for required release integration, and docs/operations/deployment.md. Do not change business features, contracts, schema, or mobile dependencies.

Implement non-root production containers with deterministic frozen installs, health checks, small attack surface, and correct API/admin/worker start commands. Implement build-once/promote-by-digest release workflows, image scanning/provenance, release records, one standalone ECS migration task, staging smoke gate, manual production approval, and identical-digest promotion. Rollback redeploys a known-good release only after schema compatibility check; never run down migrations or restore RDS automatically.

Implement manually approved EAS build/submit/update workflows using fingerprint runtime policy, protected environments, staged OTA, and signing where supported. Restore drill must target isolated resources and never replace production. Use GitHub OIDC and no long-lived keys.

Run container builds, smoke tests, action/static validation, and local script tests available without credentials. No apply/deploy/store submission. Open one PR with exact checks, required GitHub environment approvals, rollback limitations, and unverified cloud steps.
```

## Claude — R10-C — non-payment end-to-end suite

```text
Read AGENTS.md, product acceptance scenario, and security tests. Complete only R10-C. Branch claude/10-nonpayment-e2e; one PR. Lease: NONE.

Writable paths only: packages/testing/{src,maestro,playwright,test}/**, apps/mobile/tests/e2e/**, apps/admin/tests/e2e/**, and docs/operations/nonpayment-e2e.md. Do not modify production code, workflows, contracts, schema, or dependencies. Report defects rather than fixing them.

Implement reproducible synthetic E2E coverage: customer/worker/admin sign-in with test identity seams, worker verification, customer fence request, geo/eligibility matching, opportunity acceptance, quote submission, one concurrent quote acceptance, booking scheduling/start/completion, media privacy, notifications with fake providers, review/dispute, admin audit, account/logout/permission revocation, and mobile/admin accessibility smoke checks.

Cover failure paths: duplicate taps/retries, expired quote, worker suspension mid-flow, wrong-owner deep links, token expiry, service restart/retry, queue duplicates/DLQ recovery, and exact-location visibility. No real external services or customer data. Clearly label mocked-provider boundaries and do not claim payment coverage.

Run all available local E2E/integration suites and record environment/setup plus results. Open one PR with reproducible commands, tested/uncovered behavior, and defect list for original owners. Critical/high defects block release progression.
```

## GPT 6.2 — R10-G — non-payment release review, after R10-M/C merge

```text
Perform a read-only release review of latest main after R10-M and R10-C merge. Do not edit files or create a code PR. Post findings to the R10-G issue.

Review the complete non-payment system and release chain: domain invariants, ownership/auth, PostGIS matching, quote/booking concurrency, media, notification delivery, outbox/SQS failure recovery, admin permissions, audit, container health, migrations, image-digest promotion, mobile runtime compatibility, rollback, backup/restore, and observability. Check that CI/E2E tests actually cover these claims.

Report findings with severity, exact file/line or reproducible scenario, evidence, affected invariant, and recommended owner. Separate confirmed defects from untested assumptions. Give a non-payment go/no-go recommendation only; this is not payment approval and not production authorization. Original owners fix findings before Round 11.
```
