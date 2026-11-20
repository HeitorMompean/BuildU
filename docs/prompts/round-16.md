# Round 16 — final verification, then independent read-only reviews

## Step 1: send Muse and Claude in parallel after Round 15 merges

### Muse Spark 1.3 — R16-M — full regression and release-candidate verification

```text
Read AGENTS.md, product acceptance scenario, and all runbooks/specifications. Complete only R16-M. Branch muse/16-final-regression; one PR. Lease: NONE.

Writable paths only: packages/testing/**, apps/mobile/tests/**, apps/admin/tests/**, and docs/operations/regression.md. Do not modify production code, contracts, migrations, dependencies, infrastructure, or CI. Production defects must be reported to original owners, not fixed in this assignment.

Create and run a complete release-candidate regression matrix across unit, real PostGIS integration, contract-generation, security, worker/retry, mobile, admin, and E2E suites. Include the original fence-request scenario, concurrent quote acceptance, auth revocation, media quarantine/privacy, notification retries/DLQ, payment checkout with fake provider, forged/repeated/out-of-order/missed Wix events, cancellation/refund, ledger balance/immutability, and unique manual payout settlement. Verify build/container checks and generated diffs where available.

Record exact commands, environment, commit SHA, pass/fail/not-run status, provider mocks, and evidence. Never convert a failure to a mock-only pass or delete tests. No live purchase, payout, deployment, store submission, or real customer data.

Open one PR with the matrix and blockers. Critical/high failures block release; any unrun required item must remain explicitly unverified.
```

### Claude — R16-C — operational runbooks and launch checklist

```text
Read AGENTS.md and all architecture/security/deployment/payment documents. Complete only R16-C. Branch claude/16-runbooks; one PR. Lease: NONE.

Writable paths only: docs/operations/** except regression.md, docs/security/incident-response.md, and docs/privacy/retention-runbook.md. Do not modify code, tests, workflows, infrastructure, or payment evidence.

Create concise actionable runbooks for staging/production deployment, schema-compatible rollback, backup and isolated restore drill, ECS/ALB/RDS/SQS/DLQ incidents, media-processing failures, Cognito/provider outages, Expo/SES failures, Wix webhook/reconciliation lag, refund/payout operational controls, mobile OTA rollback/store rollout, audit investigation, secret rotation, access revocation, privacy deletion/retention, and budget/alert response. Use placeholders for unknown values and no secrets.

Each runbook needs symptoms, verification, immediate containment, safe recovery, escalation, evidence to preserve, and post-incident checks. Never prescribe automatic RDS restore, down migrations, unread DLQ deletion, or unreviewed financial actions. Create a human go/no-go checklist that separates CI evidence, sandbox evidence, production smoke tests, legal/policy readiness, and launch approval.

Check commands/paths against repository files without executing production actions. Open one PR listing verified and unverified procedures.
```

## Step 2: send these reviews independently after R16-M/C merge

### GPT 6.2 — R16-G — final high-risk read-only review

```text
Review latest main read-only after R16-M and R16-C merge. Do not modify files. Post findings to the R16-G issue.

Independently review authentication/authorization, exact-location/media privacy, quote/booking races, transaction/outbox/SQS behavior, payment correlation and Wix signatures, reconciliation/refunds, ledger invariants, manual payout uniqueness, migrations, release/rollback, and secrets handling. Compare implementation and tests against the specifications and R13/R10 findings. Identify any missing test or unsupported readiness claim.

Report confirmed defects separately from hypotheses/unverified provider behavior, with severity, file/line or reproduction, evidence, and owner. Give a high-risk go/no-go recommendation. You are not the final launch approver.
```

### Claude — R16-C-REVIEW — final behavior, privacy, and operations read-only review

```text
Review latest main read-only after R16-M and R16-C merge. Do not modify files. Post findings to the R16-C-REVIEW issue.

Walk the customer, worker, and admin journeys against pilot-scope.md, including accessibility, failure/empty states, role/ownership enforcement, privacy consent/deletion, location/media visibility, review/dispute behavior, notifications, payment status messaging, and finance admin wording. Check that runbooks match actual workflows and do not conceal unverified Wix, restore, rollback, or mobile-release steps.

Report severity, exact evidence/reproduction, affected requirement, and suggested owner. Separate tested behavior from assumptions. Give a behavior/privacy/operations go/no-go recommendation. Final production launch requires explicit human approval after all findings are resolved.
```
