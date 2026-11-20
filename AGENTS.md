# Shared repository instructions

These instructions apply to every platform and every pull request.

## Source of truth

Read these before starting:

1. `docs/architecture/system-architecture.md`
2. `docs/architecture/data-and-api-spec.md`
3. `docs/architecture/file-and-infrastructure-spec.md`
4. `docs/product/pilot-scope.md`
5. The current assignment under `docs/prompts/`

Do not invent an alternative architecture, rename modules, or expand product scope. Architecture changes require a human-approved ADR before code changes.

## Git and pull requests

- One assignment, one branch from the latest `main`, and one pull request.
- Never push directly to `main`, edit another platform's branch, approve your own PR, or merge your own PR.
- Write only the assignment's allowlisted paths. Resolve out-of-scope needs by reporting a blocker, not by editing extra files.
- Do not add or upgrade dependencies unless the assignment grants the ROOT lease and explicitly permits it.
- A human reviews and merges every PR. Later rounds begin only after required PRs are merged and CI is green.

## Exclusive leases

Only the current assignment's leaseholder may modify these surfaces:

- `ROOT`: all `package.json` files, lockfiles, workspace/Turbo/root TypeScript and lint configuration, `.github/**`, `infra/**`, and deployment scripts.
- `CONTRACTS`: `packages/domain/**`, public DTOs/controllers, OpenAPI source/output, and `packages/api-client/**`.
- `DB`: migrations, schema/database connection modules, Kysely configuration/generated types, and database tooling.

An assignment with no lease has lease `NONE`. Ordinary screens, services, and repositories do not implicitly grant a lease. Never regenerate contracts or database types without the corresponding lease. Merged migrations are immutable; use expand/contract migrations.

## Engineering and security

- Match existing TypeScript and project conventions. Keep composition roots thin and domain code pure.
- Do not commit secrets, tokens, real customer data, APKs, proprietary source/assets, or generated build output.
- Do not make live external calls or mutations in tests. Mock AWS, Cognito, Wix, Expo, SES, and maps unless a human explicitly authorizes a sandbox spike.
- Do not trust client-provided amounts, roles, payment state, or worker-verification state.
- Preserve authorization, ownership, idempotency, transaction, concurrency, and audit requirements.
- Never automate worker payouts. Never claim Wix provides escrow, splits, or worker transfers.
- Do not weaken, skip, or delete tests to make a change pass. Add tests for behavior introduced or changed once the test harness exists.
- Run focused checks and all relevant existing lint, typecheck, test, build, and generation checks. Report exactly what ran and any unverified item.

## Payment gate

No Wix adapter, live payment workflow, refund, or payment deployment may begin until the Wix spike is complete and a human has recorded `WIX_OK` in `docs/spikes/wix/GO-NO-GO.md`. Provider-neutral payment work also waits for that approval. A browser return URL never proves payment.

## Pull request report

Include: assignment ID, scope, declared lease, design decisions, files changed, checks run with results, migration/security/rollback notes where applicable, and unresolved issues. Stop and report when prerequisites, credentials, policies, or provider evidence are missing.
