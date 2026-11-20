# Security acceptance tests — requirements

| Field | Value |
| --- | --- |
| Assignment | R01-C — security and privacy baseline |
| Status | **Requirements only. No test in this document is implemented.** Each row is written so a later round can turn it into an automated or review check without reinterpretation. |
| Traceability | Threat IDs (`CUS-*`, `AC-*`, …) refer to [`threat-model.md`](./threat-model.md). Privacy items refer to [`../privacy/privacy-data-map.md`](../privacy/privacy-data-map.md). Rounds refer to `docs/tasks/rounds.md`. |

## 1. Conventions

**ID format:** `SAT-<AREA>-<NNN>`. IDs are stable; retire an item by marking it *withdrawn* with a reason, never by reusing the ID.

**Level** — where the requirement is proven:

| Code | Meaning |
| --- | --- |
| U | Unit test (pure domain or isolated service with fakes) |
| I | Integration test against **real disposable PostgreSQL/PostGIS** and fake external providers |
| C | Contract/OpenAPI test (route metadata, DTO validation, generated client) |
| E | End-to-end test (Maestro mobile / Playwright admin) with synthetic identities and fake providers |
| S | Static check (Terraform/IaC, workflow lint, secret scan, build-output scan, dependency scan) |
| R | Human or read-only review with recorded evidence (used only where automation is impractical) |

**Gate** — the latest point by which the item must pass:

| Code | Meaning |
| --- | --- |
| NP | Before the non-payment release review (R10-G) |
| PAY | Before payment continuation (R13-C findings resolved) and in R16-M regression. **Gated by human `WIX_OK`.** |
| LAUNCH | Before the human production go/no-go (R16) |

**P** in the *Policy* column means the expected value depends on an open human decision (`threat-model.md` §9, privacy map §9). Until the decision exists, the test must be written against a named configuration value or fixture, and the PR must report the item as *policy-pending*, not *passed*.

## 2. Rules for every implementing round

1. Tests use synthetic identities and data only. No live AWS, Cognito, Wix, Expo, SES, Sentry, or maps calls (`AGENTS.md`).
2. A test expresses specification behaviour. Never weaken an assertion, mark it skipped, or replace a real-database assertion with a mock to obtain a green result. A failing requirement is reported as a defect with severity and owning module.
3. Negative tests assert both the **response** (status + stable error code, no sensitive data) and the **absence of side effects** (no row changed, no outbox record, no audit record claiming success, no provider call).
4. Concurrency tests (`SAT-RACE-*`, `SAT-IDEM-004`, `SAT-FIN-003`) run against real PostgreSQL with genuinely concurrent transactions, and are repeated enough times to be meaningful; the PR records the iteration count.
5. Any item that cannot run (missing tool, missing provider evidence, missing policy) is reported as **not run** with the reason.
6. Wix-specific items (`SAT-WH-*`, parts of `SAT-PAY-*`) are written against the behaviour **proven** by the R02-C spike. If the spike does not prove a capability, the requirement's conservative alternative applies, or the item stays blocked. No test may encode an assumed Wix behaviour.

## 3. Standard authorization matrix (applies to every endpoint)

`data-and-api-spec.md` §6 requires each endpoint test to cover the following principals. This is **SAT-AUTHZ-001**, applied per route:

| Case | Principal | Expected |
| --- | --- | --- |
| a | Unauthenticated (no/invalid token) | 401, stable code, no body data |
| b | Allowed role, owner / assigned party | Success per contract |
| c | Wrong role (e.g. customer on worker route, customer/worker on admin route) | 403 |
| d | Correct role, wrong owner | 404 (non-disclosing) unless the contract specifies 403; never the resource |
| e | Unverified worker (worker routes requiring verification) | 403 with verification error code |
| f | Suspended/disabled local account | 403 with account-status error code, even with an unexpired token |
| g | Admin lacking the specific permission (admin routes) | 403 |

## 4. Requirements

### 4.1 Authentication — Cognito token verification (`SAT-AUTH`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-AUTH-001 | A correctly signed, unexpired customer/worker-pool **access** token with the configured `iss` and `client_id` is accepted and yields a principal resolved from the local identity by (`iss`, `sub`). | U, I | AC-01 | R03-C | NP | |
| SAT-AUTH-002 | Tokens with `alg: none`, an HMAC algorithm, a signature made with a key not in the expected pool's JWKS, a tampered payload, or an unknown `kid` are rejected with 401. Only the configured asymmetric algorithm is accepted. | U | AC-01 | R03-C, R06-C | NP | |
| SAT-AUTH-003 | A token from another environment's pool (e.g. staging issuer presented to production config) is rejected. Startup fails if issuer/client configuration is missing or malformed; there is no fallback pool. | U | COG-01 | R03-C | NP | |
| SAT-AUTH-004 | An admin-pool token is rejected on customer/worker routes and a customer/worker-pool token is rejected on `/v1/admin/*`, including when the `sub` values collide. | U, I | AC-01, COG-01 | R03-C, R06-C | NP | |
| SAT-AUTH-005 | A Cognito ID token (`token_use=id`) is rejected on every route. | U | COG-02 | R03-C | NP | |
| SAT-AUTH-006 | An access token for a different app client in the same pool (`client_id` mismatch) is rejected. | U | AC-01 | R03-C | NP | |
| SAT-AUTH-007 | Expired tokens and tokens outside the allowed clock skew are rejected. JWKS fetch failures fail closed with a safe error; JWKS refetch on unknown `kid` is rate-limited and does not block valid requests indefinitely. | U | AC-01 | R03-C | NP | |
| SAT-AUTH-008 | After a local account is suspended/disabled, the next request with a still-unexpired token is rejected (no wait for token expiry). Logout/suspension revokes refresh capability as supported by the configured Cognito flow. | U, I, E | COG-05, ADM-06 | R03-C, R05-G, R10-C | NP | P (G-05) |
| SAT-AUTH-009 | Deny by default: a generated list of every registered route shows each is either explicitly public (health, links, webhook) or has auth + role/permission metadata. A route with neither fails the check. | C | API-02 | R03-C, R04-G, R14-G | NP | |

### 4.2 Authorization and role escalation (`SAT-AUTHZ`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-AUTHZ-001 | Every endpoint passes the standard authorization matrix (§3). | C, I | AC-02, AC-03 | R04-G, R05-G, R06-G, R06-C, R09-C, R14-G | NP / PAY | |
| SAT-AUTHZ-002 | A customer token cannot call any worker route and vice versa, regardless of mobile navigation guards (requests are sent directly). | I | MOB-02, AC-02 | R06-C | NP | P (G-13) |
| SAT-AUTHZ-003 | Worker routes that require verification reject workers in `unsubmitted`, `pending`, `rejected`, or `suspended` verification state, based on local state only. | U, I | WRK-01 | R03-C, R05-G, R06-G | NP | |
| SAT-AUTHZ-004 | Suspended or deleted accounts are denied on every authenticated route (matrix case f). | I | WRK-01, COG-05 | R05-G, R06-C | NP | |
| SAT-AUTHZ-005 | Mass assignment: requests that include `roles`, `role`, `permissions`, `accountStatus`, `verificationState`, `customerId`, `workerId`, `ownerId`, `status`, `version`, `createdAt`, or any field not in the DTO are rejected (or the field is provably ignored per contract) and nothing changes. | C, I | CUS-02, WRK-02 | R04-G, R05-G, R06-C | NP | |
| SAT-AUTHZ-006 | No route accepts a free-form target status. State changes happen only via named command routes, which reject illegal transitions with a stable error code. | C, U | CUS-02 | R02-G, R04-G | NP | |
| SAT-AUTHZ-007 | Booking `start`/`complete` succeed only for the assigned worker from the permitted state; `cancel` follows the role/state rules of the domain model. Each transition writes history. | U, I | WRK-05 | R02-G, R06-G | NP | |
| SAT-AUTHZ-008 | Each admin route requires its specific permission from data spec §6 at the **API**; an admin with any other permission set receives 403. The BFF check is additional, not a substitute. | I, E | ADM-01 | R03-C, R05-C, R07-C, R09-C, R15-C | NP / PAY | |
| SAT-AUTHZ-009 | `cognito:groups` or any token claim alone never grants an admin permission or role; removing the local permission denies access even when the claim is present. | U | COG-03 | R03-C | NP | |

### 4.3 Object-level access / IDOR (`SAT-IDOR`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-IDOR-001 | Customer B receives 404 for customer A's job detail, quotes list, booking, and dispute, and those resources never appear in B's lists. | I | CUS-01, AC-03 | R05-G, R06-G, R09-C, R06-C | NP | |
| SAT-IDOR-002 | A worker sees an opportunity/job only if they are a recipient of an opportunity for it or the assigned worker; other workers receive 404. | I | AC-03 | R06-G, R06-C | NP | |
| SAT-IDOR-003 | A worker sees only their own quotes; `GET /v1/jobs/{id}/quotes` is limited to the job owner (and admins with `jobs:read`). A competing worker cannot read another quote's line items or total. | I | WRK-04 | R06-G, R06-C | NP | |
| SAT-IDOR-004 | Body references (`mediaIds`, `quoteId`, `bookingId`, evidence references) are validated against the caller's access; a foreign reference is rejected without disclosing whether it exists. | I | AC-03, MED-02 | R06-M, R09-C, R06-C | NP | |
| SAT-IDOR-005 | List filters (`customerId`, `workerId`, etc.) cannot widen scope beyond the caller's ownership on customer/worker routes. | I, C | AC-03 | R04-G, R06-C | NP | |
| SAT-IDOR-006 | Notification devices, preferences, and payment records (post-`WIX_OK`) are accessible only to their owner; foreign IDs → 404. | I | AC-03, AC-09 | R09-M, R14-G | NP / PAY | |

### 4.4 Precise location privacy (`SAT-LOC`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-LOC-001 | Opportunity list/detail responses to workers contain no street address, unit, exact coordinates, or customer contact details; only the coarse area defined by policy. Verified by a schema-level assertion on the serialized DTO (no field, not just null). | C, I | AC-04 | R05-G, R06-G, R06-C | NP | P (G-01) |
| SAT-LOC-002 | Job, quote, and booking responses to any worker who is not the assigned worker in the permitted booking state contain no precise location. | I | AC-04 | R06-G, R06-C | NP | P (G-01) |
| SAT-LOC-003 | Distance shown to unassigned workers is banded/rounded per policy; repeated queries after moving the worker's service-area centre cannot recover the customer coordinates more precisely than the coarse area (triangulation test with ≥3 synthetic vantage points). | I | WRK-03 | R06-G, R06-C | NP | P (G-01) |
| SAT-LOC-004 | Ranking/matching metadata persisted for explainability is never returned to workers or customers, and contains no precise customer coordinates outside the private location store. | I | WRK-03 | R06-G | NP | |
| SAT-LOC-005 | The assigned worker receives the precise location only from the booking state allowed by policy, and the customer always sees their own address. | I, E | AC-04 | R06-G, R07-M, R10-C | NP | P (G-01) |
| SAT-LOC-006 | Admin list endpoints and views do not include precise location. Precise-location reads by admins require the permission defined for it and emit an audit event. | I, E | ADM-03, DB-04 | R05-C, R06-C | NP | P (G-02) |
| SAT-LOC-007 | A worker's service-area geometry is never returned to customers or other workers. | I | WRK-06 | R05-G, R06-C | NP | |
| SAT-LOC-008 | After cancellation (and after completion, per policy), the previously assigned worker's access to precise location ends or is limited as the policy states. | I | AC-04 | R06-G, R10-C | NP | P (G-01) |

### 4.5 Quote/booking concurrency (`SAT-RACE`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-RACE-001 | Two concurrent acceptances of **different** quotes on one job: exactly one succeeds; the other gets a conflict; exactly one booking exists; all other quotes are `superseded`. | I | AC-05 | R06-G, R06-C, R10-C | NP | |
| SAT-RACE-002 | Concurrent acceptance of the **same** quote (same or different idempotency key) yields one booking; the replay returns the original result or a conflict per contract. | I | AC-05 | R06-G, R07-G | NP | |
| SAT-RACE-003 | Acceptance racing worker withdrawal: either the withdrawal wins (accept fails) or acceptance wins (withdraw fails); never an accepted-and-withdrawn quote or a booking for a withdrawn quote. | I | AC-05 | R06-G | NP | |
| SAT-RACE-004 | Acceptance at/after expiry (server time injected) fails; expiry processing does not expire an already accepted quote. | U, I | AC-05 | R02-G, R06-G | NP | |
| SAT-RACE-005 | Acceptance racing job cancellation leaves a consistent result: either a cancelled job with no booking, or a booking per the cancellation policy; no orphaned opportunities or quotes. | I | AC-05 | R06-G | NP | |
| SAT-RACE-006 | Booking (and later payment intent) amount equals the sum of the accepted quote's immutable line items in exact minor units and its currency; any client-supplied amount/currency is rejected or ignored and has no effect. | U, I, C | CUS-03 | R02-G, R06-G, R06-C | NP | |
| SAT-RACE-007 | A worker cannot hold two active bookings with overlapping scheduled windows (if the domain model defines this rule); concurrent assignments are serialized. | I | AC-05 | R06-G | NP | P |
| SAT-RACE-008 | Start/complete/cancel racing each other on one booking yields one legal final state; stale `version` → conflict; history has no impossible sequence. | I | WRK-05 | R06-G | NP | |

### 4.6 Idempotency (`SAT-IDEM`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-IDEM-001 | Repeating a side-effecting request with the same key and same payload performs the effect once and returns the stored safe response. | I | API-03 | R07-G | NP | |
| SAT-IDEM-002 | Reusing a key with a different payload returns a conflict error and performs nothing. | I | API-03 | R07-G, R06-C | NP | |
| SAT-IDEM-003 | Keys are scoped to principal + route: user B using user A's key neither replays A's response nor blocks B's request. | I | API-03 | R07-G, R06-C | NP | |
| SAT-IDEM-004 | Concurrent requests with the same key produce one effect; the loser waits or receives a defined in-progress/conflict response. | I | API-03 | R07-G | NP | |

### 4.7 API surface hygiene (`SAT-API`, `SAT-LOG`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-API-001 | List endpoints enforce a maximum page size; larger requests are clamped or rejected per contract. | C | API-05 | R04-G | NP | |
| SAT-API-002 | Tampered, foreign, or malformed cursors are rejected and cannot change the authorization scope of a list. | C, I | API-05 | R04-G, R06-C | NP | |
| SAT-API-003 | `/health/live` and `/health/ready` disclose only status (no versions, hosts, config, dependency errors). | C | API-07 | R01-M, R04-G | NP | |
| SAT-LOG-001 | Captured logs from the full non-payment E2E run contain no street addresses, precise coordinates, phone numbers, or emails of synthetic users (detected by planting unique canary values in fixtures and searching log output). | I, E | AC-04, API-04 | R06-C, R10-C | NP | |
| SAT-LOG-002 | Logs, errors, and Sentry events contain no secrets, provider API keys, webhook verification material, or raw payment/webhook payloads (canary-based). | I, E | WIX-05, API-04 | R06-C, R12-M, R16-M | NP / PAY | |
| SAT-LOG-003 | No access/refresh/ID token, admin session cookie, or device push token appears in logs, error responses, or mobile/admin Sentry events (canary-based; Sentry `beforeSend`/scrubbing tested with a fake transport). | U, I | MOB-01, AC-09 | R03-C, R04-M, R04-C, R09-M | NP | |
| SAT-LOG-004 | Error responses use stable codes and human-safe messages with a request ID; no stack traces, SQL, internal hostnames, or echoed sensitive input. | C, I | API-04 | R04-G, R06-C | NP | |

### 4.8 Admin session and BFF (`SAT-ADM`, `SAT-BFF`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-ADM-001 | Admin session cookie is `HttpOnly`, `Secure`, `SameSite` (Lax or Strict), host-scoped, and contains no readable token. | E, I | AC-10 | R04-C | NP | |
| SAT-ADM-002 | State-changing BFF requests without a valid CSRF token or with a foreign `Origin` are rejected and cause no upstream call. | I, E | BFF-03 | R04-C | NP | |
| SAT-ADM-003 | Session identifier is rotated on sign-in; a pre-login identifier cannot be used after sign-in (fixation). | I | AC-10 | R04-C | NP | |
| SAT-ADM-004 | Disabling an admin or removing a permission takes effect on the next request in an existing session. | I, E | ADM-06 | R04-C, R10-C | NP | |
| SAT-ADM-005 | Idle and absolute session timeouts are enforced per configured values. | I | AC-10 | R04-C | NP | P (G-05) |
| SAT-ADM-006 | High-risk financial actions (refund, payout approve/settle) require recent authentication via the mechanism selected for step-up; stale sessions are challenged. If no mechanism is supported, the PR reports the action blocked rather than simulating step-up. | I, E | AC-10, AC-12 | R04-C, R15-C | PAY | P (G-03) |
| SAT-BFF-001 | Only allowlisted method + path templates are proxied; any other path (including other `/v1/admin/*` routes not yet allowlisted) returns 404 without an upstream call. | I | BFF-01 | R04-C and each admin feature round | NP | |
| SAT-BFF-002 | Path traversal (`..`, encoded `%2e%2e`, double slashes), absolute URLs, and host-header manipulation cannot change the upstream host or route. | I | BFF-01 | R04-C | NP | |
| SAT-BFF-003 | BFF checks the admin's permission before proxying and the API independently re-checks (SAT-AUTHZ-008); a BFF bypass (calling the API with a stolen BFF-side request shape) still fails without a valid admin token. | I | ADM-01 | R04-C | NP | |
| SAT-BFF-004 | No admin access/refresh token, Cognito client secret, or session secret is present in HTML, RSC payloads, client bundles, or `NEXT_PUBLIC_*` variables (scan of production build output and of rendered responses for canaries). | S, E | BFF-02 | R04-C | NP | |
| SAT-BFF-005 | Sign-in callback and `open/[...path]` only redirect to allowlisted destinations; external/attacker URLs are refused. | I | BFF-04 | R04-C | NP | |
| SAT-BFF-006 | Admin responses include CSP (with `frame-ancestors 'none'` or equivalent), `X-Content-Type-Options: nosniff`, and a restrictive referrer policy. | I | BFF-05 | R04-C | NP | |
| SAT-BFF-007 | User-supplied text (job descriptions, reviews, dispute statements, names) containing HTML/JS payloads renders inert in every admin view. | E | CUS-04 | R05-C, R07-C, R09-C | NP | |
| SAT-BFF-008 | AASA and `assetlinks.json` are served with correct content type, contain only configured identifiers, and contain no secrets; missing identifiers fail validation instead of using invented values. | I | BFF-07 | R04-C | NP | |

### 4.9 Cognito configuration (`SAT-COG`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-COG-001 | Admin pool: self-sign-up disabled (admin-create-only). | S | COG-06 | R01-M, R02-M | NP | |
| SAT-COG-002 | Admin pool: MFA required with TOTP. | S | COG-06 | R01-M, R02-M | NP | |
| SAT-COG-003 | Separate customer/worker and admin pools exist per environment; no pool or client is shared across environments. | S | COG-01 | R01-M, R02-M | NP | |
| SAT-COG-004 | No app client has write permission on any attribute used for authorization; the application derives no role/permission/verification from user-writable attributes. | S, U | COG-03, WRK-02 | R01-M, R03-C | NP | |
| SAT-COG-005 | User-existence error prevention is enabled; sign-in/sign-up/reset responses do not reveal whether an account exists. Abuse-protection features are configured only as available in the selected Cognito tier (documented, not assumed). | S, R | COG-04 | R01-M, R03-C | LAUNCH | |

### 4.10 Mobile (`SAT-MOB`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-MOB-001 | Tokens are stored only via the platform secure-storage wrapper; no token in AsyncStorage, files, or logs (static check for forbidden storage calls + unit tests on the storage module). | U, S | MOB-01 | R04-M | NP | |
| SAT-MOB-002 | Mobile Sentry/scrubbing removes tokens, addresses, coordinates, and device tokens from events and breadcrumbs (fake transport). | U | MOB-01, AC-04 | R04-M | NP | |
| SAT-MOB-003 | Deep links to resources the signed-in user does not own show a safe not-found state; links carry only opaque IDs. | E | MOB-03 | R04-M, R09-M, R10-C | NP | |
| SAT-MOB-004 | Built mobile config (`EXPO_PUBLIC_*`, `app.config.ts` extra) contains only the documented public keys; scan finds no secret patterns. | S | MOB-04 | R04-M, R02-M | NP | |
| SAT-MOB-005 | The app declares and requests foreground location only, only after explicit user action, and offers manual entry when permission is denied. No background-location permission in the native manifest/Info.plist. | S, E | MOB-05 | R05-M, R07-M | NP | |
| SAT-MOB-006 | User-supplied text renders as plain text in mobile views; no HTML/WebView rendering of user content. | U, E | CUS-04 | R05-M, R07-M, R09-C | NP | |

### 4.11 Database (`SAT-DB`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-DB-001 | Connected as the runtime role: `CREATE`/`ALTER`/`DROP`/`TRUNCATE`, disabling triggers, and UPDATE/DELETE on audit (and later ledger) tables all fail. | I | DB-01 | R03-M, R07-G, R11-G | NP / PAY | |
| SAT-DB-002 | Runtime task definitions contain no migrator credentials; migrations run only in the standalone migration task. | S | DB-01 | R01-M, R10-M | NP | |
| SAT-DB-003 | Precise location is readable only through the designated repository method(s); a static/boundary check flags other modules or queries selecting the private location columns. Reporting role access is limited to explicitly authorized views. | S, I | DB-04 | R03-M, R05-G | NP | |
| SAT-DB-004 | Injection payloads in every string/sort/filter/geo input are treated as data; sort/filter fields are allowlisted; geo radius/coordinates are bounds-checked. | I | API-06 | R05-G, R06-G, R06-C | NP | |
| SAT-DB-005 | CI fails if a merged migration file changes (checksum/immutability check). | S | DB-05 | R03-M, R02-M | NP | |

### 4.12 Queue and worker (`SAT-Q`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-Q-001 | Queue policies allow send only from the designated publisher role(s) and receive/delete only from the worker role (IaC check). | S | Q-01 | R01-M, R02-M | NP | |
| SAT-Q-002 | A message with an unknown event type, invalid schema, or referencing a non-existent/foreign entity is rejected without side effects; handlers act on re-read database state, not on message claims (e.g. a "booking scheduled" message for a `pending_payment` booking changes nothing). | I | Q-01 | R08-M, R08-C | NP | |
| SAT-Q-003 | Duplicate and out-of-order delivery of the same logical event yields at most one logical side effect (one notification delivery record, one state change). | I | Q-02 | R07-G, R08-M, R08-C, R09-M | NP | |
| SAT-Q-004 | Redrive of DLQ messages after a fix does not duplicate side effects that already succeeded. | I | Q-02 | R08-C | NP | |
| SAT-Q-005 | Message bodies contain IDs and event types only — no addresses, tokens, emails, or payment payloads (schema test on every published event). | U, I | Q-03 | R07-G, R08-C | NP | |
| SAT-Q-006 | A poison message reaches the DLQ after `maxReceiveCount=5` without blocking other messages or retrying indefinitely in-process. | I | Q-04 | R08-M, R08-C | NP | |
| SAT-Q-007 | Multiple scheduler instances and a crash after claim result in each due action executing once logically; expired leases are reclaimable. | I | Q-05 | R07-G | NP | |

### 4.13 Media (`SAT-MEDIA`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-MEDIA-001 | Upload authorization is short-lived and constrained to one random key, the declared type, and ≤ 10 MiB; completion re-checks the stored object's actual size and rejects mismatches or expired authorizations. | I | AC-08 | R06-M | NP | |
| SAT-MEDIA-002 | Type is detected from bytes; spoofed MIME/extension, SVG, HTML, executables, and detectable polyglots are rejected. | I | AC-08 | R06-M, R06-C | NP | |
| SAT-MEDIA-003 | Malformed images, decompression bombs (pixel-count limit), and oversize dimensions are rejected without exhausting worker memory/time. | I | AC-08 | R06-M, R08-M | NP | |
| SAT-MEDIA-004 | Processed assets contain no EXIF/GPS/XMP metadata (fixture with known GPS tags). | I | MED-05 | R06-M | NP | |
| SAT-MEDIA-005 | Assets in `quarantine`, `processing`, `rejected`, or `deleted` cannot obtain a download URL by any customer or worker. Admin preview of non-`ready` assets is allowed only if the API contract defines it for `media:moderate`, and is audited. | I | AC-08 | R06-M, R07-C | NP | |
| SAT-MEDIA-006 | An asset can be attached only to a resource the uploader can access; downloads are authorized against the attached resource and the caller's access to it. | I | MED-02 | R06-M, R09-C, R06-C | NP | |
| SAT-MEDIA-007 | Download URLs are short-lived (configured TTL), issued only after authorization, never logged, and expire as configured. | I | MED-03 | R06-M, R07-C | NP | |
| SAT-MEDIA-008 | Object keys are unpredictable (no user IDs, filenames, or sequence); bucket blocks public access; runtime roles cannot list the bucket broadly. | I, S | MED-04 | R01-M, R06-M | NP | |

### 4.14 Notifications (`SAT-NOTIF`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-NOTIF-001 | No API response (customer, worker, or admin) returns a full device push token. | C, I | AC-09 | R04-G, R09-M | NP | |
| SAT-NOTIF-002 | Device tokens are stored protected per migration `0011` and never appear in logs or Sentry (canary). | I | AC-09 | R03-M, R09-M | NP | |
| SAT-NOTIF-003 | Registering a device binds it to the authenticated user; registering a token already bound to another user transfers it (it is not shared) and is recorded. A user cannot register or delete another user's device record. | I | AC-09 | R09-M | NP | |
| SAT-NOTIF-004 | Logout and account deletion remove/deactivate the user's device registrations; subsequent notifications for that user are not sent to the device. | I, E | AC-09 | R09-M, R10-C | NP | |
| SAT-NOTIF-005 | Push and email content contains no precise address, access codes, or payment details; deep links are opaque. | U | MOB-07, AC-04 | R09-M | NP | |
| SAT-NOTIF-006 | Provider "invalid/unregistered token" results deactivate the token; preferences/opt-out are honoured; deep-link destinations re-check authorization. | I | AC-09 | R09-M | NP | |

### 4.15 Reviews and disputes (`SAT-REV`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-REV-001 | A review can be submitted only by a participant of a completed booking, once per booking and participant (concurrent duplicates → one review). | I | WRK-07 | R09-C | NP | |
| SAT-REV-002 | Dispute evidence and admin notes are visible only to authorized participants/admins; the other party cannot read admin notes. | I | WRK-07, AC-03 | R09-C | NP | P |
| SAT-REV-003 | Public review listings expose only approved display fields (no contact data, no location). | C, I | AC-04 | R09-C | NP | |

### 4.16 Audit (`SAT-AUDIT`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-AUDIT-001 | UPDATE and DELETE on audit rows fail for the runtime role and are rejected by trigger for any role other than an explicitly documented break-glass path (if any). | I | AC-11 | R03-M | NP | |
| SAT-AUDIT-002 | Every privileged admin route and every security-relevant event (sign-in failures where observable, permission changes, verification decisions, moderation, exact-location access, refunds, payouts) emits exactly one audit event with actor, action, target, safe before/after metadata, and request/correlation ID. A route-level test enumerates privileged routes and fails on any without an audit assertion. | C, I | AC-11, ADM-05 | R05-G, R05-C, R06-C, R11-G, R14-G | NP / PAY | |
| SAT-AUDIT-003 | Precise-location reads by admins produce an audit event (see SAT-LOC-006). | I | ADM-03 | R05-G, R05-C | NP | P (G-02) |
| SAT-AUDIT-004 | The audit actor is taken from the verified principal; actor/target values supplied in request bodies are ignored. | I | AC-11 | R05-G, R06-C | NP | |
| SAT-AUDIT-005 | If the privileged change rolls back, no success audit event persists; if the audit write fails, the privileged change does not commit. | I | AC-11 | R05-G, R11-G | NP | |

### 4.17 Payments and webhooks (`SAT-PAY`, `SAT-WH`) — gated by `WIX_OK`

Implementation and testing of this section must not begin until a human records `WIX_OK` in `docs/spikes/wix/GO-NO-GO.md`. Provider-neutral items run against the fake provider from R11-G.

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-PAY-001 | Checkout creation derives amount and currency from the accepted quote on the server; a request body amount/currency/quote total is rejected or ignored with no effect on the provider request. | U, I, C | CUS-03 | R11-G, R12-M, R14-G | PAY | |
| SAT-PAY-002 | No API route accepts a return-URL assertion of payment; a "paid" signal from the client changes nothing. | C, I | AC-06 | R14-G | PAY | |
| SAT-PAY-003 | The links-host return route and the mobile return screen perform no mutation, render neutral status, and fetch authoritative state; a crafted `status=paid` URL leaves the booking `pending_payment`. | I, E | AC-06 | R04-C, R15-M, R16-M | NP (route) / PAY | |
| SAT-PAY-004 | Reconciliation with a provider amount or currency different from the internal intent does not enter `paid`; it records a mismatch for admin review and audits it. | I | WIX-03 | R11-G, R12-M | PAY | |
| SAT-PAY-005 | Provider correlation is unique: one provider order ↔ one internal payment; an event for an unknown or differently-correlated order changes no payment. | I | WIX-04 | R11-G, R12-M | PAY | |
| SAT-WH-001 | A webhook failing the authenticity check proven by the spike is rejected and changes nothing. If no authenticity mechanism is proven, the handler treats every event as an untrusted trigger that only schedules server-side reconciliation, and a forged event cannot change state. | I | AC-07 | R12-M, R14-G | PAY | |
| SAT-WH-002 | Replaying an accepted event (same provider event identity) is acknowledged per policy and produces no further effect. | I | AC-07 | R11-G, R12-M, R14-G | PAY | |
| SAT-WH-003 | Modifying any byte of an authenticated body while keeping headers fails verification (raw bytes, not re-serialized JSON, are verified — only if a body-signing mechanism is proven). | I | AC-07 | R12-M, R14-G | PAY | |
| SAT-WH-004 | Out-of-order events (e.g. refund before paid, cancelled after paid) never produce an illegal transition; the system parks or reconciles them. | I | AC-07 | R11-G, R12-M | PAY | |
| SAT-WH-005 | Missed events are recovered by scheduled reconciliation within the configured lag, using only the reconciliation capability proven by the spike. | I | AC-07 | R11-G, R12-M | PAY | |
| SAT-WH-006 | The webhook route preserves raw bytes before JSON parsing and enforces a body-size limit. | C, I | AC-07 | R14-G | PAY | |
| SAT-WH-007 | Acknowledgement is independent of business completion: a downstream failure after durable inbox write still acknowledges per policy and is retried internally; errors returned to the provider contain no internal details. | I | AC-07 | R14-G | PAY | |

### 4.18 Ledger, refunds, and manual payouts (`SAT-FIN`) — gated by `WIX_OK`

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-FIN-001 | Settling an already `settled` payout (same or different idempotency key) fails with a conflict and creates no ledger transaction. | I | AC-12 | R11-G, R14-G, R15-C | PAY | |
| SAT-FIN-002 | An external settlement reference can be used once; reuse on another payout fails at the database constraint and the API. `settled` requires reference, settlement timestamp, permission, and audit. | I | AC-12, PAY-04 | R11-G | PAY | |
| SAT-FIN-003 | Two concurrent settle commands for one payout result in one settlement and one ledger transaction. | I | AC-12 | R11-G | PAY | |
| SAT-FIN-004 | A payout can be created only for an earning/booking eligible under policy (e.g. completed, not under unresolved dispute) and only once per earning. | I | WRK-07, AC-12 | R11-G | PAY | P (G-04) |
| SAT-FIN-005 | Refunds are idempotent, never exceed the refundable amount computed server-side, require `payments:refund`, and follow policy eligibility; duplicate refund submissions produce one refund. | I | WIX-07 | R11-G, R14-G, R15-C | PAY | P |
| SAT-FIN-006 | `payouts:approve` and `payouts:settle` are separate permissions; dual-control/segregation rules (approver ≠ settler, thresholds) are enforced as configured. If the policy requires dual control and it is unsupported, the action is unavailable and reported, not simulated. | I, E | ADM-04, PAY-04 | R11-G, R15-C | PAY | P (G-04) |
| SAT-FIN-007 | No UI copy, API description, or log message states or implies that Wix performs escrow, split payments, or worker transfers, or that the system executes payouts. | R | WIX-06 | R13-C, R15-C, R16-C-REVIEW | PAY | |
| SAT-FIN-008 | Ledger transactions with <2 postings, mixed currencies, or unequal debit/credit sums fail to commit. | I | PAY-02 | R11-G | PAY | |
| SAT-FIN-009 | Ledger and payout history are append-only for application roles; corrections are reversing transactions; no ledger create/update/delete endpoint exists. | I, C | PAY-03 | R11-G, R14-G | PAY | |
| SAT-FIN-010 | If any payee-destination data is ever stored (currently not planned), every change is audited and places pending payouts on hold. Otherwise, a check confirms no such fields exist. | I, S | PAY-05 | R11-G | PAY | P (G-08) |

### 4.19 Privacy lifecycle (`SAT-PRIV`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-PRIV-001 | `DELETE /v1/me` applies the policy's preconditions (e.g. active booking/dispute/payment handling) and reports a stable outcome. | I | CUS-06 | R05-G | NP | P |
| SAT-PRIV-002 | After deletion, the user's direct identifiers, precise locations, media, and device tokens are erased or irreversibly pseudonymized per the privacy map; retained financial/audit/dispute records reference only a pseudonymous ID. | I | CUS-06 | R05-G, R06-M, R09-M | NP | P |
| SAT-PRIV-003 | Deletion triggers removal/disablement of the Cognito user and of device registrations via the outbox, and is idempotent under retry. | I | CUS-06 | R05-G, R09-M | NP | P |
| SAT-PRIV-004 | No production data is copied to staging, CI, or test fixtures; restore drills use isolated resources and are destroyed per runbook. | S, R | DB-03 | R10-M, R16-C | LAUNCH | |
| SAT-PRIV-005 | Consents are recorded with version, timestamp, and subject; the required consents are captured before the data they cover is collected. | I, E | — (privacy map §8) | R05-G, R05-M | NP | P |

### 4.20 Infrastructure (`SAT-INFRA`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-INFRA-001 | RDS is not publicly accessible, sits in data subnets, and its SG allows 5432 only from runtime and migration SGs. Production has deletion protection. | S | DB-02 | R01-M, R02-M | NP | |
| SAT-INFRA-002 | Media bucket(s): block public access on, encryption on, versioning on, no public policy/ACL, CORS limited to approved origins. | S | MED-04 | R01-M, R02-M | NP | |
| SAT-INFRA-003 | No resource (state, KMS key, pool, bucket, queue, secret) is shared between staging and production; compute has no public IP; worker SG has no inbound rule. | S | CI-01, COG-01 | R01-M, R02-M | NP | |
| SAT-INFRA-004 | RDS snapshots and backups are encrypted with environment-scoped KMS keys; no snapshot is shared cross-account. | S | DB-03 | R01-M, R02-M | NP | |
| SAT-INFRA-005 | Terraform state backend is encrypted and non-public; no output exposes secret values. | S | CI-06 | R01-M, R02-M | NP | |

### 4.21 CI/CD and supply chain (`SAT-CICD`)

| ID | Requirement and expected result | Level | Threats | Rounds | Gate | Policy |
| --- | --- | --- | --- | --- | --- | --- |
| SAT-CICD-001 | Each OIDC role trust policy restricts `sub` to this repository and the specific protected environment (or exact ref) it serves; a fork, other branch, or other environment cannot assume it. | S | CI-01 | R01-M, R02-M | NP | |
| SAT-CICD-002 | Pull-request workflows can assume at most a read-only plan role; no PR workflow has apply/deploy permissions. | S | CI-01 | R02-M | NP | |
| SAT-CICD-003 | No workflow uses `pull_request_target` with a checkout of PR head code; every job declares minimal `permissions:`. | S | CI-02 | R02-M, R10-M | NP | |
| SAT-CICD-004 | Secret scanning runs on the repository, workflow logs policy, admin build output, and mobile public config; a planted synthetic canary secret is detected. | S | BFF-02, MOB-04, WIX-05 | R02-M | NP | |
| SAT-CICD-005 | Third-party actions are pinned to full commit SHAs; installs use the frozen lockfile; dependency, IaC, and container scans run and fail on configured severities. | S | CI-03 | R02-M, R10-M | NP | |
| SAT-CICD-006 | OTA updates and store submissions require manual approval in a protected environment, target a compatible fingerprint runtime, and go to staging channels first; signing is enabled where the approved EAS configuration supports it. | S, R | CI-05 | R10-M | LAUNCH | |
| SAT-CICD-007 | Production deploys reference the exact image digests recorded for the staging release; tags are not used for deployment. | S, R | CI-04 | R10-M | LAUNCH | |
| SAT-CICD-008 | Branch protection on `main` requires PR, human approval (author excluded), passing checks, and resolved conversations; no platform has bypass rights; CODEOWNERS covers ROOT/CONTRACTS/DB surfaces. Verified by recorded settings evidence. | R | CI-07 | R01-M (CODEOWNERS), human setup | NP | |
| SAT-CICD-009 | No workflow or script automatically applies Terraform, restores RDS, runs down migrations, or executes payouts (static search of workflows/scripts + review). | S, R | CI-08 | R02-M, R10-M | NP | |

## 5. Coverage summary

| Abuse case (threat model §7) | Primary requirements |
| --- | --- |
| AC-01 Token confusion | SAT-AUTH-001…007 |
| AC-02 Role escalation | SAT-AUTHZ-001…009, SAT-COG-004 |
| AC-03 IDOR | SAT-IDOR-001…006, SAT-AUTHZ-001 |
| AC-04 Exact-location leakage | SAT-LOC-001…008, SAT-LOG-001, SAT-MEDIA-004, SAT-NOTIF-005 |
| AC-05 Quote/booking races | SAT-RACE-001…008, SAT-IDEM-001…004 |
| AC-06 Forged payment returns | SAT-PAY-002, SAT-PAY-003 |
| AC-07 Webhook replay/forgery | SAT-WH-001…007 |
| AC-08 Malicious media | SAT-MEDIA-001…008 |
| AC-09 Notification-token theft | SAT-NOTIF-001…006, SAT-LOG-003 |
| AC-10 Admin session risk | SAT-ADM-001…006, SAT-BFF-001…007 |
| AC-11 Audit tampering | SAT-AUDIT-001…005, SAT-DB-001 |
| AC-12 Duplicate settlement | SAT-FIN-001…003, SAT-FIN-006 |

## 6. Reporting format for implementing rounds

Each PR that implements or runs items from this document includes a table:

```text
| SAT ID | Test file / evidence | Result (pass / fail / not run / policy-pending) | Notes |
```

A failing or not-run item is never omitted. Critical/high failures block the round per `docs/tasks/rounds.md`.
