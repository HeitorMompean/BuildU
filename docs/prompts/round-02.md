# Round 2 — send in parallel after Round 1 is merged and green

## GPT 6.2 — R02-G — non-payment domain

```text
Read AGENTS.md and the architecture/data specifications. Complete only R02-G. Branch gpt/02-domain-rules from latest main; one PR. Lease: CONTRACTS.

Writable paths only: packages/domain/**. Do not modify payments, ledger, payouts, database, API controllers, generated clients, dependencies, or infrastructure.

Implement pure TypeScript domain primitives and non-payment rules: UUID/branded IDs where appropriate, exact minor-unit money, time policy, roles/permissions, job/quote/booking state machines, worker eligibility, deterministic matching/ranking, review eligibility, and dispute transitions. Resolve the data-spec ambiguity about booking disputed state by using a separate dispute association unless an approved ADR says otherwise. Do not implement payment states yet.

Enforce actor authorization inputs, terminal-state rules, quote expiry, one accepted quote per job, assignment invariants, schedule ordering, currency consistency, and monotonic version expectations. Functions must not depend on Nest, database, wall-clock globals, randomness, HTTP, or cloud services; inject time and ranking inputs.

Add exhaustive unit tests for valid and invalid transitions, boundaries, concurrent-decision outcomes represented by domain results, distance/eligibility ranking, and currency/overflow-safe money behavior. Run package tests plus repository lint/typecheck/build. Open one PR with checks and any blockers; do not edit out-of-scope files to fix them.
```

## Muse Spark 1.3 — R02-M — infrastructure pipelines

```text
Read AGENTS.md and docs/architecture/file-and-infrastructure-spec.md. Complete only R02-M. Branch muse/02-infrastructure-pipelines; one PR. Lease: ROOT.

Writable paths only: .github/workflows/{ci.yml,security.yml,infrastructure.yml}, scripts/verification/**, infra/terraform/**, and infra/tests/** if already supported by the selected toolchain. Do not implement application features or release/mobile workflows yet.

Complete CI and infrastructure validation for the Round 1 baseline: frozen pnpm install, caching that does not hide lockfile changes, lint/typecheck/test/build, generated-boundary placeholders that do not falsely pass, Terraform fmt/validate, IaC and dependency/secret scanning using already approved or newly ROOT-approved pinned tools, and a pull-request plan workflow with no apply permission. Use GitHub OIDC roles and environment protection; never create long-lived AWS keys.

Add static Terraform tests/checks for private RDS/S3, blocked public access, environment separation, queue redrive, no public compute, required tags, deletion protection, and placeholder validation. Keep costs and missing inputs explicit. Terraform plan is allowed only in the authorized read-only CI role; no apply.

Run local/CI-equivalent checks available to you. Open one PR documenting workflows, required GitHub secrets/variables without values, checks, and any unverified AWS behavior.
```

## Claude — R02-C — Wix capability spike

```text
Read AGENTS.md, payment sections of the architecture/data specs, and official current Wix documentation. Complete only R02-C. Branch claude/02-wix-spike; one PR. Lease: NONE.

Writable paths only: docs/spikes/wix/**. Do not implement an adapter, modify payments/schema/contracts, make purchases, or mark your own work approved.

Produce evidence-backed findings for Cart V2 custom line items + hosted checkout + server-side order/transaction reconciliation. Do not design on Checkout V1; document official removal timing with a source URL. Evaluate Checkout Sessions only as an alternative if deterministic correlation and reconciliation are clearly documented.

For dynamic server-derived pricing, internal correlation IDs, authenticated webhooks, raw-body requirements, event ordering/replay, missed-event polling/reconciliation, cancellation, partial/full refunds, idempotency, test/sandbox support, and plan/country/provider restrictions, record source URLs and observed/inferred/unknown. If the human explicitly provides an authorized test site, use only non-destructive synthetic sandbox calls; otherwise keep the spike documentary and list the exact sandbox proof still needed.

Create GO-NO-GO.md with status BLOCKED, PENDING, or READY_FOR_HUMAN_REVIEW. Only the human may record WIX_OK. Include a minimal provider contract proposal and unresolved questions, but no code. Open one PR with evidence and a clear go/no-go recommendation.
```
