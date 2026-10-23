# Secrets

## In code

- Never commit secrets, tokens, private keys, or connection strings containing credentials to source control - not even "temporarily", not in test files.
  Rationale: git history is forever; a deleted secret is still a leaked secret until it is rotated.
- Always load secrets from the environment, a secret manager, or the platform's configuration system at runtime.
- Always ship a template config (`appsettings.example.json`, `.env.example`) with placeholder values; never fill real values into samples.

```text
# Incorrect (committed appsettings.json)
"ApiKey": "PASTE-REAL-KEY-HERE"   // a real credential sitting in source control

# Correct
"ApiKey": ""   // supplied at runtime via the API_KEY environment variable / secret store
```

- Always keep local secret files (`.env`, `*.pem`, `*.pfx`) covered by `.gitignore` from the first commit of a repo.
- Never let secrets appear in source-adjacent artifacts either: no credentials in READMEs, checked-in docs, issue templates, or recorded demo fixtures.
- Never place secrets in URLs; query strings end up in access logs, proxies, and browser history. Use headers or request bodies.

## In logs and errors

- Never log credentials, session tokens, authorization headers, personal data, or full request bodies at any log level.
- Always redact fields that may carry secrets (`Authorization`, `Set-Cookie`, `password`, `token`) in the logging pipeline itself, not at each call site.
- Never return internal exception messages, SQL text, or stack traces to clients; return a correlation id and log the detail server-side.
- Never dump environment variables in build logs (no `env` / `printenv` / `set` in CI scripts); CI logs are readable by a wide audience.

## In client code

- Never embed secrets in shipped client code (SPAs, mobile apps, desktop installers); anything delivered to a user's device is public.
- Always proxy third-party calls that require credentials through your backend; never hand provider API keys to the browser.
- Always assume any key shipped to a client will be extracted within days; design abuse rate limits with that in mind.

## In the pipeline

- Always scan for secrets in CI (gitleaks, trufflehog, or equivalent) and fail the build on findings.
- Always treat a committed secret as compromised: rotate it first, then remove it; deletion alone is not remediation.
- Always prefer short-lived workload-identity credentials over long-lived static keys where the platform offers them.
- Never pass secrets as command-line arguments (visible in process lists); use stdin, the environment, or files with tight permissions.
- Always scope every token to the minimum permissions and lifetime the task needs; a broad token is a standing breach.
- Always restrict who can read CI secret variables and keep log masking on; never echo a variable "for debugging".
