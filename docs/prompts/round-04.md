# Round 4 — send in parallel after Round 3 is merged and green

## GPT 6.2 — R04-G — non-payment contracts and generated client

```text
Read AGENTS.md, data-and-api-spec.md, and the prewired composition roots. Complete only R04-G. Branch gpt/04-nonpayment-contracts; one PR. Lease: CONTRACTS.

Writable paths only: non-payment controller and dto files under packages/backend/src/modules/{identity,catalog,workers,jobs,matching,quotes,bookings,media,notifications,reviews,disputes,operations}/**; packages/api-client/**; apps/api/src/openapi.ts; contract tests under packages/backend/test/contracts/**. Do not modify domain, migrations, services/repositories, payments/payouts/ledger, root files, or UI.

Define the complete initial non-payment /v1 HTTP surface and admin resource contracts from the specification. Use explicit DTO validation, authorization decorators/guards already available, cursor pagination, stable errors, UTC timestamps, string minor units, resource versions, and Idempotency-Key on side-effecting creation/transition routes. Leave payment/webhook/payout contracts for Round 14. Methods may call existing service interfaces or documented not-implemented seams without adding fake business behavior.

Generate Nest OpenAPI and the TypeScript client from it. Never hand-edit generated output. Add contract tests for route shape, validation, auth metadata, error responses, ownership semantics represented by the contract, and generation determinism. Ensure mobile/admin can consume one typed client without ad hoc DTO duplication.

Run contract regeneration diff, focused tests, lint, typecheck, and builds. Open one PR listing public routes, compatibility decisions, checks, and any service-interface blockers.
```

## Muse Spark 1.3 — R04-M — mobile shell

```text
Read AGENTS.md and architecture/file manifests. Complete only R04-M. Branch muse/04-mobile-shell; one PR. Lease: NONE.

Writable paths only: apps/mobile/**. Do not add dependencies or edit generated clients, API contracts, backend, root config, or EAS workflows.

Implement the Expo app shell with the exact route groups in the manifest: auth, customer, worker, settings, and placeholder payment routes that cannot imply payment success. Add secure Cognito session integration using existing dependencies, role-based navigation guards, typed api-client wrapper, runtime config validation, design-system primitives, safe loading/error/empty states, accessibility labels, Sentry initialization with data scrubbing, and synthetic fixtures for screens.

Pre-create all documented routes and feature directories so later rounds do not change navigation. Do not implement real job/matching/payment business flows or background location. Do not store tokens in unencrypted storage or log sensitive values. Use placeholders for missing Expo IDs/bundle/package values.

Run mobile lint, typecheck, unit/component tests, and export/build checks available without external credentials. Exercise customer and worker role navigation in tests. Open one PR with screenshots or UI evidence if supported, checks, and unverified native/deep-link items.
```

## Claude — R04-C — admin shell and links hosting

```text
Read AGENTS.md and architecture/file manifests. Complete only R04-C. Branch claude/04-admin-shell; one PR. Lease: NONE.

Writable paths only: apps/admin/**. Do not add dependencies or edit API, contracts, root config, infrastructure, or mobile.

Implement the Next.js App Router admin shell at the documented paths: secure Cognito admin sign-in/session flow, server-side permission checks, BFF allowlist proxy using the typed API client, dashboard navigation, accessible shared tables/forms/states, security headers, and scrubbed Sentry setup. Admin self-sign-up is absent; MFA is required by Cognito policy and the UI must not bypass it. Keep admin tokens server-side.

Implement public links-host routes in this same service: AASA, assetlinks.json, safe universal/app-link fallback, and a Wix return route that displays neutral status and never marks a payment paid. Validate required mobile identifiers at runtime; do not invent Apple/Android values.

Use synthetic data/placeholders only; later rounds add resource features. Run lint, typecheck, component/server authorization tests, and production build. Test that unauthenticated/wrong-permission requests cannot use BFF endpoints and public link routes expose no secrets. Open one PR with checks and unresolved identity/deep-link inputs.
```
