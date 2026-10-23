# Injection Prevention

## SQL and data stores

- Always use parameterized queries or an ORM's bound parameters; never concatenate user input into SQL.
  Rationale: concatenation makes injection a string-formatting accident; parameterization makes it structurally impossible.

```csharp
// Incorrect
var rows = db.Query($"SELECT * FROM users WHERE name = '{name}'");

// Correct
var rows = db.Query("SELECT * FROM users WHERE name = @name", new { name });
```

- Never build dynamic `ORDER BY` or column selections from raw request strings; values can be parameterized, identifiers cannot - map them through an allow-list.

```csharp
// Correct: identifier allow-list
var column = sortBy switch
{
    "name" => "Name",
    "created" => "CreatedAt",
    _ => "Id",
};
var direction = sortDir == "desc" ? "DESC" : "ASC";
var rows = db.Query($"SELECT * FROM users ORDER BY {column} {direction}");
```

- Always keep ORM raw-SQL escape hatches (`FromSqlRaw`, `$queryRaw`, handwritten Dapper SQL) behind the same parameterization rules as everything else.
- Always connect with a least-privilege database account; never let application code connect as a database owner or admin.

## Code and command execution

- Never use `eval`, `new Function`, or any template mechanism that evaluates input as code.
  Rationale: evaluating attacker-controlled strings is remote code execution by definition.

```ts
// Incorrect
const result = eval(`calculate(${userExpression})`);

// Correct
const result = calculate(parseExpression(userExpression)); // parsed AST, allow-listed operations
```

- Always launch external processes as an executable plus an argument array with shell interpretation disabled; never route input through `sh -c` or `cmd /c`.
- Always treat file paths derived from input as hostile: normalize, reject traversal segments, and confine access to an allow-listed base directory.
- Never interpolate user input into LDAP filters, XPath expressions, or template queries; use the client API's parameter binding or an allow-list of values.

## Server-side requests

- Never pass user-controlled URLs to server-side HTTP calls without scheme and host allow-listing; server-side request forgery is injection against your own network perimeter.
- Always resolve and re-check redirects server-side; an allow-listed origin that redirects to an internal address is still SSRF.
