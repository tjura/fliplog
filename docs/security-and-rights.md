# Security and rights

## Identity and private data

Better Auth owns password hashing and durable seven-day sessions. The app uses
trusted origins and database-backed rate limits. Session cookies are HttpOnly and
SameSite=Lax, with Secure enabled over HTTPS. Local ports use separate cookie
namespaces.

The server session supplies the owner of every private read/write. Payload
validation, parameterized SQL and short transactions constrain rating changes.
Private API responses use no-store headers. Public catalogue position is the
only sessionStorage data; drafts remain in memory. Credential forms use POST and
submission stays disabled until hydration attaches handlers.

Secrets are runtime configuration. Local setup creates a private `.env`;
production uses a separate secret and HTTPS base URL. Accounts have no email
verification or recovery. Avoid sensitive information and reused passwords in
this demo.

## Runtime and dependencies

SQLite data belongs to each project's persistent volume. Backups contain
credentials/session data and private ratings and must stay private.

Application containers run as node with dropped capabilities. Preview/server
roots are read-only with data/tmp/cache mounts; local ports bind to loopback.
Production joins the existing Traefik ingress with an app-specific route.
Next telemetry and npm lifecycle scripts are disabled; packages and the base
image are pinned.

The 2026-10-13 dependency inspection found zero production npm advisories. The
development tree had five high entries propagated from one unpatched
[braces recursion advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm),
through the lint toolchain. The affected package is absent from production
dependencies. Lint uses fixed project patterns; CI has read-only permissions and
a bounded timeout. An npm audit does not cover every security risk or certify
the application.

## Rights and publication

Original code, copy and SVG geometry are MIT. Dependencies retain their licenses;
[THIRD_PARTY_NOTICES](../THIRD_PARTY_NOTICES.md) and verbatim texts in
`third_party/` preserve supplementary notices and attribution. They also ship
with the runtime. The project license does not relicense those dependencies.

Local configuration, databases and backups are excluded from Git and Docker
build contexts. Ignore rules do not protect already tracked files, so review the
tracked file list before publishing. Screenshots must show only the public
interface and contain no account data.

[Catalogue sources](catalogue.md) support terminology and context. No source
artwork, paid curriculum or private code was imported. The editorial catalogue
and reminder threshold do not certify readiness for a movement.
