# Dependencies

## Pinning and lockfiles

- Always pin exact dependency versions and commit the lockfile (`package-lock.json`, `packages.lock.json`, `go.sum`).
  Rationale: "latest compatible" turns every CI run into an unreviewed supply-chain lottery.

```jsonc
// package.json - Incorrect
{ "dependencies": { "some-utility": "*" } }

// package.json - Correct: exact version, lockfile committed
{ "dependencies": { "some-utility": "2.4.1" } }
```

- Never use floating ranges (`*`, `latest`) for production dependencies; ranges belong in libraries you publish, not in applications you ship.
- Always review and pin third-party GitHub Actions; prefer full-length commit SHAs over mutable tags for anything that touches secrets or release artifacts.
- Always pin the toolchain itself (`.nvmrc`, `global.json`, devcontainer image digest) so "works on my machine" is a version number.
- Always run a vulnerability audit (`npm audit`, `dotnet list package --vulnerable`, `osv-scanner`) in CI and fail on known high or critical findings.

## Updates and review

- Always update dependencies on a schedule (weekly or monthly automation); never let versions age past their security support window.
- Always review the diff of lockfile changes in pull requests; a lockfile-only change is still a change to your supply chain.
- Never auto-merge a dependency bot's major-version upgrade without running the full test suite and reading the release notes.
- Never add a dependency for a one-line utility you can write correctly yourself; every package is attack surface plus maintenance debt.

## Provenance and hygiene

- Always verify publisher identity and provenance (signatures, provenance attestations) for new packages in critical paths.
- Never allow arbitrary install scripts (`postinstall` and friends) from unvetted packages; disable them where the ecosystem allows (`--ignore-scripts`) and opt in explicitly per package.
- Always keep dev-only tooling out of runtime dependencies so production images never ship test frameworks or build chains.
- Always remove unused dependencies in regular hygiene passes; dormant packages still pull in transitive vulnerabilities.
- Never vendor (copy) third-party code into the repo without a license review and a recorded upstream version.
- Always produce an SBOM for shipped services so incident response can answer "are we affected?" in minutes, not days.
- Always check a new package's maintenance pulse (last release, open security issues, maintainer count) before adopting it in a critical path.
- Always prefer packages with few or no transitive dependencies for critical-path code; the transitive tree is the real footprint.
- Never ignore a high-severity audit finding with a comment; upgrade, or document a compensating control with an expiry date.
- Never adopt a package whose license is incompatible with the product's distribution model; run license scanning in CI.
- Always mirror critical packages through an internal registry or cache so upstream outages and deletions do not block deploys.
- Always treat a yanked or unpublished version as an incident: find what resolves it and pin to a published version immediately.
- Never commit `node_modules` or vendored build output; restore from the lockfile in CI.
