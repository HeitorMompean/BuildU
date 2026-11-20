# Round 9 — send in parallel after Round 8 review is complete and defects resolved

## Muse Spark 1.3 — R09-M — notifications vertical slice

```text
Read AGENTS.md and notification/reliability specifications. Complete only R09-M. Branch muse/09-notifications; one PR. Lease: NONE.

Writable paths only: non-controller/non-DTO files under packages/backend/src/modules/notifications/**, packages/backend/src/providers/{expo,ses}/**, apps/mobile/src/features/notifications/**, apps/mobile/src/notifications/**, apps/mobile/app/settings/notifications.tsx, and corresponding tests. Do not change contracts, domain, migrations, SQS core, root files, CI, or other mobile features.

Implement notification device registration/removal, preferences, durable delivery records, Expo push and SES email adapters, template selection, safe deep links, retry classification, provider receipt/error recording, and consumer handlers using the existing outbox/SQS seams. Do not send a provider side effect inside the core business database transaction. Never expose device tokens or email content in logs.

Implement mobile push permission and device registration only after clear context, notification settings, and deep-link handling with authentication/ownership enforced by the destination. Handle denied permission, token refresh, logout/removal, and duplicate registration. No background location or unapproved tracking.

Use fake Expo/SES providers in all automated tests. Test preference opt-out, invalid/expired tokens, duplicate/out-of-order deliveries, permanent versus transient provider errors, unsubscribe/deep-link authorization, redaction, and no duplicate logical sends. Run backend/mobile checks. Open one PR with delivery guarantees, test evidence, and unresolved production provider credentials.
```

## Claude — R09-C — reviews and disputes vertical slice

```text
Read AGENTS.md and domain/API specifications. Complete only R09-C. Branch claude/09-reviews-disputes; one PR. Lease: NONE.

Writable paths only: non-controller/non-DTO files under packages/backend/src/modules/{reviews,disputes}/**; apps/mobile/src/features/{reviews,disputes}/**, apps/mobile/app/(customer)/reviews/**, apps/mobile/app/(customer)/bookings/[id].tsx only for review/dispute entry points; apps/admin/src/app/(dashboard)/{reviews,disputes}/**, apps/admin/src/{components,features}/{reviews,disputes}/**, corresponding tests, and only reviews/disputes additions to the BFF allowlist. Do not change domain, contracts, migrations, root files, or notifications.

Implement eligible one-review-per-booking/reviewer behavior after completion, rating constraints, moderation, public aggregate/list behavior, dispute intake with authorized media references, status transitions, admin resolution, and audit events. Keep dispute evidence private. Prevent customers/workers from accessing another party's dispute or admin notes.

Build original accessible mobile review/dispute forms and admin moderation/resolution queues using typed existing contracts. Do not change booking state arbitrarily or automate refunds from dispute resolution.

Add backend unit/PostGIS integration and UI tests for premature/duplicate reviews, wrong participant, completed/cancelled/disputed states, unauthorized evidence, conflicting resolutions, repeated submissions, permissions, and privacy-safe logs. Run focused/repository checks. Open one PR with behavior, tests, and blockers.
```
