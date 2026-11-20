# Sandbox proof still required

| Field | Value |
| --- | --- |
| Assignment | R02-C |
| Status | **Not executed.** No authorized test site was provided, so no Wix calls were made. |
| Preconditions | (1) A human explicitly authorizes a specific Wix test site and account, in writing, for these proofs. (2) Blocker B-01 in `GO-NO-GO.md` (business-model eligibility) is resolved first, so a payment account isn't opened for a possibly prohibited use. (3) Credentials are placed in the environment's secret store by the human, never pasted into chat, prompts, or the repository. |

## Constraints found in the documentation

- Third-party provider **test credentials are not accepted** (E-22).
- Documented test orders exist only for Wix Stores/Restaurants via **manual payment** (E-21). Our flow must disable manual payment (F-11), so that path can't prove online payment.
- Any other payment method **charges real money** and incurs fees (E-21).
- A cart becomes `demo` when "the site's test mode applies" (E-04), but how to enable test mode for custom-item carts with online payment is undocumented (F-21).

Therefore the human must choose one of these before any proof runs:

- **Option A:** Wix confirms in writing a supported test mode for Cart V2 custom items + hosted checkout + refunds, and its limitations.
- **Option B:** The human approves a small number of real low-value charges on a dedicated test site, each refunded through the API, with fees accepted.

Option B is a live financial action. It needs explicit human approval per run and is out of scope for any automated agent.

## Proofs

Each proof records: date, site ID (redacted), request/response excerpts with personal data and secrets removed, observed result, and pass/fail. Only non-destructive synthetic data is used.

| ID | Proof | Pass criterion | Findings closed |
| --- | --- | --- | --- |
| SP-01 | Create a Cart V2 cart with one `SERVICE` custom item at a server-set price; Get Checkout URL on a published site. | Cart created; URL returned; hosted checkout shows exactly that item and price. | F-02, F-03, F-06 |
| SP-02 | Complete checkout once with an online method. | An order exists with `checkoutId` = cart ID and the same `purchaseFlowId` as the cart; Search Orders by `checkoutId` finds it. | F-08, F-09 |
| SP-03 | Create Redirect Session with `ecomCheckout.checkoutId` = Cart V2 cart ID and custom `thankYouPageUrl`/`postFlowUrl`. | Redirect works with a V2 cart; `orderId` is appended on completion; abandon goes to `postFlowUrl`. If it fails, use Get Checkout URL plus app-side polling. | F-07 |
| SP-04 | Tamper attempts as an anonymous visitor holding only the checkout URL: change quantity, add items, apply a coupon, choose manual payment, change currency. | All blocked by `fixedQuantity`, the lock settings, and `manualPaymentDisabled`. If any succeeds, reconciliation must catch it as `MISMATCH`, and both outcomes are recorded. | F-04, F-05, F-11 |
| SP-05 | Inspect List Transactions For Single Order for the paid order. | Online payment shows `status=APPROVED`, `offlinePayment=false`, amount and currency equal to the cart; `providerTransactionId` present. | F-10 |
| SP-06 | Receive Order Approved / Order Transactions Details Updated webhooks on a test endpoint for a self-managed Wix app installed on the test site. | JWT verifies with the app public key using a pinned algorithm. Record the `alg`, any `iat`/`exp` claims, `data.id` uniqueness, and that a byte-modified body fails verification. | F-12, F-13, F-14 |
| SP-07 | Force webhook failure (return 500) for a delivery, then recover. | Retries observed per the documented schedule (at least the first two); duplicates are deduped by `data.id`; polling `updatedDate` finds the order without the webhook. | F-14, F-15 |
| SP-08 | Partial refund via Get Order Refundability → Calculate Refund → Refund Payments. | Refund reaches `SUCCEEDED`; order `balanceSummary.refunded` and transactions reflect it; `paymentStatus=PARTIALLY_REFUNDED`. | F-18 |
| SP-09 | Duplicate refund: repeat the identical Refund Payments request immediately and after a simulated timeout. | Record whether Wix rejects the second call or issues a second refund. Our design must prevent the second call regardless (F-19). | F-19 |
| SP-10 | Cancel Order on (a) an unpaid order and (b) a paid order. | Record the effect on payment and transactions. Determine whether cancel refunds; until proven, cancel stays outside the contract. | F-17 |
| SP-11 | Full refund of the remaining amount. | `paymentStatus=FULLY_REFUNDED`; refund webhook observed. | F-18 |
| SP-12 | Credential model: perform SP-01/SP-02/SP-08 calls with the chosen credential (site API key or app OAuth `client_credentials`), using the minimum scopes. | Calls succeed with only the scopes listed in the evidence register; record the exact scope set. | F-20 |

## Evidence handling

Store proof evidence under `docs/spikes/wix/evidence/` in a later, separately authorized PR. Excerpts only: no full payloads, no personal data, no secrets, no tokens, no full card or bank details.
