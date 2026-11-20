# Pilot product scope

## Launch workflow

A customer posts a home-service request, including category, details, photos where needed, desired schedule, and location. Eligible nearby workers receive opportunities and submit quotes. The customer selects a quote, completes hosted checkout when payments are enabled, and receives a scheduled booking. After completion, either party can leave an eligible review and open a dispute.

## In scope

- Cognito email/phone authentication as supported by the validated configuration.
- Separate customer/worker experiences in one mobile app.
- Customer job drafts, requests, quotes, bookings, cancellation, and status history.
- Worker profile, skills, service area, availability, opportunities, quotes, and assigned jobs.
- Distance, eligibility, availability, and capacity-aware matching with explainable ranking metadata.
- Private media upload and moderation.
- Push and email notifications with preferences and delivery records.
- Admin verification, moderation, dispute handling, audit, reconciliation, refunds, and manual payout records.
- Wix-hosted customer checkout after a passed spike and human `WIX_OK` approval.
- Accessibility, privacy consent, account deletion workflow, retention policies, and operational runbooks.

## Out of scope for the pilot

- Real-time vehicle tracking or background worker location.
- Bidding auctions, customer-to-worker chat, and dynamic surge pricing.
- Automated worker payouts, escrow, split payments, or stored card handling by our API.
- Multiple currencies, countries, tax jurisdictions, or complex contractor onboarding at launch.
- Public marketplace pages, social login, and offline mutation support unless separately approved.
- Ride-specific UI copied from another app.

## Human policies required before launch

The implementation cannot decide these business/legal questions by itself:

- Launch country, currency, tax treatment, cancellation/refund policy, and platform fee.
- Worker eligibility, insurance, identity/background checks, and dispute evidence policy.
- Data retention/deletion schedule and exact-location visibility policy.
- Supported service categories and prohibited work.
- Customer/worker terms, privacy notice, marketplace liability language, and support contacts.
- Who may approve refunds and external payouts, including dual-control thresholds.

## Acceptance scenario

Using synthetic staging accounts, a verified worker within the service area receives a customer's fence request, submits a quote, and the customer accepts it. Concurrent acceptance cannot create two bookings. Only the assigned worker receives the exact location. The booking can start and complete only through authorized transitions. A review cannot be submitted before completion or duplicated. Notifications retry without duplicating business effects.

When payment is enabled, the amount comes from the accepted quote, a browser return cannot forge payment, missed/repeated/out-of-order Wix events reconcile safely, refunds obey policy, and an admin can record a unique external worker settlement without changing ledger history.
