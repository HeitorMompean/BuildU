# Round 14 — one platform only after Round 13 findings are resolved

## GPT 6.2 — R14-G — payment API and generated client

```text
Read AGENTS.md, approved Wix evidence, R13 findings, and payment/ledger implementation. Complete only R14-G. Branch gpt/14-payment-contracts; one PR. Lease: CONTRACTS.

Writable paths only: controller and dto files under packages/backend/src/modules/{payments,payouts,ledger}/**; apps/api/src/openapi.ts; apps/api/src/main.ts only if required for raw Wix webhook body preservation; packages/api-client/**; payment contract tests under packages/backend/test/contracts/**. Do not edit payment/domain logic, migrations, Wix adapter, UI, root files, or infrastructure.

Implement the Round 14 routes in data-and-api-spec.md: customer checkout/status/cancel, Wix webhook, admin payment list/detail/reconcile/refund, payout list/create/approve/settle/reject, and read-only ledger transaction detail. Validate DTOs and derive all financial values server-side. Require explicit local admin permissions and audit context; never add a generic ledger write endpoint.

Preserve raw webhook bytes before JSON parsing, verify authenticity through the adapter, deduplicate events, acknowledge according to durable processing policy, and never expose provider secrets/details in errors. Return URLs have no mutation endpoint. Ensure idempotent customer/admin commands and safe handling of repeated webhook delivery.

Regenerate OpenAPI and the TypeScript client; never hand-edit generated output. Add tests for route validation, ownership/permissions, raw-body signatures, replay, amount tampering, refund/payout confirmation, error safety, and deterministic generation. Run contract diff, tests, lint/typecheck/build. Open one PR with routes, compatibility/security notes, checks, and remaining UI integration requirements.
```
