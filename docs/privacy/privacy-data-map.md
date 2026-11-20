# Privacy data map

| Field | Value |
| --- | --- |
| Assignment | R01-C — security and privacy baseline |
| Status | Draft engineering data map for human, legal, and privacy review. **This is not legal advice and not a privacy notice.** No data is collected yet; nothing here has been implemented. |
| Inputs | Architecture, data/API, file/infrastructure specifications, `docs/operations/configuration.md`, `docs/product/pilot-scope.md` at `main` commit `b616de8` |
| Companions | [`../security/threat-model.md`](../security/threat-model.md), [`../security/security-acceptance-tests.md`](../security/security-acceptance-tests.md) (`SAT-PRIV-*`, `SAT-LOC-*`, `SAT-LOG-*`) |
| Later work | R16-C writes `docs/privacy/retention-runbook.md` from the decisions recorded against this map. |

Retention periods, the launch jurisdiction, the lawful bases, the exact-location visibility policy, and the deletion schedule are **human policy inputs** (`pilot-scope.md`, "Human policies required before launch"). This map shows where each decision plugs in (`R-*` retention inputs in §7, open questions in §9). It does not choose them.

## 1. Classification scheme

| Class | Name | Meaning | Handling baseline |
| --- | --- | --- | --- |
| **S** | Secret | Credentials and keys. Not personal data, but compromise exposes everything else. | Secrets Manager / protected CI environments only; never in code, logs, public config, Terraform outputs, tickets, or prompts. |
| **C3** | Restricted personal | Data whose disclosure can cause physical-safety, financial, or serious privacy harm: precise location, home/dispute media, device tokens, payment metadata linked to a person, verification evidence. | Least-privilege access by named method/permission; encrypted at rest; never in logs, analytics, push text, queue payloads, or error messages; access to precise location by admins audited. |
| **C2** | Confidential personal | Identity and contact data, job/quote/booking content, reviews authored, preferences, coarse location, audit records. | Owner + authorized counterpart + permitted admins only; redacted from logs/telemetry except opaque IDs. |
| **C1** | Internal | Operational data without personal data (metrics, aggregate counts, opaque IDs alone, configuration names). | Internal staff/systems. |
| **C0** | Public | Intentionally published content: catalog, approved public worker display profile and approved review text. | May be served unauthenticated where the contract allows. |

Opaque UUIDs are C1 on their own but become C2 when joined with identifying data. Free-text fields inherit the highest class of what users can plausibly type into them (users may type addresses and phone numbers), so job descriptions, reviews, and dispute statements are handled as **C2 with C3 risk**.

## 2. Data inventory

Columns: **Category** · **Data elements** · **Class** · **Source** · **Purpose** · **Stored in** · **Owning module** (single owner per `system-architecture.md` §4) · **Access** · **Third parties** · **Retention input** (§7).

### 2.1 Identity and account

| Category | Data elements | Class | Source | Purpose | Stored in | Owner | Access | Third parties | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Customer/worker credentials | Email and/or phone, password hash, OTP/MFA state | C2 / S | User via Cognito hosted or SDK flow | Authentication | Cognito customer/worker pool | `auth` (integration), `identity` (lifecycle) | User; Cognito; no app access to passwords | AWS Cognito; SMS/email delivery as configured | R-01 |
| Admin credentials | Email, password hash, TOTP secret | C2 / S | Admin-created accounts | Admin authentication | Cognito admin pool | `auth` | Admin; Cognito | AWS Cognito | R-02 |
| Local profile | Cognito `iss`+`sub`, display name, contact email/phone copy (if stored), locale | C2 | User, Cognito | Account, communications, support | RDS `identity` tables | `identity` | Owner; counterpart sees only approved display fields after match/booking per contract; admins `users:read` | — | R-01 |
| Roles and status | Role membership, account status, suspension reason | C2 | Admin actions, sign-up flow | Authorization | RDS `identity` | `identity` | Owner (own roles/status); admins `users:read`/`users:manage` | — | R-01 |
| Admin permissions | Permission grants, grantor, timestamps | C2 | Admin actions | Authorization | RDS (`identity`/`auth` per R03 design) | `identity` | Admins `users:manage`; audit | — | R-02 |
| Consents | Consent type, document version, timestamp, subject | C2 | User | Evidence of consent/acceptance | RDS `identity` (`consents`) | `identity` | Owner; admins `users:read` | — | R-03 |
| Worker profile | Display name, skills, bio, public photo (if any), verification state | C2 (C0 for approved public fields) | Worker; admin decisions | Matching, trust | RDS `workers` | `workers` | Worker; customers see approved public fields; admins `workers:read` | — | R-01 |
| Worker verification evidence | Whatever the verification policy requires (identity, insurance, licences, background-check outcome) | C3 | Worker / external checks | Eligibility | **Not specified.** Must not be collected until the policy and an ADR define storage (see PQ-07) | `workers` | Admins `workers:verify` | Possible verification vendor (TBD) | R-04 |

### 2.2 Location

| Category | Data elements | Class | Source | Purpose | Stored in | Owner | Access | Third parties | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Customer service location (precise) | Street address, unit, access notes, exact coordinates | **C3** | Customer (manual entry or foreground device location) | Service delivery by assigned worker | RDS `jobs` private location store (dedicated table/columns) | `jobs` | Customer owner; assigned worker only from the state allowed by policy (§3); admins only with the permission to be defined (PQ-02) and audited | Maps/geocoding provider (TBD) receives typed address or device coordinates during entry | R-05 |
| Job coarse location | Derived area (e.g. grid cell / locality) and banded distance | C2 | Derived server-side | Matching, opportunity display | RDS `jobs`/`matching` | `jobs` (derivation), `matching` (use) | Opportunity recipients, owner, admins `jobs:read` | — | R-05 |
| Worker service area | Centre point, radius/polygon | **C3** (centre often = home) | Worker | Matching | RDS `workers` | `workers` | Worker; matching service; admins `workers:read`. Never customers/other workers | Maps provider during editing (TBD) | R-01 |
| Matching snapshots / ranking inputs | Candidate distances, ranking features | C2 (C3 if precise distances retained) | Derived | Explainability, debugging | RDS `matching` | `matching` | Admins `jobs:read`; never returned to workers | — | R-06 |
| Device location at capture time | Foreground coordinates from the OS | C3 | Mobile OS after explicit user action | Pre-fill address | Device memory only; sent to API only when the user submits a job location | Mobile `location/` | User | Maps provider (TBD) | Not retained beyond the job location |

### 2.3 Marketplace records

| Category | Data elements | Class | Source | Purpose | Stored in | Owner | Access | Third parties | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jobs | Service, answers to catalog questions, description, desired schedule, status history | C2 (free text C3-risk) | Customer | Request | RDS `jobs` | `jobs` | Owner; opportunity recipients (non-location fields); assigned worker; admins `jobs:read` | — | R-07 |
| Opportunities | Recipient worker, disposition, timestamps | C2 | System, worker | Matching | RDS `matching` | `matching` | Recipient worker; admins `jobs:read` | — | R-07 |
| Quotes | Line items, totals (minor units), expiry, status history | C2 | Worker | Pricing | RDS `quotes` | `quotes` | Quoting worker; job owner; admins `jobs:read` | — | R-07 |
| Bookings | Assignment, schedule, status history, versions | C2 | System | Engagement | RDS `bookings` | `bookings` | Customer and assigned worker; admins `jobs:read` | — | R-07 |
| Reviews | Rating, text, author, subject, moderation state | C2 (approved public text C0) | Participants | Trust | RDS `reviews` | `reviews` | Public aggregate/approved text per contract; author; admins `reviews:moderate` | — | R-08 |
| Disputes | Statements, evidence references, admin notes, resolution | C2 / C3 (evidence) | Participants, admins | Resolution | RDS `disputes` | `disputes` | Filing party, counterpart (excluding admin notes, per policy), admins `disputes:*` | — | R-09 |

### 2.4 Media

| Category | Data elements | Class | Source | Purpose | Stored in | Owner | Access | Third parties | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Job photos | Image bytes (may show home interior/exterior, people, house numbers); original EXIF/GPS before processing | **C3** | Customer | Describe work | S3 quarantine prefix → processed prefix; RDS `media` metadata | `media` | Owner; workers authorized for the job per contract; admins `media:read`/`media:moderate` | — | R-10 |
| Dispute evidence | Image bytes | **C3** | Participants | Dispute resolution | S3 + RDS `media`, referenced by `disputes` | `media` (storage), `disputes` (reference) | Parties per dispute policy; admins `disputes:read` | — | R-09 |
| Media metadata | Owner, attachment target, random object key, content type, size, state, processing result | C2 | System | Lifecycle | RDS `media` | `media` | System; admins `media:read` | — | R-10 |

EXIF/GPS and other embedded metadata are stripped during processing; only processed `ready` objects are downloadable. Quarantined originals still contain metadata and must be deleted after processing per R-10.

### 2.5 Notifications

| Category | Data elements | Class | Source | Purpose | Stored in | Owner | Access | Third parties | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Device registrations | Expo push token, platform, app/device installation ID, last-seen | **C3** | Mobile app after permission | Push delivery | RDS `notifications` (protected per migration `0011`) | `notifications` | System only; users/admins see platform + masked identifier at most | Expo → Apple APNs / Google FCM | R-11 |
| Preferences | Channel/topic opt-ins | C2 | User | Respect choices | RDS `notifications` | `notifications` | Owner; admins `users:read` | — | R-01 |
| Notification and delivery records | Template ID, recipient ID, channel, provider message ID, attempts, status. **Not** rendered content with addresses. | C2 | System | Reliability, support | RDS `notifications` | `notifications` | System; admins (support) | Expo, AWS SES | R-12 |
| Email content in transit | Rendered email text, recipient address | C2 | System | Notify | Transient; SES | `notifications` | Recipient | AWS SES | Provider retention (PQ-09) |

### 2.6 Payment metadata (only after human `WIX_OK`)

No card data is handled by the API (`pilot-scope.md`: no stored card handling). The architecture plans for payment collection in Wix hosted checkout, only if the spike passes and a human records `WIX_OK`. Which buyer fields Wix returns in orders/events is **unknown until the R02-C spike**; this map must be updated with the proven field list before R11-G.

| Category | Data elements | Class | Source | Purpose | Stored in | Owner | Access | Third parties | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Payment intents/orders | Internal payment ID, correlation ID, booking/quote reference, amount minor + currency, internal status, provider order/transaction IDs | C3 (linked to a person and amount) | System, provider reconciliation | Collect payment, reconcile | RDS `payments` | `payments` | Customer (own payment status); admins `payments:read` | Wix and the payment provider configured in Wix | R-13 |
| Provider events | Provider event ID, type, received-at, verification result, mapped fields; raw payload retention **to be decided** (default: do not retain raw payloads beyond processing; store a hash) | C3 | Wix | Dedupe, audit, reconciliation | RDS `payments` / inbox | `payments`, `operations` | System; admins `payments:read` (redacted) | Wix | R-13 |
| Refunds | Amount, reason code, actor, provider reference, status | C3 | Admin, provider | Refund handling | RDS `payments` | `payments` | Customer (own); admins `payments:*` | Wix | R-13 |
| Ledger | Accounts, transactions, postings (append-only) | C2/C3 (linked to people via accounts) | System | Financial record | RDS `ledger` | `ledger` | Admins with finance permissions | — | R-14 (statutory, legal input) |
| Payouts / external settlements | Worker reference, amount, approval actor, external reference, settlement timestamp | C3 | Admins | Record manual settlement | RDS `payouts` | `payouts` | Worker (own, if exposed by contract); admins `payouts:*` | None by the system; the external transfer happens outside it | R-14 |
| Payee destination | **Not stored by default.** If ever introduced, C3 and subject to SAT-FIN-010. | C3 | — | — | — | `payouts` | — | — | R-14 |

### 2.7 Security and operational records

| Category | Data elements | Class | Source | Purpose | Stored in | Owner | Access | Third parties | Retention |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Audit events | Actor ID, action, target ID, safe before/after metadata, request/correlation ID, timestamp | C2 | System | Accountability, investigation | RDS `audit` (append-only) | `audit` | Admins `audit:read` | — | R-15 |
| Application logs | Request ID, route template, status, latency, opaque IDs, error codes. **Never**: tokens, addresses, coordinates, emails/phones, push tokens, payment payloads, webhook secrets | C1/C2 | API, admin, worker | Operations | CloudWatch Logs | `operations` (policy), each module (emission) | Operators via IAM | AWS | R-16 |
| Diagnostics | Exceptions, breadcrumbs, device/OS model, release; scrubbed as above | C2 | Mobile, admin | Crash/error diagnosis | Sentry | Mobile/admin app owners | Engineering via Sentry access control | Sentry | R-17 |
| Idempotency / inbox / outbox | Keys, payload fingerprints, stored safe responses, event IDs and types | C2 (stored responses may contain personal data the caller could already read) | System | Reliability | RDS `operations`/reliability tables | `operations` | System | — | R-18 |
| Queue messages | Event type + IDs only (SAT-Q-005) | C1 | System | Async processing | SQS (4 days), DLQs (14 days) — `file-and-infrastructure-spec.md` §5 | `operations` | Worker role; operators during DLQ procedure | AWS | Fixed by infra spec |
| Analytics | **No provider selected.** Spec forbids exact addresses, tokens, payment details in analytics. | — | — | — | — | PQ-05 | — | TBD | R-19 |
| Release/CI records | Commit SHAs, image digests, workflow logs (must contain no secrets or customer data) | C1 | CI | Provenance | GitHub, ECR, release records | Release owner (R10-M) | Maintainers | GitHub, AWS, Expo/EAS | R-20 |

### 2.8 Backups and copies

| Copy | What it contains | Life | Deletion implication |
| --- | --- | --- | --- |
| RDS automated backups/snapshots | Full database including C3 | 7 days staging / 14 days production (infra spec §4); final snapshot on production deletion | Deleted rows persist until backup expiry. After any restore, deletions processed since the backup point must be re-applied before the restored data is used (requirement for R16-C restore runbook). |
| S3 object versions | Prior versions of media objects (bucket is versioned) | Lifecycle rules (R-10) | Deleting an asset must delete or expire all versions and delete markers per lifecycle; quarantine originals included. |
| CloudWatch log groups | Redacted logs | R-16 | Not individually erasable; redaction is the primary control. |
| Sentry | Scrubbed events | R-17 | Use provider deletion where available; scrubbing is the primary control. |
| SQS / DLQ | IDs only | 4 / 14 days | Expires automatically. |
| Restore-drill environments | Production-derived copies | Duration of drill only | Isolated, access-restricted, destroyed after drill (SAT-PRIV-004). |
| Developer/test environments | **Synthetic data only.** No production copies. | — | — |

## 3. Precise location visibility

Rows are job/booking states; cells say what each viewer may receive. **Policy** cells are placeholders for the human exact-location policy (threat model G-01) and must not be decided by implementers.

| State | Customer (owner) | Opportunity recipient worker | Other workers | Assigned worker | Admin `jobs:read` | Admin with location permission (PQ-02) | Logs / analytics / Sentry / queue / push |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `draft` | Exact | None | None | n/a | Coarse | Exact, audited | None |
| `open` / `matching` | Exact | Coarse + banded distance | None | n/a | Coarse | Exact, audited | None |
| `awaiting_quote_selection` | Exact | Coarse + banded distance | None | n/a | Coarse | Exact, audited | None |
| Booking `pending_payment` | Exact | None once their quote is superseded | None | **Policy** (default: coarse) | Coarse | Exact, audited | None |
| Booking `scheduled` | Exact | None | None | **Policy** (spec: "after the booking reaches the appropriate state") | Coarse | Exact, audited | None |
| Booking `in_progress` | Exact | None | None | Exact | Coarse | Exact, audited | None |
| Booking `completed` | Exact | None | None | **Policy** (time-limited or removed) | Coarse | Exact, audited | None |
| Booking/job `cancelled` / `expired` | Exact | None | None | **Policy** (default: none) | Coarse | Exact, audited | None |

Media attached to a job follows the same visibility as the job's non-location fields unless the policy treats photos as location-revealing (PQ-03).

## 4. Data flows to third parties

| Recipient | Role | Data sent | Trigger | Notes / open items |
| --- | --- | --- | --- | --- |
| AWS (RDS, S3, SQS, SES, Cognito, CloudWatch, KMS, Secrets Manager) | Infrastructure processor | All stored categories | Always | Region chosen by human; cross-border transfer analysis is a legal input (PQ-10). |
| Wix + its configured payment provider | Payment collection | Planned: custom line-item description, amount, and currency (architecture §5). How an internal correlation reference is carried, and what buyer data the hosted checkout collects directly from the customer, are spike questions | Checkout (post-`WIX_OK`) | Exact fields and Wix's role (processor vs independent controller) unknown until spike + legal review (PQ-08). Line-item text must not include the service address. |
| Expo → APNs / FCM | Push delivery | Device token, notification title/body, opaque deep link | Notification send | Minimal content (SAT-NOTIF-005). |
| Sentry | Diagnostics | Scrubbed error events | Errors/crashes | Region/retention and data-processing terms are inputs (PQ-09). |
| Maps / geocoding provider (TBD) | Address entry, display | Typed address or foreground coordinates; possibly map tiles around the address | Customer location entry; worker map views | Provider not selected (threat model G-10). Prefer not sending exact customer coordinates from worker devices before assignment. |
| Verification vendor (TBD, if any) | Worker checks | Per policy | Worker verification | Not in scope until policy + ADR (PQ-07). |
| GitHub / EAS / AI coding platforms | Source and build | Source code and synthetic fixtures only | Development | No customer data, secrets, or production logs may be pasted into issues, prompts, or PRs. |

## 5. Logging and telemetry rules

1. Logging is **allowlist-based**: structured fields known to be safe (request ID, correlation ID, route template, status, latency, opaque entity IDs, error code, actor ID) — everything else is dropped or redacted.
2. Never log: access/refresh/ID tokens, cookies, `Authorization` headers, admin session material, push tokens, email addresses, phone numbers, street addresses, coordinates, free-text fields, media URLs (presigned), raw webhook/provider payloads, secret values, `Idempotency-Key` payload bodies.
3. Mobile and admin Sentry use `beforeSend`/breadcrumb scrubbing with the same rules; request/response bodies are not attached.
4. Analytics, if introduced, uses opaque IDs and coarse categories only and requires a privacy-map update plus consent decision (PQ-05).
5. Verification: SAT-LOG-001…004 plant unique canary values in synthetic fixtures and search captured output.

## 6. Account deletion (`DELETE /v1/me`)

The specification includes an account deletion workflow and retention policies but does not define the schedule. The engineering design below is the default proposal for the human policy owner to confirm or amend.

| Data | Proposed action on deletion | Executing module | Notes |
| --- | --- | --- | --- |
| Cognito user | Disable immediately; delete after R-01 grace | `identity` via outbox → `auth` provider | Idempotent (SAT-PRIV-003). |
| Local profile, contact data | Erase or irreversibly pseudonymize | `identity` | Keep a pseudonymous subject ID for retained records. |
| Precise locations (customer jobs, worker service area) | Erase | `jobs`, `workers` | Unless an active booking/dispute or legal hold applies (policy). |
| Jobs, quotes, bookings | Retain minimal pseudonymized records for R-07 (financial/dispute linkage), erase free text | `jobs`, `quotes`, `bookings` | Policy input. |
| Media | Delete objects (all versions) and metadata, except evidence under an open dispute/legal hold | `media` | |
| Device registrations | Delete immediately | `notifications` | SAT-NOTIF-004. |
| Preferences, consents | Consents retained as evidence for R-03; preferences erased | `identity`, `notifications` | |
| Reviews | Policy: remove, or keep text anonymized | `reviews` | PQ-06. |
| Disputes | Retain under R-09 / legal hold | `disputes` | |
| Payments, refunds, ledger, payouts | Retain (financial records), linked only to the pseudonymous subject ID | `payments`, `ledger`, `payouts` | Statutory retention (R-13, R-14). |
| Audit events | Retain (append-only); metadata contains IDs, not contact data | `audit` | R-15. |
| Logs, Sentry, backups | Not individually erased; expire per R-16, R-17, backup life; restore re-applies deletions | `operations` | §2.8. |

Preconditions (active booking, open dispute, pending payment/refund/payout) and the user-facing outcome are policy inputs (SAT-PRIV-001).

## 7. Retention inputs and deletion ownership

Every row below needs a human decision before launch. The **technical owner** implements deletion/expiry; the **policy owner** approves the period. The policy-owner role is not yet assigned (PQ-01).

| ID | Data | Retention trigger | Period | Technical owner | Policy owner |
| --- | --- | --- | --- | --- | --- |
| R-01 | Customer/worker account, profile, worker profile/service area, preferences | Account deletion request or inactivity | **TBD** | `identity`, `workers`, `notifications` | TBD |
| R-02 | Admin accounts and permission grants | Offboarding | **TBD** | `identity` / `auth` | TBD |
| R-03 | Consent records | Withdrawal or account deletion | **TBD** (evidence period) | `identity` | TBD |
| R-04 | Worker verification evidence (if collected) | Verification decision / worker exit | **TBD** | `workers` | TBD (legal) |
| R-05 | Customer precise location and coarse derivation | Job closed/cancelled/expired; booking completed | **TBD** | `jobs` | TBD |
| R-06 | Matching snapshots / ranking inputs | Job terminal state | **TBD** | `matching` | TBD |
| R-07 | Jobs, opportunities, quotes, bookings | Terminal state | **TBD** | `jobs`, `matching`, `quotes`, `bookings` | TBD |
| R-08 | Reviews | Publication / account deletion | **TBD** | `reviews` | TBD |
| R-09 | Disputes and dispute evidence | Resolution/closure; legal hold | **TBD** | `disputes`, `media` | TBD (legal) |
| R-10 | Media objects (all S3 versions, quarantine originals) and metadata | Detached, rejected, job/dispute retention end, account deletion | **TBD** | `media` | TBD |
| R-11 | Device registrations | Logout, token invalidation, inactivity, account deletion | **TBD** | `notifications` | TBD |
| R-12 | Notification and delivery records | Sent | **TBD** | `notifications` | TBD |
| R-13 | Payment intents, provider events, refunds | Payment final state | **TBD** (statutory) | `payments` | TBD (finance/legal) |
| R-14 | Ledger and payout/settlement records | Financial year close | **TBD** (statutory) | `ledger`, `payouts` | TBD (finance/legal) |
| R-15 | Audit events | Creation | **TBD** | `audit` | TBD (security/legal) |
| R-16 | CloudWatch application logs | Creation | **TBD** ("environment-appropriate", infra spec §11) | `operations` / Terraform `observability` | TBD |
| R-17 | Sentry events | Creation | **TBD** (provider setting) | Mobile/admin owners | TBD |
| R-18 | Idempotency/inbox/outbox records | Processing complete | **TBD** (bounded by replay window) | `operations` | Engineering |
| R-19 | Analytics (if introduced) | Collection | **TBD** | TBD | TBD |
| R-20 | CI/release records | Creation | **TBD** | Release owner | Engineering |

Fixed by the infrastructure specification (change only via ADR): RDS backups 7 days staging / 14 days production; SQS source 4 days; DLQs 14 days.

## 8. Consents and permissions

| Item | Kind | Captured by | Recorded where | Notes |
| --- | --- | --- | --- | --- |
| Terms of service / marketplace terms | Acceptance (versioned) | Mobile `(auth)/consent.tsx` | `identity` consents | Text is a legal input. |
| Privacy notice acknowledgement | Acknowledgement (versioned) | Mobile `(auth)/consent.tsx` | `identity` consents | Text is a legal input. |
| Device location | OS permission, foreground only | Mobile, after explicit user action | Not recorded as legal consent; app state only | No background location (scope). |
| Push notifications | OS permission + in-app preference | Mobile settings | `notifications` preferences | Request only after clear context (R09-M). |
| Email notifications | Preference | Mobile settings | `notifications` preferences | Transactional vs optional email distinction is a policy input. |
| Analytics / diagnostics | Depends on jurisdiction and provider | TBD | `identity` consents if required | PQ-05, PQ-09. |

## 9. Unresolved legal and privacy inputs

| ID | Question | Blocks |
| --- | --- | --- |
| PQ-01 | Who is the accountable privacy/data-protection owner who approves retention periods and handles data-subject requests? | All of §7 |
| PQ-02 | Which admin permission (if any) grants precise-location access, and is each access audited? (threat model G-02) | SAT-LOC-006, SAT-AUDIT-003 |
| PQ-03 | Exact-location visibility policy: from which booking state does the assigned worker see the address, and when does it end? Are job photos treated as location-revealing? (G-01) | §3, SAT-LOC-* |
| PQ-04 | Launch jurisdiction(s) and applicable privacy law; lawful basis per processing purpose; whether data export/access requests need an in-app route (G-11). | Privacy notice, deletion/export design |
| PQ-05 | Will any product analytics be collected? Which provider, events, and consent model? (G-09) | R-19, consent flow |
| PQ-06 | On account deletion, are reviews removed or anonymized? Are disputes/financial records retained, and for how long? | §6, R-08, R-09, R-13, R-14 |
| PQ-07 | What worker verification evidence is collected, by whom, and is any of it a special-category or criminal-record datum? (pilot-scope: worker eligibility/background checks) | R-04; must not be built before decided |
| PQ-08 | Wix's data role and which buyer fields are returned to the system; whether raw provider payloads may be retained. | §2.6, R-13 — after R02-C |
| PQ-09 | Sentry, Expo, SES, maps provider data-processing terms, regions, and retention settings. | R-12, R-17, §4 |
| PQ-10 | AWS region and any cross-border transfer requirements. | Infrastructure inputs |
| PQ-11 | Minimum age and whether minors may hold accounts. | Sign-up flow, terms |
| PQ-12 | Breach-notification obligations and contacts (input to R16-C `incident-response.md`). | Incident runbook |
| PQ-13 | Whether customers and workers may see each other's names/phone numbers after booking, and whether the platform must mask contact details (no in-app chat is in scope). | Booking DTOs, notifications |

## 10. Maintenance

Update this map in the same PR as any change that adds a data element, a third party, a new copy of data (cache, export, analytics), a retention value, or a change to location/media visibility. Implementation rounds that add a field classified C3 must reference this map in their PR report.
