# Development quality

## Conventions

Use clear English names, small modules and strict TypeScript. Keep domain rules
outside JSX and request handling. Comments explain a decision or non-obvious
constraint; they do not narrate implementation history.

Use native framework/library APIs documented for the pinned versions. Research
a concrete failure before adding a workaround. A dependency needs a specific
requirement and a documented trade-off. Formatting and lint rules stay enabled;
avoid blanket suppressions and speculative abstraction.

## Testing

- `make check`: Prettier, ESLint, route types, strict TypeScript, nine DB-free
  tests and six live HTTP contracts.
- `make production-up` and `make production-smoke`: standalone AMD64 build/start
  and six contracts in the production runtime.

Pure tests cover representative catalogue, rating, reminder and auth-feedback
outcomes. Live contracts cover auth, ownership, validation, persistence,
process/catalogue health and 404. Tests use synthetic accounts and avoid
printing credentials.

Use DB-free tests for pure logic. Add integration cases for an actual I/O risk;
do not add tests merely to repeat implementation or meet a coverage percentage.

## Manual release checklist

HTTP contracts cannot establish rendered behavior. Before a release, exercise
the affected flows in a browser, including a narrow (320px) viewport:

- Catalogue: details and artwork, surface/group filters, unknown-skill 404 and
  Back to skills restoring filters and scroll position.
- Accounts: sign-up, sign-in, sign-out, invalid credentials, session expiry and
  two accounts that cannot see each other's ratings.
- Ratings: no record, draft, save, reload, lower, cancelled and confirmed reset,
  and retry after a failed save.
- Foundations: the 3/4 reminder boundary, lowering or clearing a foundation and
  separate trampoline/air-track progress.
- Accessibility: keyboard focus, labelled controls, contrast and reduced motion.

These checks are selective; they are not a WCAG, device or security
certification.

## CI and changes

The [workflow](../.github/workflows/ci.yml) runs the Docker/Make checks and
production smoke on main pushes and pull requests. It has read-only permissions,
a pinned checkout action, a bounded timeout and scoped cleanup. Deployment is
separate.

Review the complete diff and relevant callers. Check domain invariants, failure
handling, session ownership, accessibility and documentation where affected,
and update the documentation when behavior changes.

Report bugs through [GitHub issues](https://github.com/tjura/fliplog/issues) with
a reproduction, expected result and environment. For changes, explain the
user-visible behavior, trade-off and validation. Keep private data out of reports.
