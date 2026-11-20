# Round 12 — one platform only after Round 11 merges

## Muse Spark 1.3 — R12-M — Wix customer-payment adapter

```text
Read AGENTS.md, human-approved docs/spikes/wix/**, and the Round 11 provider interface. Complete only R12-M. Branch muse/12-wix-adapter; one PR. Lease: NONE.

Verify human WIX_OK remains present. If absent or required evidence is still unknown, stop without changes.

Writable paths only: packages/backend/src/modules/payments/wix/** and corresponding Wix adapter tests under packages/backend/test or packages/testing/src/wix/**. Do not edit provider-neutral payment services, domain, controllers/DTOs, generated clients, migrations, UI, infrastructure, root dependencies, or CI. If a missing dependency requires ROOT work, stop and report it.

Implement Cart V2 custom line items + hosted checkout and server-side order/transaction reconciliation exactly as supported by approved evidence. Use internal deterministic correlation IDs, server-derived amount/currency, authenticated raw-body webhook verification, provider-event dedupe interfaces, timeout/retry limits, safe error mapping, and polling/reconciliation for missed events. Implement cancellation and refunds only to the proven provider capability. Checkout V1 is prohibited.

Do not trust return URLs, expose secrets, log payment payloads, or represent Wix as providing splits/escrow/worker transfers. No live calls in normal tests; use recorded synthetic fixtures with sensitive data removed and a fake HTTP server for replay, ordering, signatures, timeouts, and malformed responses. Live sandbox verification requires separate human authorization and non-destructive test data.

Run adapter/unit/integration/security tests and repository checks. Open one PR mapping each capability to spike evidence, listing tests and remaining live-sandbox verification. Do not claim production payment readiness.
```
