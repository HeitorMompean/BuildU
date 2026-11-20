# GitHub setup and operating procedure

## 1. Create the private remote repository

Create a private repository named `home-services-marketplace` with `main` as the default branch. Do not initialize the remote with conflicting files; this local starter already contains the initial files.

From this directory, after replacing `<OWNER>`:

```bash
git add .
git commit -m "docs: add architecture and delivery plan"
git remote add origin https://github.com/<OWNER>/home-services-marketplace.git
git push -u origin main
```

Use your own GitHub authentication. Never paste credentials into prompts or documentation. If you use GitHub CLI, `gh repo create` can create the private remote, but review its flags before running it.

## 2. Connect the platforms

Give Muse Spark 1.3, GPT 6.2, and Claude access to the same repository. They need to read `main`, create their assigned branches, push those branches, and open PRs. Do not grant permission to bypass branch protection or administer the repository.

## 3. Protect `main`

Configure:

- Require a pull request before merging.
- Require at least one human approval; the PR author cannot satisfy it.
- Require status checks and branches to be up to date.
- Require conversation resolution.
- Block force pushes and branch deletion.
- Disable auto-merge for platform-authored PRs.
- Do not allow direct pushes, including by the platforms.

After Round 1 defines CI, add its required checks to branch protection. Start with the repository's available documentation/build checks until then.

## 4. Labels and issues

Create:

```text
lease:root
lease:contracts
lease:db
review:gpt
review:claude
risk:auth
risk:payments
risk:privacy
risk:data
status:blocked
platform:muse
platform:gpt
platform:claude
```

Create implementation issues from `docs/tasks/rounds.md` only when their round is ready. Paste the corresponding fenced prompt as the issue body. One issue produces one PR. Review-only issues produce findings, not branches.

## 5. GitHub environments and secrets

Create protected `staging` and `production` environments. Production deployment, infrastructure apply, mobile submission/update, and restore drills require manual approval. Configure GitHub OIDC trust using the exact organization/repository/branch or environment policy; never use shared long-lived AWS keys.

Secret/variable names will be defined by implementation workflows. Store values only in GitHub/AWS/provider secret stores. Do not place them in issues, prompts, Terraform examples, mobile configuration, or logs.

## 6. Round procedure

1. Confirm the previous round's required PRs are merged, review findings resolved, and CI green.
2. Paste every platform block in the current round file; blocks marked parallel may run simultaneously.
3. Confirm each branch and allowlist before reviewing code.
4. Review the diff, test evidence, security/data impact, and PR report yourself.
5. Merge through GitHub with human approval.
6. For a review-only step, wait for findings and owner fixes before proceeding.

Only one open PR may hold a given ROOT, CONTRACTS, or DB lease. If two platforms need the same lease, stop one and reorder the work rather than allowing conflicting edits.

## 7. Payment stop

Do not send Round 11 until the Wix spike proves the required behavior and you personally record `WIX_OK`. Do not treat a model's recommendation, a successful browser return, or a Wix Pro subscription as proof.
