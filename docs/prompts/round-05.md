# Round 5 — send in parallel after Round 4 is merged and green

## GPT 6.2 — R05-G — identity, catalog, workers, and jobs backend

```text
Read AGENTS.md and architecture/data/API specifications. Complete only R05-G. Branch gpt/05-core-backend; one PR. Lease: NONE.

Writable paths only: service/repository/module files and tests under packages/backend/src/modules/{identity,catalog,workers,jobs}/**. Do not change controllers/DTOs, domain, migrations/generated types, other modules, root files, or UI.

Implement the existing non-payment contracts using the established database and domain APIs: local identity/consent/account lifecycle; versioned catalog; worker profile, skills, service areas, availability, verification; and customer job creation/edit/cancel/detail/list. Preserve exact-location privacy and do not expose precise customer coordinates to unmatched workers.

Use ownership and role checks at the service boundary, transactions for multi-write operations, optimistic versions/row locks for races, and safe audit/outbox seams available in the codebase. Do not create matching, quote, booking, media, or payment behavior. Validate catalog requirement schemas and worker eligibility with deterministic domain calls.

Add real PostGIS integration tests for repositories and unit tests for services: authorization/ownership, invalid state, versioning, concurrent edits/cancellation, geo service areas, schedule validation, and private-field serialization. Run focused and repository checks. Open one PR with behavior, tests, transaction decisions, and blockers; do not modify contracts to conceal a mismatch.
```

## Muse Spark 1.3 — R05-M — customer request mobile flow

```text
Read AGENTS.md and the existing generated API client/routes. Complete only R05-M. Branch muse/05-customer-requests; one PR. Lease: NONE.

Writable paths only: apps/mobile/app/(customer)/** and apps/mobile/src/features/{identity,catalog,jobs}/**. Do not edit navigation shells outside these paths, API client/contracts, backend, dependencies, or worker/payment features.

Implement the customer flow: service catalog browsing, multi-step job draft, dynamic catalog questions, description, desired schedule, location permission and map/geocoding seam, review, submit, job list/detail, edit while allowed, and cancellation. Use the generated client and preserve API idempotency keys across retries. No offline mutation queue.

Obtain foreground location only after clear user action; also support manual address/pin entry through the configured provider. Never request background location. Keep precise location private in logs/analytics and show only authorized data. Media selection may use the existing contract seam but do not implement backend upload behavior.

Add component/integration tests with mocked client for validation, draft navigation, duplicate-submit prevention, denial of location permission, API errors, cancellation, and accessibility states. Run mobile checks and relevant Maestro flows without live services. Open one PR with UI/test evidence and unresolved map-provider configuration.
```

## Claude — R05-C — user, worker, and request administration

```text
Read AGENTS.md and the generated API client/admin shell. Complete only R05-C. Branch claude/05-request-admin; one PR. Lease: NONE.

Writable paths only: apps/admin/src/app/(dashboard)/{users,workers,jobs}/**, apps/admin/src/components/{users,workers,jobs}/**, apps/admin/src/features/{users,workers,jobs}/**, and corresponding apps/admin/tests/**. Do not edit BFF allowlist outside the routes required for these resources, contracts, backend, root files, or other admin features. If the central BFF file must change, you may add only these exact resource routes.

Implement admin list/detail views for users, worker verification, and jobs using typed APIs and server-side permission enforcement. Add safe filters/cursor pagination, verification approve/reject/suspend forms with reason and confirmation, account status display, and job moderation only where the API permits. Never rely on hidden buttons as authorization.

Avoid displaying exact customer location unless the current admin permission and API response explicitly allow it. Audit context and error states must not leak sensitive payloads. Add Playwright/component/server tests for allowed/denied permissions, validation, duplicate submission, and privacy-safe rendering.

Run admin lint, typecheck, tests, and build. Open one PR with checks, security notes, and any missing API capability reported as a blocker rather than invented locally.
```
