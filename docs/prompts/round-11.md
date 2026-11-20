# Round 11 — one platform only; human payment gate required

Do not send this prompt unless `docs/spikes/wix/GO-NO-GO.md` contains a human-approved `WIX_OK`, the Wix evidence satisfies the required checkout/reconciliation/refund behavior, and Round 10 findings are resolved.

## GPT 6.2 — R11-G — provider-neutral payment core, ledger, and manual payouts

```text
Read AGENTS.md, approved docs/spikes/wix/**, architecture/data/security documents, and human payment policies. Complete only R11-G. Branch gpt/11-payment-core; one PR. Leases: CONTRACTS + DB.

First verify human WIX_OK is explicitly recorded. If absent, stop without changes.

Writable paths only: packages/domain/src/{payments,ledger,payouts}/** and domain index exports/tests; non-controller/non-DTO/non-Wix files under packages/backend/src/modules/{payments,ledger,payouts}/**; migrations 0019 through 0023 and generated DB types/codegen; scripts/db/** only for these migrations; corresponding tests. Do not create controllers/public payment DTOs, Wix adapter code, UI, root config, CI, or earlier migration edits.

Implement provider-neutral CustomerPaymentProvider, payment intents/checkout state, deterministic internal correlation, trusted provider-event mapping seams, idempotent reconciliation, cancellation/refund domain rules, and safe fake provider. Amount/currency always derive from accepted quote/server records. No return URL or client status can mark paid.

Implement append-only double-entry ledger with same-currency balanced postings, immutable provider/event identities, unique external settlement reference, and transactional booking/payment coordination through durable events. Implement manual payout pending/approve/reject/settle records with admin permissions and audit; no bank/Wix worker transfer and no automatic payout execution.

Use real PostgreSQL tests for balanced/unbalanced postings, immutability, concurrent reconciliation, repeated/out-of-order provider events, duplicate refund/payout/settlement, amount/currency mismatch, cancellation/refund boundaries, transaction rollback, and migration upgrade. Run all relevant checks. Open one PR with financial invariants, threat/rollback notes, test evidence, and any human policy blockers.
```
