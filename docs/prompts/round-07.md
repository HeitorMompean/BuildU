# Round 7 — send in parallel after Round 6 is merged and green

## GPT 6.2 — R07-G — outbox, inbox, idempotency, and scheduler

```text
Read AGENTS.md and reliability/data specifications. Complete only R07-G. Branch gpt/07-reliability; one PR. Lease: DB.

Writable paths only: packages/backend/src/reliability/**, packages/backend/src/modules/operations/{operations.module.ts,operations.service.ts,scheduler.service.ts}, packages/backend/src/database/migrations/0017_*.ts and 0018_*.ts, generated DB types/codegen output, scripts/db/**, and corresponding tests. Do not change earlier migrations, controllers/contracts, SQS listener/composition root, feature UI, root files, or infrastructure.

Implement transactional outbox persistence, due scheduled_actions scanning, inbox consumer dedupe, request idempotency with payload fingerprint and safe stored response, lease/attempt/expiry handling, and clock-injected scheduler logic. due_at in PostgreSQL is authoritative; EventBridge only triggers scans. Integrate available feature seams without changing public contracts.

Define correct behavior for transaction rollback, process crash after claim, duplicate delivery, out-of-order events, expired leases, idempotency key reuse with same/different payloads, response replay, poison messages, and multiple scheduler instances. Do not implement provider notification/payment side effects.

Use real PostgreSQL tests with concurrency and crash/retry simulations. Verify migrations from a fresh database and from Round 6 schema, generated-type determinism, and runtime/migrator separation. Run focused/repository checks. Open one PR with delivery semantics (at-least-once, not exactly-once), locking choices, test evidence, and worker integration instructions.
```

## Muse Spark 1.3 — R07-M — worker opportunity and quote mobile flow

```text
Read AGENTS.md and existing generated client/routes. Complete only R07-M. Branch muse/07-worker-mobile; one PR. Lease: NONE.

Writable paths only: apps/mobile/app/(worker)/** and apps/mobile/src/features/{matching,quotes,bookings,workers}/**. Do not edit customer routes, shared navigation registration, contracts, backend, root files, or dependencies.

Implement worker profile/service-area/availability editing, opportunity list/detail, accept/decline, quote creation with line items and exact minor-unit totals, quote status/expiry display, assigned booking list/detail, and authorized start/complete/cancel actions. Use the generated client, idempotency, version/conflict handling, and accessible confirmation states.

Show only coarse job location before assignment and precise service location only when the API authorizes it. Do not add background tracking. Format money with integer minor units and currency, never binary floating point. Prevent duplicate submissions without hiding retryable errors.

Add mocked-client tests for eligibility/verification denial, opportunity races, expired/withdrawn quotes, line-item totals, double acceptance/submission, conflicts, unauthorized booking transitions, and location privacy. Run mobile lint/typecheck/tests and relevant Maestro flows. Open one PR with UI evidence, checks, and unresolved backend defects.
```

## Claude — R07-C — quote and media administration

```text
Read AGENTS.md and the current admin/API capabilities. Complete only R07-C. Branch claude/07-quote-media-admin; one PR. Lease: NONE.

Writable paths only: apps/admin/src/app/(dashboard)/{quotes,media}/**, apps/admin/src/components/{quotes,media}/**, apps/admin/src/features/{quotes,media}/**, corresponding apps/admin/tests/**, and only quote/media additions to the central BFF allowlist. Do not change contracts, backend, schema, root files, or other features.

Implement quote list/detail and status/history views with exact money formatting, plus private media moderation queue/detail, preview only for authorized ready assets, approve/reject actions supported by the API, and audit-visible reasons. Do not expose presigned URLs to unauthorized users or treat media URLs as permanent public assets.

Add server permission checks, bounded pagination, safe error states, confirmation for moderation, and no sensitive payload logging. If a required moderation endpoint does not exist, report the contract blocker rather than calling S3 directly or inventing a route.

Add Playwright/component/server tests for role/permission denial, quote amounts/currency, expired/superseded states, quarantine/rejected media denial, URL expiry handling, and repeated moderation. Run admin checks/build. Open one PR with checks and any API blockers.
```
