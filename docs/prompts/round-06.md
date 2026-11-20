# Round 6 — send in parallel after Round 5 is merged and green

## GPT 6.2 — R06-G — matching, quotes, and booking transactions

```text
Read AGENTS.md, domain rules, and API/data specifications. Complete only R06-G. Branch gpt/06-matching-quotes; one PR. Lease: NONE.

Writable paths only: service/repository/module/ranking files and tests under packages/backend/src/modules/{matching,quotes,bookings}/**. Do not edit controllers/DTOs, domain, migrations, other modules, root files, or UI.

Implement bounded PostGIS candidate selection using service area, distance, skills, verification, availability, account status, and opportunity capacity. Persist explainable ranking inputs without leaking private location. Implement opportunity accept/decline idempotently and enforce worker/job ownership and state.

Implement quote draft/submit/list/reject/withdraw/expiry and quote acceptance. Quote acceptance must derive totals from immutable line items, use exact minor units/currency, serialize competing acceptance, and in one transaction accept one quote, supersede competitors, assign the worker, and create one booking. No payment is assumed in this round; preserve the pending_payment/payment-disabled policy seam exactly as documented. Implement booking start/complete/cancel commands with authorization and history.

Tests must include nearby/far/ineligible workers, availability conflicts, deterministic ranking, repeated opportunity actions, quote expiry, wrong actors, double-submit, two concurrent quote acceptances, job cancellation races, and invalid booking transitions. Use real PostGIS integration tests. Open one PR with transaction/locking evidence, checks, and unresolved payment-policy seams.
```

## Muse Spark 1.3 — R06-M — private media backend

```text
Read AGENTS.md and media/security specifications. Complete only R06-M. Branch muse/06-media-backend; one PR. Lease: NONE.

Writable paths only: non-controller files under packages/backend/src/modules/media/**, packages/backend/src/providers/storage/**, and corresponding media/storage tests. Do not edit DTO/controllers, migrations, worker composition root, root files, infrastructure, or UI.

Implement upload authorization, random object keys, byte/size validation, short-lived constrained S3 presigned uploads, completion handling, quarantine-to-processing-to-ready transitions, JPEG/PNG/WebP decoding/processing, EXIF/GPS stripping, and authorized short-lived downloads for ready assets only. Reject spoofed MIME, SVG/executables, malformed/oversize images, and decompression bombs using available dependencies.

Media must be owned and attached only to resources the actor can access. Never make objects public or trust a client-provided key/content type. Define clean processing seams for the Round 8 worker; do not implement SQS polling here. Use local/in-memory fake S3 in tests and no live AWS calls.

Test authorization, object-key unpredictability boundaries, expired/mismatched uploads, malicious fixtures, metadata removal, quarantine/download denial, repeated completion, deletion policy, and provider failures. Run focused/repository checks. Open one PR with threat controls, checks, and unresolved antivirus/processing deployment needs.
```

## Claude — R06-C — adversarial security test suite

```text
Read AGENTS.md, docs/security/**, and the implemented contracts/services. Complete only R06-C. Branch claude/06-security-tests; one PR. Lease: NONE.

Writable paths only: packages/testing/src/**, packages/testing/test/**, packages/backend/test/security/**, and docs/security/verification-round-06.md. Do not change production code, contracts, schema, dependencies, CI, or UI. Report production defects instead of fixing them.

Add reusable synthetic attackers/principals and adversarial tests across auth, identity, workers, jobs, matching, quotes, bookings, and media. Cover unauthenticated access, wrong role, cross-user IDOR, unverified/suspended worker, admin token on customer pool, customer token on admin routes, mass assignment, free-form status changes, amount/currency tampering, replayed idempotency with changed payload, cross-resource media attachment, exact-location leakage, and unsafe error/log serialization.

Tests must express specification behavior and must not weaken assertions to obtain green results. Use real disposable PostGIS for data-layer cases and fakes for external services. Document any defect with reproduction, severity, expected/actual behavior, and owning module; mark the PR blocked if critical behavior fails rather than hiding it.

Run the new suite and relevant repository checks. Open one PR with coverage and unresolved findings for original owners.
```
