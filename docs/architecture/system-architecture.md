# System architecture

Status: accepted baseline for implementation prompts. This is a specification, not evidence that an application or infrastructure has been built.

## 1. Product boundary

Build a two-sided marketplace for scheduled services at home. A customer describes work such as building a fence, eligible nearby workers receive opportunities and submit quotes, the customer selects a quote, and a booking is scheduled. Wix hosted checkout may collect the customer payment only after its spike passes. Worker compensation is settled outside the app and recorded by an administrator.

The pilot has three roles:

- `customer`: owns requests, quotes received, bookings, payments, reviews, and disputes.
- `worker`: owns a worker profile, service areas, availability, opportunities, quotes, assigned bookings, and reviews received.
- `admin`: operates verification, moderation, reconciliation, disputes, refunds, and manual external payout records.

Do not build ride dispatch, instant driver tracking, a background-location service, automated worker transfers, escrow, or a general-purpose chat system in the pilot.

## 2. Fixed technology choices

- TypeScript throughout; pnpm workspaces and Turborepo.
- One React Native/Expo mobile application with role-based customer and worker areas.
- Next.js App Router for the admin application and its server-side backend-for-frontend.
- NestJS for the API and queue-worker composition roots.
- Shared Nest modules in `packages/backend`; pure business rules in `packages/domain`.
- PostgreSQL with PostGIS on Amazon RDS, accessed through Kysely and `pg`.
- AWS ECS/Fargate, ECR, SQS, S3, Cognito, SES, Secrets Manager/SSM, KMS, CloudWatch, Route 53, ACM, and an Application Load Balancer.
- Terraform for AWS; GitHub Actions with GitHub OIDC, not long-lived AWS access keys.
- Expo push notifications, Sentry for mobile/admin diagnostics, Maestro for mobile E2E, and Playwright for admin E2E.
- OpenAPI generated from Nest controllers; the TypeScript client is generated from that document.

Deliberately excluded from the pilot: microservices, Kubernetes, Redis, Kafka, GraphQL, WebSockets, offline mutation queues, background location, and automated worker payouts. Add one only through an approved ADR with a demonstrated requirement.

## 3. Repository and runtime boundaries

```text
apps/
  mobile/                 React Native/Expo customer + worker application
  admin/                  Next.js admin UI, BFF, and public link endpoints
  api/                    Thin NestJS HTTP composition root, port 8080
  worker/                 Thin NestJS SQS consumer composition root
packages/
  backend/                Nest modules, persistence, providers, reliability
  domain/                 Pure TypeScript state machines and invariants
  api-client/             Generated OpenAPI client; no handwritten API calls
  testing/                Fixtures, PostGIS integration support, E2E helpers
infra/
  terraform/              Reusable modules and staging/production roots
docs/                     Binding specifications, ADRs, evidence, and prompts
scripts/                  Repository, database, release, and verification tools
```

`apps/api` and `apps/worker` wire modules but do not contain business rules. `packages/backend` owns transactions and provider adapters. `packages/domain` imports no Nest, database, HTTP, cloud, or UI package. UI applications use `packages/api-client`; they do not import backend modules or construct ad hoc request types.

## 4. Module catalog

These names are stable identifiers. Do not rename them or introduce duplicate modules such as `sessions`, `matches`, or `ledger-entries`.

| Module | Single responsibility |
| --- | --- |
| `auth` | Cognito token validation, principal construction, authorization guards |
| `identity` | Local user profiles, roles, consent, account lifecycle |
| `catalog` | Service categories, service definitions, question schemas |
| `workers` | Worker profiles, skills, verification state, service areas, availability |
| `jobs` | Customer work requests, requirements, location, lifecycle |
| `matching` | Geo/skill/availability candidate selection and opportunity disposition |
| `quotes` | Worker quotes, line items, expiry, selection rules |
| `bookings` | Scheduled engagements and assignment lifecycle |
| `payments` | Provider-neutral payment orchestration and Wix adapter |
| `ledger` | Append-only double-entry financial records |
| `payouts` | Manual approval and external worker-settlement records |
| `media` | Upload authorization, quarantine, processing, authorized downloads |
| `notifications` | Device registration, preferences, push/email delivery records |
| `reviews` | One review per eligible completed booking and participant |
| `disputes` | Dispute intake, evidence references, administrative resolution |
| `audit` | Append-only privileged/security/financial audit events |
| `operations` | Health, scheduled actions, outbox/inbox, reconciliation operations |

A module may depend on another module's exported application service, never its repository or tables directly. Cross-module writes that must be atomic belong in an application service transaction, not in a UI or controller. Domain rules remain deterministic and independently testable.

## 5. Core workflows

### Request to booking

1. Customer authenticates with Cognito; the API resolves the local identity and role.
2. Customer creates a job with service, description, desired schedule, and a private service location.
3. Matching ranks eligible workers using PostGIS distance, skills, verification, availability, and current opportunity limits.
4. Selected workers receive opportunities. Acceptance expresses interest; it does not create a booking or reveal unnecessary customer data.
5. An interested worker submits a quote with line items, total minor units, currency, and expiry.
6. Customer accepts one quote. In one transaction, the quote is accepted, competing quotes become superseded, and a `pending_payment` booking is created.
7. Before payment approval, a non-payment development flow may confirm only where the specification explicitly permits it. Once payments are enabled, server-side payment confirmation is required before the booking becomes `scheduled`.
8. Only the assigned worker sees the precise service location after the booking reaches the appropriate state.
9. Authorized transitions move the booking through `in_progress` and `completed`; every transition writes history and an audit/outbox event as required.

### Payment

1. API creates an internal payment intent with a deterministic correlation ID and amount from the accepted quote, never from the browser.
2. `CustomerPaymentProvider` creates a Wix Cart V2 with custom line items and hosted checkout.
3. Mobile opens hosted checkout. The return URL is only a UX signal and cannot mark anything paid.
4. An authenticated Wix event and/or server-side order/transaction reconciliation establishes the actual state. The event handler is idempotent.
5. Payment confirmation and booking confirmation are coordinated through durable state and outbox processing; no webhook performs unchecked multi-table writes.
6. Refund and cancellation behavior follows accepted policy and provider evidence.
7. Worker payout remains an external manual action. An administrator records a unique external reference and balanced ledger entries. Wix is not represented as providing splits, escrow, or worker transfers.

### Notifications and reliability

Business transactions write outbox records. A scheduler places due work on SQS. The worker uses inbox/idempotency records, retries transient failures, and sends poison messages to the DLQ. Push/email success is never a precondition for committing the core booking transaction.

## 6. State ownership

See `data-and-api-spec.md` for the authoritative state lists and migration allocation. All transitions use explicit domain commands with actor, current state, version, and policy checks. Controllers never accept a free-form target status. Updates that can race use row locks or optimistic versioning. Financial and audit records are append-only.

## 7. API conventions

- Base prefix `/v1`; admin routes use `/v1/admin`; provider webhooks use `/v1/webhooks`.
- JSON uses camelCase; timestamps are ISO 8601 UTC; IDs are UUIDs.
- Money is `{ amountMinor: string, currency: "USD" }` (currency is configured, not assumed for launch). Never use floating-point money.
- Writes use `Idempotency-Key` where retries can create side effects.
- Mutations return the resource and a monotonically increasing version where applicable.
- List endpoints use cursor pagination and bounded page sizes.
- Errors use a stable machine-readable code, human-safe message, request ID, and field details where safe.
- Public location responses are coarse until assignment. Logs and analytics never contain exact addresses, tokens, payment details, or webhook secrets.

## 8. Security and privacy baseline

Use separate Cognito pools for customers/workers and administrators. Admin self-sign-up is disabled and TOTP MFA is required. Access-token validation checks signature, issuer, audience/client, expiry, and `token_use=access`; admin authorization additionally requires local permissions. Cognito identity is not by itself proof of worker verification.

Apply least-privilege IAM and database roles, private subnets for compute/data, TLS, KMS, private S3 objects, media quarantine, short-lived signed downloads, and append-only audit. Secrets exist only in approved secret stores and CI secret bindings. Test fixtures are synthetic.

## 9. Change control

No architecture is honestly guaranteed never to change. Stability comes from module ownership, provider interfaces, generated contracts, append-only migrations, and ADRs. A change to a runtime boundary, data ownership rule, public contract, financial invariant, or excluded technology requires an ADR and human approval before implementation. Backward-incompatible API or schema changes use expand/contract steps rather than breaking deployed clients.
