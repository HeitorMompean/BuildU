# Home Services Marketplace

Starter repository for an Uber-like, scheduled home-services marketplace: customers post work, nearby eligible workers submit quotes, customers book, and Wix hosted checkout can collect customer payments after validation.

**Current status:** architecture and delivery plan only. No application implementation, AWS resources, Wix integration, APK analysis, or production credentials are included.

## Start here

1. Read `docs/operations/github-setup.md` and create/connect the private GitHub repository.
2. Protect `main` and connect Muse Spark 1.3, GPT 6.2, and Claude with branch/PR write access.
3. Open `docs/prompts/START-HERE.md`.
4. Copy the three prompts in `docs/prompts/round-01.md` to their named platforms. Muse's first assignment includes the Terraform AWS infrastructure.
5. Review and merge the three PRs only after checks pass, then proceed to Round 2.

## Canonical documents

- `AGENTS.md`: binding rules and exclusive file leases for all platforms.
- `docs/architecture/system-architecture.md`: applications, modules, and workflows.
- `docs/architecture/data-and-api-spec.md`: migrations, states, endpoints, and authorization.
- `docs/architecture/file-and-infrastructure-spec.md`: exact files and AWS/release configuration.
- `docs/product/pilot-scope.md`: launch scope and human policy decisions.
- `docs/tasks/rounds.md`: ordered GitHub issue/PR checklist.
- `docs/prompts/round-01.md` through `round-16.md`: copy-paste assignments.
- `docs/rea/clean-room-plan.md`: lawful FREE NOW static-analysis plan; no analysis has occurred.

## Important stop gate

Rounds 11–16 require a human-approved `WIX_OK` in `docs/spikes/wix/GO-NO-GO.md`. Do not assume Wix supports the required flow until the spike proves it. Customer checkout and worker payouts are separate: payouts are external manual settlements recorded in the ledger.

## Local development

This starter intentionally has no installed dependencies. Round 1 selects compatible versions and creates the lockfile. The root workspace/configuration files are initial inputs to that assignment, not a claim that the project currently builds.
