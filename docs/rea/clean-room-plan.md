# Clean-room REA plan

Status: planned only. No APK has been supplied, obtained, inspected, executed, or reverse engineered. There are no findings about FREE NOW in this repository.

## 1. Purpose and target

Use lawful static analysis to learn high-level marketplace interaction patterns, not to copy an application. The planned Option 2 targets are:

- FREE NOW rider: Android package `taxi.android.client`.
- FREE NOW driver: Android package `taxi.android.driver`.

The exact artifact, source, version, signing identity, and hash must be recorded before analysis. Package names alone do not establish artifact identity. Do not download from an untrusted mirror, bypass protections, defeat certificate pinning, access another person's account, or collect live customer/driver data.

REA reference: <https://github.com/morluto/rea>. Use the installed skill's advertised tools and provider requirements rather than assuming a tool exists.

## 2. Questions to answer

1. What rider/job creation, quote/booking, cancellation, and receipt states are statically visible?
2. What worker opportunity, acceptance/decline, schedule, and completion interactions are statically visible?
3. What permissions, deep links, push-message declarations, and privacy-relevant declarations are present?
4. Which network or payment behavior is actually observed statically, which is only inferred, and which remains unknown?
5. Which generic UX lessons are relevant to scheduled home services, and which ride-specific behavior must be rejected?

Do not treat a class name, string, manifest entry, or decompiled branch as proof of runtime behavior. Static analysis does not establish what a server does or what all users experience.

## 3. Authorized workflow

Only after the user supplies lawfully acquired local APKs and confirms authorization:

1. Record source, filename, size, SHA-256, package/version, acquisition date, and scope in an artifact register. Do not commit APKs or extracted proprietary content to GitHub.
2. Use `inspect_android_package` for package identity, manifest declarations, coverage, and inline Evidence.
3. Use `search_android_classes` for focused candidates; inspect selected classes/methods with `inspect_android_class` and `inspect_android_method`; use `trace_android_references` for static incoming references.
4. Use archive inventory only when packaged resources answer a declared question. Do not bulk extract or copy proprietary assets.
5. Preserve evidence IDs, target digest, limitations, diagnostics, search boundaries, and unresolved coverage. Keep observations, inferences, and unknowns in separate fields.
6. Convert only generic findings into original requirements. No copied source, resource, icon, brand, text, database schema, or proprietary protocol is allowed in the product.

The Android provider may require caller-supplied Java 17+ and the compatible headless JADX MCP JAR. Missing tooling is a blocker to record, not permission to bypass app protections or install unrelated software.

## 4. Output files after analysis

```text
docs/rea/
  artifact-register.md        Local artifact identities; no binary content
  question-checklist.md       Answered / partial / unresolved status
  evidence-index.md           Evidence IDs, digests, limitations, coverage
  rider-findings.md           Observed / inferred / unknown rider findings
  driver-findings.md          Observed / inferred / unknown driver findings
  product-lessons.md          Original generic requirements and rejected ideas
```

Evidence bundles and analysis output belong in an ignored local artifact directory, not the shared repository. The committed reports must contain only the minimum factual excerpts necessary to support a finding.

## 5. Clean-room implementation rule

Implementers receive `product-lessons.md`, not decompiled source or proprietary assets. A finding becomes a requirement only after product and security review. The product's own names, visual design, code, data model, and API contracts remain original and follow the architecture documents.

## 6. Current result

This task is `unresolved`: no artifact or runtime evidence exists. Architecture and initial implementation may proceed using original requirements. Do not fabricate findings or make REA completion a payment-spike prerequisite.
