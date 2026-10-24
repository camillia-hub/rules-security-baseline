# Authorization

## Every endpoint, every request

- Always enforce an authorization check on every endpoint and handler - including admin-adjacent routes, message-triggered background jobs, and per-field GraphQL resolvers.
  Rationale: the unprotected endpoint is never the one you expect; it is the one someone added "just for internal use".
- Always deny by default: a route without an explicit allow rule must return 401 or 403, never fall through to open access.
- Never rely on the client hiding or disabling UI as a security control; the server re-checks every request on its own.
- Never scatter ad-hoc permission `if` statements across handlers; centralize policies and call them from every endpoint.

```csharp
// Incorrect: authentication only, no resource check
[HttpGet("{id}")]
public IActionResult Get(string id) => Ok(_docs.Load(id));

// Correct: object-level authorization against the loaded resource
[HttpGet("{id}")]
public async Task<IActionResult> Get(string id)
{
    var doc = await _docs.LoadAsync(id);
    if (!await _authz.CanReadAsync(User, doc)) return Forbid();
    return Ok(doc);
}
```

## Object-level checks

- Always authorize against the specific resource being accessed (BOLA/IDOR prevention); "logged in" is not "allowed".
- Never trust client-supplied tenant, organization, or owner ids; derive tenancy from the authenticated principal and verify membership.
- Always apply identical authorization rules on alternate read paths: exports, webhooks, search indexes, and caches must not leak objects the caller cannot read.
- Always choose between 404 and 403 deliberately so responses do not leak the existence of resources the caller may not know about.
- Always re-authorize state-changing retries and replays; a prior "yes" is not a standing "yes".

## Audit

- Always log authorization denials with the principal, resource id, and policy outcome (never sensitive payloads); silent 403s are unauditable.
- Always include enough context in audit logs to reconstruct who was denied what and why, without logging the protected data itself.

## Tokens and sessions

- Always validate tokens server-side: signature, issuer, audience, and expiry; never decode-and-trust a JWT without verification.
- Always issue short-lived access tokens with rotation; never issue non-expiring tokens.
- Never put sensitive claims or personal data in a JWT payload; it is signed, not encrypted.
