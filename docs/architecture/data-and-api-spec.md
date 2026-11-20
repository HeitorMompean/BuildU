# Data and API specification

This document fixes the initial persistence and public-contract boundaries. Exact column definitions are implemented and reviewed in the assigned rounds; changing an already merged migration requires a new migration.

## 1. Persistence rules

- PostgreSQL 16 with PostGIS, subject to a regional RDS compatibility check before provisioning.
- Kysely + `pg`; generated database types are owned exclusively by the DB leaseholder.
- UUID primary keys, UTC `timestamptz`, explicit `created_at`/`updated_at`, and version columns on race-prone aggregates.
- Monetary values are signed 64-bit minor units plus ISO 4217 currency. No floats.
- Coordinates use PostGIS geography/geometry deliberately; distance queries have a GiST index and a bounded candidate filter.
- Soft deletion is used only where retention policy requires it. Ledger and audit rows cannot be updated or deleted by application roles.
- Every table has a single owning module. Other modules use exported application services.
- Transactions use the smallest practical isolation level; quote acceptance, booking assignment, payment reconciliation, and ledger posting explicitly handle concurrency.
- Enumeration-like values are checked in both domain code and database constraints where practical.

## 2. Migration allocation

Migrations live at `packages/backend/src/database/migrations`. Names below are the intended initial sequence. Once merged, files are immutable.

### Round 3: non-payment core, `0001`–`0016`

| ID | Suggested name | Owned content |
| --- | --- | --- |
| `0001` | `extensions_and_common` | PostGIS/crypto prerequisites, shared trigger functions only |
| `0002` | `identity` | users, role membership, consents, account status |
| `0003` | `catalog` | categories, services, versioned requirement schemas |
| `0004` | `workers` | profiles, skills, verification, service areas, availability |
| `0005` | `jobs` | requests, private locations, schedules, status history |
| `0006` | `matching` | candidate snapshots, opportunities, dispositions, ranking metadata |
| `0007` | `quotes` | quotes, immutable line items, expiry, status history |
| `0008` | `bookings` | assignment, schedule, versions, status history |
| `0009` | `payment_intents` | provider-neutral intent placeholders; no Wix or ledger implementation |
| `0010` | `media` | assets, ownership, random object keys, quarantine/processing state |
| `0011` | `notification_devices` | device tokens encrypted/protected, preferences |
| `0012` | `notifications` | notification records, deliveries, provider IDs, attempts |
| `0013` | `reviews` | eligibility, rating constraints, uniqueness per booking/reviewer |
| `0014` | `disputes` | disputes, evidence references, resolution history |
| `0015` | `audit` | actor, action, target, safe metadata, request/correlation IDs |
| `0016` | `core_indexes_and_policies` | geo, matching, uniqueness, partial and concurrency constraints |

### Round 7: reliability, `0017`–`0018`

| ID | Suggested name | Owned content |
| --- | --- | --- |
| `0017` | `outbox_and_scheduled_actions` | transactional outbox, due scheduler actions, attempts/leases |
| `0018` | `inbox_and_idempotency` | consumer deduplication, request idempotency, stored safe responses |

`scheduled_actions.due_at` is authoritative. EventBridge only triggers a scan; it is not the business schedule store.

### Round 11: payments and finance, `0019`–`0023`

| ID | Suggested name | Owned content |
| --- | --- | --- |
| `0019` | `payment_orders_and_provider_events` | checkout/order correlation, provider event dedupe, reconciliation |
| `0020` | `ledger_accounts` | account ownership/type/currency, immutable financial identity |
| `0021` | `ledger_transactions_and_postings` | balanced double-entry transactions and postings |
| `0022` | `payouts_and_external_settlements` | manual approval, unique external references, settlement status |
| `0023` | `finance_constraints_and_indexes` | financial uniqueness, reconciliation and reporting indexes |

Ledger postings must satisfy: at least two postings, one currency per transaction, and `sum(debit_minor) = sum(credit_minor)`. Enforce with deferred constraints/triggers where row-level checks are insufficient. A balanced ledger does not prove that an external bank transfer happened; settlement requires a separate authorized record.

## 3. Aggregate states

### Job

```text
draft -> open -> matching -> awaiting_quote_selection -> booked -> closed
draft/open/matching/awaiting_quote_selection -> cancelled
open/matching/awaiting_quote_selection -> expired
```

Only an active booking assignment may move a job to `booked`. Cancellation and expiry must resolve outstanding opportunities/quotes consistently.

### Quote

```text
draft -> submitted -> accepted
submitted -> rejected | withdrawn | expired | superseded
```

A quote is immutable after submission except for controlled status changes. Accepting is idempotent and serialized against competing acceptance, expiry, cancellation, and worker withdrawal.

### Booking

```text
pending_payment -> scheduled -> in_progress -> completed
pending_payment/scheduled -> cancelled
scheduled/in_progress/completed -> disputed (only under an approved dispute policy)
```

Dispute data belongs to `disputes`; if a dispute is a separate record rather than a booking status, retain the booking status and record the association. Do not add both interpretations; resolve this in the Round 2 domain model.

### Payment

```text
created -> checkout_pending -> paid
created/checkout_pending -> cancelled | failed
paid -> refund_pending -> partially_refunded | refunded
```

Only trusted server-side reconciliation can enter `paid` or a refund state. Provider states are mapped internally; arbitrary provider strings are not exposed as domain states.

### Payout

```text
pending -> approved -> settled
pending/approved -> rejected
```

`settled` requires administrator permission, a unique external reference, settlement timestamp, and balanced ledger posting. No automated transfer is implied.

### Other states

- Media: `quarantine -> processing -> ready | rejected`, then authorized `deleted` lifecycle.
- Dispute: `open -> under_review -> resolved -> closed`.
- Worker verification: `unsubmitted -> pending -> verified | rejected | suspended`.

## 4. Initial non-payment HTTP surface

Round 4 defines exact DTOs and OpenAPI. The following routes are the baseline, not permission to add arbitrary aliases.

| Area | Routes |
| --- | --- |
| Identity | `GET/PATCH /v1/me`, `POST /v1/me/consents`, `DELETE /v1/me` |
| Catalog | `GET /v1/catalog/categories`, `GET /v1/catalog/services`, `GET /v1/catalog/services/{id}` |
| Worker | `GET/PUT /v1/worker/profile`, `PUT /v1/worker/service-area`, `GET/PUT /v1/worker/availability` |
| Jobs | `POST /v1/jobs`, `GET /v1/jobs`, `GET /v1/jobs/{id}`, `PATCH /v1/jobs/{id}`, `POST /v1/jobs/{id}/cancel` |
| Matching | `GET /v1/worker/opportunities`, `POST /v1/worker/opportunities/{id}/accept`, `POST /v1/worker/opportunities/{id}/decline` |
| Quotes | `POST /v1/worker/jobs/{jobId}/quotes`, `GET /v1/jobs/{id}/quotes`, `GET /v1/quotes/{id}`, `POST /v1/quotes/{id}/accept`, `POST /v1/quotes/{id}/reject`, `POST /v1/quotes/{id}/withdraw` |
| Bookings | `GET /v1/bookings`, `GET /v1/bookings/{id}`, `POST /v1/bookings/{id}/start`, `POST /v1/bookings/{id}/complete`, `POST /v1/bookings/{id}/cancel` |
| Media | `POST /v1/media/uploads`, `POST /v1/media/{id}/complete`, `GET /v1/media/{id}/download` |
| Notifications | `PUT /v1/notification-devices/{id}`, `DELETE /v1/notification-devices/{id}`, `GET/PATCH /v1/notification-preferences` |
| Reviews | `POST /v1/bookings/{id}/review`, `GET /v1/workers/{id}/reviews` |
| Disputes | `POST /v1/bookings/{id}/disputes`, `GET /v1/disputes/{id}` |
| Admin | Resource-specific `/v1/admin/users`, `/workers`, `/jobs`, `/quotes`, `/media`, `/reviews`, `/disputes`, `/audit` endpoints |
| Operations | `GET /health/live`, `GET /health/ready`; no public operational data |

All list routes require authorization filters appropriate to the caller. Admin list routes are not a substitute for customer/worker ownership checks.

## 5. Payment HTTP surface, Round 14 only

| Area | Routes |
| --- | --- |
| Customer | `POST /v1/payments/checkout`, `GET /v1/payments/{id}`, `POST /v1/payments/{id}/cancel` |
| Webhook | `POST /v1/webhooks/wix` with raw-body signature verification and event dedupe |
| Admin finance | `GET /v1/admin/payments`, `GET /v1/admin/payments/{id}`, `POST /v1/admin/payments/{id}/reconcile`, `POST /v1/admin/payments/{id}/refunds` |
| Payouts | `GET /v1/admin/payouts`, `POST /v1/admin/payouts`, `POST /v1/admin/payouts/{id}/approve`, `POST /v1/admin/payouts/{id}/settle`, `POST /v1/admin/payouts/{id}/reject` |
| Ledger | `GET /v1/admin/ledger/transactions/{id}`; no create/update/delete ledger endpoint |

Payment creation derives the accepted quote and amount server-side. Webhook acknowledgment and business completion are separate concerns. Repeated, out-of-order, and missed events must be safe. Return URLs never mutate payment state.

## 6. Authorization matrix

Every endpoint test must cover allowed roles, wrong role, wrong owner, unverified worker where relevant, suspended account, and unauthenticated access. Administrators have explicit permissions rather than a universal client-side `isAdmin` flag.

Initial admin permissions:

```text
users:read, users:manage
workers:read, workers:verify
jobs:read, jobs:manage
media:read, media:moderate
reviews:moderate
disputes:read, disputes:resolve
payments:read, payments:reconcile, payments:refund
payouts:read, payouts:approve, payouts:settle
audit:read
```

Financial permissions require step-up/recent administrative authentication before high-risk actions when supported by the chosen Cognito flow. All privileged actions emit audit events with safe before/after metadata.

## 7. Contract generation

Nest DTO/controllers are the source of truth. Round 4 and Round 14 regenerate `openapi.json` and `packages/api-client`. Never edit generated output manually. CI verifies a clean regeneration diff. Native mobile clients require backward-compatible additive changes or a coordinated versioned rollout.
