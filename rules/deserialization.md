# Deserialization and Input Handling

## Safe formats and parsers

- Never deserialize untrusted data with type-confusing or code-executing deserializers (`BinaryFormatter`, unrestricted `pickle`, Java native serialization, `yaml.load` without a safe loader).
  Rationale: these formats let the payload choose the types; polymorphic gadget chains turn data into remote code execution.

```python
# Incorrect
config = pickle.loads(request.data)
doc = yaml.load(request.text)

# Correct
config = json.loads(request.data)
doc = yaml.safe_load(request.text)
```

- Always prefer data-only formats (JSON) with schema-validated bindings; reject unknown fields where the model supports it.
- Always constrain polymorphic deserialization to an explicit allow-list of types (for example `TypeNameHandling` off, or a known-types binder).

## Validation at the boundary

- Always validate input at the trust boundary - type, length, range, format, and allow-listed enum values - before any business logic runs.
- Always validate on the server even when the client already validates; the client is outside your trust boundary.
- Never bind request data straight into persistence models (mass assignment); bind to explicit input DTOs with allow-listed fields.

```csharp
// Incorrect: binds every posted field, including IsAdmin
public IActionResult Update([FromBody] User entity)

// Correct: allow-listed input DTO mapped after validation
public IActionResult Update([FromBody] UpdateUserInput input)
```

- Always enforce size limits on request bodies, decompression ratios, and document nesting depth (zip bombs, billion-laughs, deep JSON).
- Always validate uploads by content sniffing plus an extension allow-list; store files outside the web root and serve them with `Content-Disposition: attachment`.

## Export and downstream sinks

- Always treat CSV and spreadsheet exports as formula-injection risks: prefix user-controlled cell values that begin with `=`, `+`, `-`, or `@`.
- Never pass raw request objects past the boundary; map them to internal models after validation.

## Error handling

- Never reveal parser internals (type names, server-side line numbers, SQL fragments) in error responses; return a generic client error and log the detail server-side.
- Always fail closed: when validation or parsing is ambiguous, reject the request.
