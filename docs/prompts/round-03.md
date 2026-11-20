# Round 3 — send in parallel after Round 2 is merged and green

## Muse Spark 1.3 — R03-M — initial PostgreSQL/PostGIS database

```text
Read AGENTS.md, data-and-api-spec.md, and file-and-infrastructure-spec.md. Complete only R03-M. Branch muse/03-initial-database; one PR. Lease: DB.

Writable paths only: packages/backend/src/database/**, packages/backend/src/common/database/** if needed, packages/testing/postgis/**, scripts/db/**. Do not edit feature services/controllers, dependencies, CI, or infrastructure.

Implement migrations 0001 through 0016 exactly within their documented ownership. Use Kysely + pg, explicit constraints/indexes, PostGIS GiST indexes, row-version support, safe timestamps, money types, private-location protection, uniqueness for opportunities/reviews, and no runtime DDL. Include migration runner, database type generation, synthetic local setup, and migration validation. Do not implement outbox/idempotency or finance migrations reserved for 0017+.

Separate migrator and runtime behavior in scripts/documentation comments only where existing conventions require it. Runtime must not mutate ledger/audit; initial finance tables beyond the provider-neutral payment intent are out of scope. Never modify a merged migration; if a problem exists, report it.

Tests must run against real disposable PostgreSQL/PostGIS, not SQLite or a mocked query builder: fresh migrate up, repeated runner safety, constraint/index checks, invalid money/state rejection, geo-distance behavior, and runtime privilege checks where locally reproducible. Run type generation and fail on diffs. Open one PR with schema decisions, checks, resource requirements, and rollback/expand-contract notes.
```

## Claude — R03-C — Cognito authentication and authorization

```text
Read AGENTS.md and architecture/security documents. Complete only R03-C. Branch claude/03-cognito-auth; one PR. Lease: NONE.

Writable paths only: packages/backend/src/modules/auth/**, packages/backend/src/providers/cognito/**, packages/backend/src/common/guards/**, packages/backend/src/common/decorators/**, packages/backend/test/auth/**, packages/testing/src/auth/**. Do not edit public controllers/DTOs, migrations, app composition roots, root dependencies, or infrastructure.

Implement Cognito access-token verification using the already selected libraries: JWKS signature validation, issuer, expected client/audience as applicable, expiration, and token_use=access. Build a safe principal and guards for customer, worker, verified worker, local admin permissions, account suspension, and ownership inputs used by services. Admin pool/client configuration must remain separate from customer/worker configuration. Never trust role claims alone for local admin permission.

Use deterministic JWKS caching/failure behavior and safe errors. Do not log tokens or claims containing sensitive data. Add tests with synthetic signed tokens for valid tokens, wrong issuer/client/token_use, expired/tampered tokens, revoked/disabled local users, wrong role, unverified worker, missing permissions, cache failures, and algorithm confusion attempts.

Run focused and repository checks. Open one PR with security decisions, test evidence, required configuration names only, and unresolved integration issues. Stop if a needed dependency was not preinstalled rather than changing the lockfile.
```
