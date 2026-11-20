# Round 15 — send in parallel after Round 14 is merged and green

## Muse Spark 1.3 — R15-M — mobile checkout and paid booking flow

```text
Read AGENTS.md, approved payment specification, and generated client. Complete only R15-M. Branch muse/15-mobile-checkout; one PR. Lease: NONE.

Writable paths only: apps/mobile/app/payments/**, apps/mobile/src/features/{payments,bookings,quotes}/**, and payment/booking integration tests under apps/mobile/tests/**. Do not edit contracts/client output, backend, root files, native dependencies, EAS config, or admin.

Implement quote-acceptance-to-checkout using the generated client and server-created Wix hosted checkout URL. Open checkout through the approved secure browser mechanism, preserve internal correlation, handle cancellation/return/deep links, and poll/refetch authoritative payment/booking state. A return URL or WebView/browser callback must never mark payment paid. Disable duplicate checkout submission while retaining safe retry/idempotency.

Show exact server-provided minor-unit amount/currency, booking pending/scheduled/failed/cancelled/refund status, accessible errors, and support path. Protect payment screens with auth/ownership; never handle card data or expose Wix secrets. Do not add automated payout UI.

Use mocked API/hosted-checkout tests for successful server-confirmed payment, forged/cancelled return, delayed/missed webhook with later reconciliation, duplicate tap/retry, expired quote, amount mismatch, app restart, deep-link wrong owner, and session expiry. Run mobile checks and relevant Maestro flows. Open one PR with test/UI evidence and explicit live-Wix items still unverified.
```

## Claude — R15-C — admin payments, reconciliation, refunds, and manual payouts

```text
Read AGENTS.md, approved payment policies, and generated client. Complete only R15-C. Branch claude/15-finance-admin; one PR. Lease: NONE.

Writable paths only: apps/admin/src/app/(dashboard)/{payments,payouts,audit}/**, apps/admin/src/{components,features}/{payments,payouts,audit}/**, corresponding apps/admin/tests/**, and only payments/payouts/audit additions to the BFF allowlist. Do not edit backend, contracts, schema, root files, mobile, or CI.

Implement server-permission-protected payment list/detail, provider correlation and reconciliation status, manual reconcile/refund forms, payout list/create/approve/reject/settle forms, and read-only audit/ledger views. Display exact minor-unit money/currency and immutable history. Require confirmation and safe reason/reference validation; settlement requires a unique external reference and timestamp. No form may claim to transfer worker funds through Wix.

Separate payments:read/reconcile/refund and payouts:read/approve/settle permissions. Keep tokens/server responses private, redact provider payloads, and make high-risk actions auditable. If dual-control policy is required but unsupported, stop that action and report rather than simulating it.

Add Playwright/component/server tests for every permission, wrong-user data access, amount/reference tampering, duplicate/refund/settlement submission, stale versions, failed reconciliation, and audit rendering. Run admin checks/build/E2E with fake providers. Open one PR with checks and unresolved human financial controls.
```
