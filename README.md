# Security Baseline Rules

A Camillia rules pack that enforces an OWASP-based security baseline as hard constraints for every service and UI the agent touches.

## Rules at a glance

- **Injection prevention** (`rules/injection.md`) - parameterized queries only, no `eval` or shell-string execution, allow-lists for dynamic identifiers, path traversal defenses.
- **Output encoding and headers** (`rules/xss-and-headers.md`) - context-correct output encoding, no unsanitized raw-HTML sinks, full security header set, hardened cookies.
- **Secrets** (`rules/secrets.md`) - no secrets in code, logs, or error responses; runtime injection via environment or secret manager; secret scanning in CI.
- **Dependencies** (`rules/dependencies.md`) - pinned versions with committed lockfiles, vulnerability audits in CI, disciplined update and review process.
- **Authorization** (`rules/authz.md`) - an authorization check on every endpoint, deny by default, object-level (BOLA/IDOR) checks, fully verified tokens.
- **Deserialization and input** (`rules/deserialization.md`) - safe formats only, schema validation at the boundary, size and depth limits, fail-closed errors.

## Install

Install from the Camillia Community Hub. On install, the rule files are placed under `.workspace/rules/` in your workspace and apply to every agent session there.

## License

MIT - see [LICENSE](LICENSE). Copyright 2026 Camillia contributors.
