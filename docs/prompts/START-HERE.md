# How to send the prompts

You are coordinating three independent platforms connected to one GitHub repository. These are not automatic agents; you manually paste each assignment.

## Order

1. Finish the one-time GitHub setup in `docs/operations/github-setup.md` when available.
2. Start with `round-01.md`. Paste the Muse, GPT, and Claude blocks into their respective platforms. Those three can run at the same time.
3. Each platform creates one branch and one PR. Do not allow direct pushes, self-approval, or auto-merge.
4. Review every PR yourself. Check that it stayed inside its file allowlist and lease, then merge only after CI passes.
5. Do not start the next numbered round until every required PR/review in the current round is complete.
6. If a round has a second step marked **after merge**, complete that step before continuing.
7. For a review-only assignment, paste the prompt and ask the platform to post findings on the specified issue/PR; it must not change files.
8. Stop at Round 11 unless you have personally approved `WIX_OK` from the Wix spike.

## Sending order at a glance

```text
R1:  Muse foundation + Terraform infrastructure || GPT architecture || Claude security
R2:  GPT domain || Muse infrastructure pipelines || Claude Wix spike
R3:  Muse database || Claude Cognito auth
R4:  GPT API contracts || Muse mobile shell || Claude admin shell
R5:  GPT core backend || Muse customer mobile || Claude request admin
R6:  GPT matching/quotes || Muse media backend || Claude security tests
R7:  GPT reliability || Muse worker mobile || Claude quote/media admin
R8:  Muse SQS worker || Claude worker tests; THEN GPT read-only review
R9:  Muse notifications || Claude reviews/disputes
R10: Muse release baseline || Claude non-payment E2E; THEN GPT release review
R11: GPT payment core ONLY after human WIX_OK
R12: Muse Wix adapter
R13: Claude payment security review; owners fix findings
R14: GPT payment API + generated client
R15: Muse mobile checkout || Claude admin payments/payouts
R16: Muse regression || Claude runbooks; THEN GPT and Claude final reviews
```

`||` means simultaneously. `THEN` means wait for merge/completion.

## What to paste

Open the current round file and copy the entire fenced text block for the selected platform. The prompts intentionally rely on `AGENTS.md` and the architecture documents in the repository. Do not shorten a prompt by removing its file allowlist, tests, or stop conditions.

## Branch protection is mandatory

Require PRs, human approval, passing status checks, and resolved conversations on `main`. Give the platforms write access for branches/PRs, but no permission to bypass protection. No platform should apply Terraform, submit mobile builds, deploy production, or execute real financial actions without your separate approval.
