# Architecture

FLIPLOG is one TypeScript application using Next.js App Router, React, Better Auth
and better-sqlite3. Package versions are pinned in [package.json](../package.json)
and [package-lock.json](../package-lock.json).

## Responsibilities

| Module                                                  | Responsibility                                                                                  |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [Catalogue](../src/features/catalogue/catalogue.ts)     | Stable skill IDs, content, sources, groups, same-surface foundation graph and safe return paths |
| [Progress rules](../src/features/progress/rules.ts)     | Rating values/labels and validation                                                             |
| [Foundations](../src/features/progress/foundations.ts)  | Derived reminders and journal filtering                                                         |
| [Rating form](../src/features/progress/rating-form.tsx) | Draft, confirmed value, save/reset, pending, expiry and retry feedback                          |
| [Auth](../src/server/auth.ts)                           | Library configuration and server-validated sessions                                             |
| [Progress storage](../src/server/progress.ts)           | Owner-scoped SQL reads and atomic writes                                                        |
| [Progress API](../src/app/api/progress/route.ts)        | Session, origin and input checks; private JSON responses                                        |
| [Initialization](../scripts/initialize.mjs)             | Auth migrations and domain schema at container startup                                          |

Pages compose these responsibilities. Domain rules remain outside JSX and
transport code; the app has no separate API deployment or generic service layer.

## Saving a rating

1. A server page reads the real session and only that user's progress.
2. The form keeps its draft separate from the last confirmed rating.
3. Explicit Save sends a skill ID and integer 1–5, or null for a confirmed reset.
4. The API validates session, origin, JSON and the exact payload. The client
   cannot choose an owner.
5. SQLite performs a short transaction keyed by user ID and skill ID. Identical
   saves preserve the timestamp; reset removes that one row.
6. The response updates the confirmed value and refreshes server-rendered context.
   Foundation reminders derive from saved ratings without editing other skills.

Concurrent writes use last committed write wins. A lost response can leave the
client uncertain whether a write committed; it shows the last confirmed value
and offers an idempotent retry.

## Storage and sessions

The versioned catalogue is static. SQLite stores library auth tables and
`progress(userId, skillId, rating, updatedAt)`. The composite key prevents
duplicate current records; a user foreign key and integer 1–5 CHECK constrain
the domain table. Absence represents Not started. Database schema version is 1.

SQLite uses WAL, foreign keys and a three-second busy timeout. Initialization
runs at container startup, not during builds or requests. A persistent single
Node instance suits this small workload; multiple replicas or sustained write
contention would require a deliberate storage change.
[SQLite's suitability guide](https://www.sqlite.org/whentouse.html) describes
the single-writer trade-off.

Better Auth owns password hashing and seven-day server sessions. React cache
deduplicates session reads within a render; it does not share identities across
requests. See [security boundaries](security-and-rights.md).

## Client behavior

Native links, selects, radios and CSS cover the interface. A shared client-ready
hook disables interactive controls until hydration attaches handlers. Forms
containing credentials use POST. Public catalogue navigation works without
JavaScript; filtering, auth and editing require it.

Only public catalogue path/scroll position is stored in sessionStorage. It
restores the list across a detail/auth detour. Private drafts remain in memory;
a full auth navigation requires reselecting an unsaved choice. Controls disable
during pending mutations/transitions.

The auth form uses Better Auth's HTTP error status for credential, rate-limit
and unavailable-service feedback. It never displays raw backend errors or
reveals whether an account exists.

## Packaging decisions

[Standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
supplies the server and static assets. JavaScript builds on the builder's native
platform; runtime dependencies install for the target platform. This avoids the
observed emulated-build failure and includes the target SQLite binary.

The separate startup migration entrypoint needs modules outside Next's trace.
The image therefore includes the full production dependency tree, trading size
for reliable initialization. ARM64 development and AMD64 preview/runtime are
verified separately.

better-sqlite3 provides the stable driver used by the auth adapter. The pinned
Node 24 built-in SQLite API is release candidate; avoiding one package did not
justify that maturity trade-off. Native controls and the built-in Node test
runner meet the current needs without additional UI or testing frameworks.

Relevant primary references:
[Better Auth Next.js](https://better-auth.com/docs/integrations/next),
[SQLite adapter](https://better-auth.com/docs/adapters/sqlite),
[React cache](https://react.dev/reference/react/cache),
[Docker multi-platform builds](https://docs.docker.com/build/building/multi-platform/).
