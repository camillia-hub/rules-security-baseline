# Output Encoding and Security Headers

## Output encoding

- Always encode output for the specific context it lands in: HTML body, HTML attribute, JavaScript string, URL, and CSS each have different encoding rules.
  Rationale: there is no single universal "sanitizer"; encoding must match the sink or the payload survives.
- Always rely on the framework's automatic encoding (JSX text expressions, Razor `@(...)`, template auto-escaping) and never bypass it for convenience.
- Never inject raw HTML (`dangerouslySetInnerHTML`, `Html.Raw`, `v-html`) unless the payload is sanitized with a vetted library such as DOMPurify and the bypass was reviewed.

```tsx
// Incorrect
<div dangerouslySetInnerHTML={{ __html: comment.body }} />

// Correct: render as text and let JSX encode it
<div>{comment.body}</div>

// Acceptable only when HTML rendering is a hard requirement
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.body) }} />
```

- Never build URLs by concatenating untrusted input; use URL builders and validate the scheme against an allow-list (`https:`) to block `javascript:` and `data:` URLs.
- Always treat Markdown rendering as an HTML pipeline: sanitize the rendered output, not just the Markdown source.
- Never reflect URL parameters into the page - including search pages and "not found" messages - without encoding.

## Security headers

- Always send on every HTML response: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and `Strict-Transport-Security` (on TLS).

```text
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-<random>'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains
```

- Always start CSP strict (`default-src 'self'`, no `unsafe-inline` for scripts) and loosen only with nonces or hashes, never with wildcards.
- Always control framing with CSP `frame-ancestors` (plus `X-Frame-Options: DENY` for legacy clients) unless being embedded is an actual feature.
- Always set `Cache-Control: no-store` on responses that carry authenticated or otherwise sensitive data.
- Never expose `Server`, `X-Powered-By`, framework version banners, or stack-trace details in responses.
- Always set cookies with `HttpOnly; Secure; SameSite=Lax` (or `Strict`); never read session cookies from JavaScript.
