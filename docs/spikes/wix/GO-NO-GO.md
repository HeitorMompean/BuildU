# Wix payment spike — GO / NO-GO

## Status: `BLOCKED`

| Field | Value |
| --- | --- |
| Assignment | R02-C — Wix capability spike |
| Prepared by | Claude (R02-C). This is a recommendation, not an approval. |
| Date | 2026-11-20 |
| Evidence | [`findings.md`](./findings.md) (E-01…E-27, F-01…F-27), [`provider-contract-proposal.md`](./provider-contract-proposal.md), [`sandbox-proof-plan.md`](./sandbox-proof-plan.md) |
| Sandbox | Not executed (no authorized test site). |

> **Human approval record.** Only the human owner may record approval in this section, by replacing the line below with the approval token named in `AGENTS.md`, followed by their name, the date, and the approved scope. No platform or agent may write the token.
>
> Approval: **none recorded**

## Recommendation: **NO-GO for now.** Don't start Rounds 11–16.

The documentation supports the technical shape the architecture requires:
- **Cart V2 custom line items** at server-set prices (F-02, F-03).
- **Wix-hosted checkout** reached from an external backend via Get Checkout URL (F-06).
- **Server-side reconciliation** through Search/Get Order and Order Transactions (F-08–F-10).
- **Signed webhooks** with documented retry and duplicate behavior (F-12–F-16).
- **Full and partial refunds** via API (F-18).
- Checkout V1 is removed on 2027-02-01 and isn't used (F-01).

It isn't ready, for three reasons that can't be resolved from documentation:

| ID | Blocker | Why it blocks | What unblocks it | Owner |
| --- | --- | --- | --- | --- |
| **B-01** | **Business-model eligibility.** Wix Payments' prohibited list (US) includes "Third party payment processing — Aggregators … **Marketplaces, Platforms**". Other territories defer to Adyen/Stripe lists. Violations may mean suspended accounts, withheld funds, or customer refunds (E-24, E-25, F-24). This product collects customer payments for services performed by independent workers and pays them manually. | If the model is prohibited, the integration risks frozen funds and forced refunds, regardless of technical correctness. | Written determination from Wix (and the chosen processor) that this model is permitted for the launch country and provider, **or** a business restructure that legal counsel confirms is outside the restriction (e.g. the platform as merchant of record for its own services). Record the decision and source here. | Human (legal/business) |
| **B-02** | **No documented sandbox for this flow.** Third-party test credentials aren't accepted. Test orders exist only for Stores/Restaurants via manual payment, which our flow must disable. Other methods charge real money. "Test mode"/demo carts are undocumented for custom-item online payments (F-21). | The required proofs (amount integrity, reconciliation, webhook signatures, replay, refunds) can't be demonstrated without a test path or approved live micro-charges. | Choose Option A (Wix-confirmed test mode) or Option B (human-approved, refunded real micro-charges on a dedicated test site), then run SP-01…SP-12. | Human |
| **B-03** | **Unproven critical behaviors.** Not documented: buyer tampering limits on custom items (F-04), whether Redirect Session accepts a V2 cart (F-07), JWT algorithm and replay claims (F-12, F-14), refund idempotency (F-19), cancel-order payment effect (F-17), and the charged-currency field (F-05). | Each one affects a security or financial invariant (forged payment, duplicate refund, amount mismatch). | Sandbox proofs SP-03, SP-04, SP-06, SP-09, SP-10. | R02-C follow-up after B-01/B-02 |

Changing the status to `READY_FOR_HUMAN_REVIEW` requires B-01 resolved and SP-01…SP-12 passed (or each failure accepted with a documented compensating control). Only then may the human decide whether to record `WIX_OK`.

## What is proven vs. not

| Area | Status |
| --- | --- |
| Checkout V1 removal date (2027-02-01) | Observed |
| Custom items with server-set decimal price, quantity lock, coupon/gift-card/manual-payment locks | Observed (schema); tamper resistance unproven |
| Hosted checkout URL from an external backend | Observed (schema); end-to-end unproven |
| Correlation via cart ID = `order.checkoutId`, plus `purchaseFlowId` | Observed (schema); end-to-end unproven |
| Reconciliation by Search Orders / Get Order / Order Transactions, including `offlinePayment` check | Observed (schema); unproven |
| Signed JWT webhooks via a Wix app; 12 retries over ~47 h; duplicates and out-of-order; unique event `id` | Observed; algorithm and replay claims unknown |
| Partial and full refunds via API | Observed for "most payment providers"; provider-specific behavior unknown |
| Provider idempotency keys (create/refund/cancel) | Not found, so internal protection is mandatory |
| Sandbox | Not documented for this flow |
| Escrow, split payments, worker transfers | Not offered for this flow; not part of the design |

## Unresolved questions

| ID | Question | Needed for |
| --- | --- | --- |
| UQ-01 | Launch country, currency, and payment provider (Wix Payments vs. a third-party provider), each provider's marketplace terms, and fees. (`pilot-scope.md` lists country/currency as a human policy.) | B-01, F-23 |
| UQ-02 | Does Wix (or the processor) classify this marketplace as an aggregator/platform? Is a merchant-of-record structure acceptable? | B-01 |
| UQ-03 | Which Wix premium plan, and who owns the Wix account and site (the business, not a developer)? | F-22 |
| UQ-04 | Credential model: site API key (long-lived, owner-created) vs. self-managed Wix app with OAuth `client_credentials` (4-hour tokens). An app is needed for webhooks either way. Needs an ADR and may add a config name (`WIX_APP_CLIENT_SECRET_SECRET_ARN` or similar) under ROOT. | F-12, F-20 |
| UQ-05 | Must multi-currency be disabled, or which order field holds the base-currency charged amount? | F-05 |
| UQ-06 | Hosted checkout requires buyer contact details. Which customer fields do we send, given the privacy data map (no service address in line items)? | Privacy map PQ-08 |
| UQ-07 | Cancellation/refund policy, refund approval roles, and dual-control thresholds (`pilot-scope.md`). | F-17, F-18 |
| UQ-08 | Does an abandoned cart expire, and when? Needed for the payment-intent expiry policy. | F-17 |
| UQ-09 | Rate limits for the Wix APIs used. | F-27 |
| UQ-10 | Retention of provider payloads: store only mapped fields and a hash (proposed) vs. encrypted raw payloads. | Privacy map PQ-08 |

## Process notes

- R02 prerequisites: `docs/tasks/rounds.md` requires Round 1 to be merged first. At the time of writing, `main` contains no Round 1 merges. This spike is documentary and touches only `docs/spikes/wix/**`, but the human may hold it until Round 1 merges.
- Network access was enabled only for `dev.wix.com`, `support.wix.com`, and `www.wix.com`, for documentation reading. No Wix API call was made. A link check of this PR's documents also tried to open the API endpoint URLs quoted in the evidence (`www.wixapis.com`). The network proxy refused those connections, so no request reached Wix's API.
