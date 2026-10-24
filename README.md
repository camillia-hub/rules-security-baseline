# Security Baseline Rules

A Camillia rules pack that enforces an OWASP-based security baseline as hard constraints for every service and UI the agent touches.

## Rules at a glance

- **Injection prevention** (`rules/cam-ext-security-baseline-injection.md`) - parameterized queries only, no `eval` or shell-string execution, allow-lists for dynamic identifiers, path traversal defenses.
- **Output encoding and headers** (`rules/cam-ext-security-baseline-xss-and-headers.md`) - context-correct output encoding, no unsanitized raw-HTML sinks, full security header set, hardened cookies.
- **Secrets** (`rules/cam-ext-security-baseline-secrets.md`) - no secrets in code, logs, or error responses; runtime injection via environment or secret manager; secret scanning in CI.
- **Dependencies** (`rules/cam-ext-security-baseline-dependencies.md`) - pinned versions with committed lockfiles, vulnerability audits in CI, disciplined update and review process.
- **Authorization** (`rules/cam-ext-security-baseline-authz.md`) - an authorization check on every endpoint, deny by default, object-level (BOLA/IDOR) checks, fully verified tokens.
- **Deserialization and input** (`rules/cam-ext-security-baseline-deserialization.md`) - safe formats only, schema validation at the boundary, size and depth limits, fail-closed errors.

## Install

Install from the Camillia Community Hub. On install, the rule files are placed under `.workspace/rules/` in your workspace and apply to every agent session there.

## License

MIT - see [LICENSE](LICENSE). Copyright 2026 Camillia contributors.
