# Minimal provider contract proposal — `CustomerPaymentProvider`

| Field | Value |
| --- | --- |
| Assignment | R02-C |
| Status | **Proposal only. No code.** It's an input to R11-G (provider-neutral core) and R12-M (Wix adapter). It has no effect until a human records `WIX_OK`. |
| Basis | Findings `F-*` in [`findings.md`](./findings.md). Items marked *(SP-nn)* depend on a sandbox proof in [`sandbox-proof-plan.md`](./sandbox-proof-plan.md). |

## 1. Principles

1. **Provider-neutral.** Domain, mobile, and admin code see only these operations and the normalized states below. `payments/wix` is the only module that knows Wix field names (`file-and-infrastructure-spec.md` §2).
2. **Server-derived money.** Every amount and currency comes from the accepted quote's immutable line items. The provider never receives a client-supplied amount.
3. **Reconciliation decides.** Only `reconcile` can produce `PAID` or a refund state. Webhooks and returns only *schedule* reconciliation (F-07, F-10, F-12).
4. **Durable before external.** The caller persists an intent/attempt record (with our `correlationId`) before calling any operation that creates something at the provider. On timeout it re-queries before retrying, because Wix exposes no idempotency keys for these calls (F-19).
5. **No payouts.** The contract has no transfer, split, escrow, or payout operation. Worker settlement stays manual and external.

## 2. Operations

| Operation | Input (provider-neutral) | Output | Wix mapping (evidence) | Notes |
| --- | --- | --- | --- | --- |
| `createHostedCheckout` | `correlationId` (our deterministic ID), `lines[]` {`displayName`, `unitAmountMinor`, `quantity`}, `currency`, `customerRef` (opaque), `returnUrls` {`completed`, `abandoned`} | `providerCheckoutRef` (= Wix cart ID), `providerFlowRef` (= `purchaseFlowId`), `checkoutUrl` | Create Cart with `customItems` (`itemType.preset=SERVICE`, `fixedQuantity=true`), settings `manualPaymentDisabled`, `lockCouponCode`, `lockGiftCard`; then Get Checkout URL, or Create Redirect Session if SP-03 passes (F-02, F-03, F-06–F-08, F-11) | Reject if the currency exponent > 3 or the amount exceeds the provider bound. Persist refs **before** returning the URL. Line text must not include the service address. |
| `reconcile` | `providerCheckoutRef`, `providerFlowRef`, expected `{amountMinor, currency}` | `ReconciliationResult` (§3) | Search Orders `checkoutId $eq` (with explicit status filters, since PENDING is excluded by default) → Get Order → List Transactions For Single Order (F-09, F-10) | Pure read. Never mutates provider state. Safe to run repeatedly. |
| `listChangedSince` | `cursor` / `since` timestamp | page of `providerCheckoutRef` + provider order IDs + `updatedAt` | Search Orders `updatedDate $gt`, cursor paging ≤100 (F-10, F-15) | Drives missed-event recovery. Each item goes through `reconcile`. |
| `verifyEvent` | raw request body bytes, headers | `VerifiedEventHint` {`providerEventId`, `eventType`, `entityId`, `eventTime`} **or** rejection | JWT verified with the app public key and a pinned algorithm; parse `data` → `data.data` (F-12–F-14, F-18) | Output is a hint. The caller dedupes by `providerEventId` in the inbox, then calls `reconcile`. |
| `getRefundability` | `providerOrderRef` | per-payment `{paymentRef, refundableMinor, mode: automatic\|manual\|none}` | Get Order Refundability (+ Calculate Refund for partial) (F-18) | Must be called right before every refund and after any refund timeout. |
| `requestRefund` | `providerOrderRef`, `paymentRef`, `amountMinor`, `internalRefundId`, `reasonCode` | `{providerRefundRef, status: scheduled\|started\|pending\|succeeded\|failed}` | Refund Payments (F-18) | Allowed only with `mode=automatic`. Amount ≤ refundable, checked internally and against the provider. *(SP-08, SP-09)* |
| `recordExternalRefund` | as above + `externalReference` | same | Refund Payments `externalRefund=true` (F-18) | Only for `mode=manual`, with admin permission and audit. Records only; moves no money. |
| `abandonCheckout` | `providerCheckoutRef` | `{deleted: boolean}` | Delete Cart (F-17) | Best effort. Reconcile first: if an order exists, don't delete. |

Order cancellation (Cancel Order) is intentionally **not** in the minimum contract. Its effect on captured funds is undocumented (F-17). Refund is the only money-returning operation. A cancel-order operation can be added once SP-10 proves its behavior.

## 3. Normalized reconciliation result

`ReconciliationResult.state` is one of:

| State | Required evidence (all must hold) |
| --- | --- |
| `NO_ORDER` | No order found for `providerCheckoutRef` (checkout not completed or abandoned). |
| `PENDING` | Order exists; order `paymentStatus` or any transaction is `PENDING` / `PENDING_MERCHANT` / `AUTHORIZED`; no mismatch. |
| `PAID` | Order `checkoutId` and `purchaseFlowId` equal the stored refs **and** order currency equals expected currency **and** order total equals expected amount **and** the sum of transactions with `status=APPROVED` and `offlinePayment=false` equals the expected amount (F-10). |
| `PARTIALLY_REFUNDED` / `REFUNDED` | `PAID` evidence held previously, and refund transactions with `SUCCEEDED` refunds sum to part or all of the paid amount. |
| `FAILED` | Order or transactions `DECLINED` / `CANCELED` with no approved online payment. |
| `MISMATCH` | Any correlation, currency, amount, or offline-payment check fails. **Terminal for automation:** raise an admin reconciliation task and an audit event. Never map it to `PAID`. |
| `UNKNOWN` | Provider error or timeout. Retry with backoff; no state change. |

The internal payment state machine (`data-and-api-spec.md` §3) maps from these states only. Raw Wix strings never leave the adapter.

## 4. Invariants the adapter must uphold

- One `correlationId` ↔ one `providerCheckoutRef` ↔ at most one provider order. A second order for the same cart is a `MISMATCH`.
- Money conversion is exact, using the configured currency exponent. No floating point.
- Secrets (API key or app credentials, webhook public key) are read only from the secret store and never logged (`configuration.md`). Webhook raw bodies and order payloads aren't logged; store only the mapped fields plus a payload hash.
- Every outbound call has a timeout and bounded retries. Retries on create/refund paths happen only after a re-query proves no prior effect.
- The webhook endpoint acknowledges quickly (Wix expects 200 within 1250 ms) after a durable inbox write. Business processing is asynchronous (F-14).

## 5. Explicitly out of contract

Wix Pay `startPayment()` (Velo-only), Checkout V1 APIs (removed 2027-02-01), Charge Order / saved payment methods, delayed capture, gift cards, coupons, memberships, subscriptions, multi-currency checkout, and any payout, split, or escrow function.
