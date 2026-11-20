# GitHub task checklist

Use one issue and one PR per implementation assignment. The issue title should begin with its ID, for example `R01-M Foundation and Terraform infrastructure`. Paste the matching prompt into the issue body. Review-only assignments produce findings, not code.

| Round | ID / platform | Lease | Branch | Depends on |
| --- | --- | --- | --- | --- |
| 1 | R01-M Muse foundation + infrastructure | ROOT + CONTRACTS | `muse/01-foundation-infrastructure` | Repository access |
| 1 | R01-G GPT architecture validation | NONE | `gpt/01-architecture-validation` | Repository access |
| 1 | R01-C Claude security baseline | NONE | `claude/01-security-baseline` | Repository access |
| 2 | R02-G GPT domain | CONTRACTS | `gpt/02-domain-rules` | R1 merged |
| 2 | R02-M Muse infrastructure pipelines | ROOT | `muse/02-infrastructure-pipelines` | R1 merged |
| 2 | R02-C Claude Wix spike | NONE | `claude/02-wix-spike` | R1 merged |
| 3 | R03-M Muse initial database | DB | `muse/03-initial-database` | R2 merged |
| 3 | R03-C Claude Cognito auth | NONE | `claude/03-cognito-auth` | R2 merged |
| 4 | R04-G GPT non-payment contracts | CONTRACTS | `gpt/04-nonpayment-contracts` | R3 merged |
| 4 | R04-M Muse mobile shell | NONE | `muse/04-mobile-shell` | R3 merged |
| 4 | R04-C Claude admin shell | NONE | `claude/04-admin-shell` | R3 merged |
| 5 | R05-G GPT core backend | NONE | `gpt/05-core-backend` | R4 merged |
| 5 | R05-M Muse customer requests | NONE | `muse/05-customer-requests` | R4 merged |
| 5 | R05-C Claude request admin | NONE | `claude/05-request-admin` | R4 merged |
| 6 | R06-G GPT matching/quotes | NONE | `gpt/06-matching-quotes` | R5 merged |
| 6 | R06-M Muse media backend | NONE | `muse/06-media-backend` | R5 merged |
| 6 | R06-C Claude security tests | NONE | `claude/06-security-tests` | R5 merged |
| 7 | R07-G GPT reliability | DB | `gpt/07-reliability` | R6 merged |
| 7 | R07-M Muse worker mobile | NONE | `muse/07-worker-mobile` | R6 merged |
| 7 | R07-C Claude quote/media admin | NONE | `claude/07-quote-media-admin` | R6 merged |
| 8 | R08-M Muse SQS worker | NONE | `muse/08-sqs-worker` | R7 merged |
| 8 | R08-C Claude worker tests | NONE | `claude/08-worker-tests` | R7 merged |
| 8 | R08-G GPT integration review | NONE, read-only | No branch | R08-M/C merged |
| 9 | R09-M Muse notifications | NONE | `muse/09-notifications` | R8 complete |
| 9 | R09-C Claude reviews/disputes | NONE | `claude/09-reviews-disputes` | R8 complete |
| 10 | R10-M Muse release baseline | ROOT | `muse/10-release-baseline` | R9 merged |
| 10 | R10-C Claude non-payment E2E | NONE | `claude/10-nonpayment-e2e` | R9 merged |
| 10 | R10-G GPT release review | NONE, read-only | No branch | R10-M/C merged |
| 11 | R11-G GPT payment core | CONTRACTS + DB | `gpt/11-payment-core` | Human `WIX_OK` |
| 12 | R12-M Muse Wix adapter | NONE | `muse/12-wix-adapter` | R11 merged + WIX_OK |
| 13 | R13-C Claude payment review | NONE, read-only | No branch | R12 merged |
| 14 | R14-G GPT payment contracts | CONTRACTS | `gpt/14-payment-contracts` | R13 findings resolved |
| 15 | R15-M Muse mobile checkout | NONE | `muse/15-mobile-checkout` | R14 merged |
| 15 | R15-C Claude finance admin | NONE | `claude/15-finance-admin` | R14 merged |
| 16 | R16-M Muse final regression | NONE | `muse/16-final-regression` | R15 merged |
| 16 | R16-C Claude runbooks | NONE | `claude/16-runbooks` | R15 merged |
| 16 | R16-G GPT high-risk review | NONE, read-only | No branch | R16-M/C merged |
| 16 | R16-C Claude behavior/privacy review | NONE, read-only | No branch | R16-M/C merged |

## Merge gate for every issue

- Correct base branch, assignment, allowlist, and lease.
- No unrelated files, secrets, live provider mutations, or generated-output edits.
- Required checks pass and test evidence is reported honestly.
- Security/data/payment implications reviewed where applicable.
- Human approval and merge; no platform self-merge.

Do not create Round 11–16 implementation issues as actionable work until the Wix gate passes. They can remain drafted for planning.
