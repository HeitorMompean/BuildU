# Round 13 — one read-only review after Round 12 merges

## Claude — R13-C — payment security and correctness review

```text
Perform a read-only review of latest main after R12-M. Do not create a branch, edit files, or open a code PR. Post findings to the R13-C GitHub issue. Round 14 waits until critical/high/medium findings are resolved or explicitly accepted by the human.

Review provider-neutral payment code, Wix adapter, schema/migrations, ledger, refunds, manual payouts, authentication/authorization, raw-body signature verification, amount/currency derivation, provider-event correlation, replay/out-of-order handling, missed-event reconciliation, transaction boundaries, concurrency, immutable audit/ledger behavior, secrets/log redaction, and deployment/rollback compatibility.

Attempt adversarial tests without modifying repository files where your platform supports an isolated workspace: forged returns/signatures, replay with changed payload, duplicate checkout, concurrent acceptance/reconciliation/refund/payout, unbalanced/multi-currency postings, cross-user payment access, provider timeout/5xx, and inconsistent provider states. Do not make live financial calls.

For every finding provide severity, exact file/line or reproduction, evidence, affected invariant, and suggested owner. Distinguish confirmed defects, hypotheses, and unverified live-Wix behavior. GPT owns R11 core fixes; Muse owns R12 adapter fixes; contract changes wait for the CONTRACTS lease. Post a clear go/no-go recommendation, but only the human can approve continuation.
```
