# Round 8 — Muse and Claude in parallel; GPT review only after both merge

## Muse Spark 1.3 — R08-M — SQS worker

```text
Read AGENTS.md and reliability/worker specifications. Complete only R08-M. Branch muse/08-sqs-worker; one PR. Lease: NONE.

Writable paths only: apps/worker/**, packages/backend/src/reliability/sqs/**, packages/backend/src/providers/{expo,ses}/** only for consumer adapter wiring if already required, and apps/worker integration tests. Do not modify migrations, public contracts, feature UI, notification business module, root files, CI, or infrastructure.

Implement the thin worker composition root and SQS long-polling listener: bounded concurrency, 20-second polling, visibility timeout extension where needed, graceful shutdown, idempotent message-handler dispatch through inbox, retry classification, no infinite in-process retry, deletion only after durable success, and DLQ-compatible failure behavior. Preserve correlation/request IDs without logging sensitive payloads.

Wire existing scheduler/outbox/media seams without inventing payment or notification features. Handle duplicate and out-of-order messages safely. Readiness/liveness behavior must not depend on an endless successful poll during shutdown.

Use local SQS fakes/emulation already in the project; no live AWS. Test success, transient/permanent failure, timeout/visibility, crash/retry, duplicate delivery, malformed message, poison message after five receives, concurrent consumers, and shutdown. Run focused/repository checks and container tests if available. Open one PR with delivery semantics, test evidence, and operational limits.
```

## Claude — R08-C — worker adversarial tests and operations guide

```text
Read AGENTS.md and reliability/security specifications. Complete only R08-C. Branch claude/08-worker-tests; one PR. Lease: NONE.

Writable paths only: packages/testing/src/{aws,e2e}/**, packages/testing/test/worker/**, apps/worker/test/security/**, and docs/operations/worker.md. Do not modify production code, root config, infrastructure, or other features. Report defects instead of fixing them.

Add adversarial/integration tests for the Round 8 worker: duplicated/out-of-order events, poison messages, redrive to the same DLQ semantics, malformed payloads, oversized messages, unauthorized/unknown event types, visibility timeout races, lease expiry, retry storms, partial provider failure, and correlation/log redaction. Validate that business side effects occur at most once logically despite at-least-once delivery.

Write worker.md with queue/DLQ names from configuration, safe inspection/redrive procedure, alarm interpretation, recovery examples using synthetic IDs, rollback considerations, and explicit prohibitions on deleting unread DLQ messages or exposing payloads. No real credentials or production actions.

Run tests against disposable/local infrastructure and document any failures with severity and owner. Open one PR with test evidence and unresolved defects; do not claim exactly-once delivery.
```

## GPT 6.2 — R08-G — read-only integration review, after R08-M/C merge

```text
Perform a read-only review of latest main after R08-M and R08-C are merged. Do not create a branch, modify files, or open a code PR. Post findings to the R08-G GitHub issue and stop further rounds if you identify a critical/high defect.

Trace one job event from business transaction through outbox, scheduler, SQS, inbox, handler, provider adapter, and audit/failure paths. Review transaction boundaries, concurrency, idempotency, retry classification, DLQ/redrive, shutdown, media processing, and secrets/log handling. Verify tests exercise real claims rather than mocks that assume the desired result.

Classify each finding by severity, exact file/line, reproduction/evidence, affected invariant, and recommended owner. Separate confirmed defects from hypotheses and missing operational evidence. Also state what you verified and what remains untested. Original assignment owners must fix confirmed findings in focused PRs before Round 9.
```
