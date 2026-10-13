# FLIPLOG

A private progress journal for the trampoline and air-track skills I am learning.
Browse a movement, record your current self-rating and revisit foundations worth
discussing with a coach.

[Try the demo](https://fliplog.app.tjsoft.pl/) · [CI](https://github.com/tjura/fliplog/actions/workflows/ci.yml)

## What works

- Browse 20 illustrated skills and filter by surface or group.
- Create an account and keep your ratings private.
- Save, update or clear a self-rating from 1 to 5; no record means Not started.
- See foundation reminders update when a related rating changes.
- Find your recorded skills in My progress. Trampoline and air-track ratings stay separate.

Try this: create an account, save 4 for **Backflip — tuck (Trampoline)**,
then open **Backflip — straight (Trampoline)**. Lower the tuck rating to 3 and
reopen the straight variant: its foundation reminder changes, while any saved
straight rating stays intact.

## Run locally

Requirements: Docker with Compose, Git and Make.

```sh
git clone https://github.com/tjura/fliplog.git
cd fliplog
make up
```

Open <http://127.0.0.1:3187/> and create your own account. The first build downloads
dependencies; `make up` creates a private `.env` with a random auth secret.
Interactive controls require JavaScript. `make down` stops the app and preserves
its data. See [development and backup instructions](docs/development.md) for
ports, editing, logs and restore.

## Check the code

```sh
make check                 # formatting, lint, strict types and 15 focused tests
make production-up         # build and start the AMD64 preview on port 3188
make production-smoke      # 6 live contracts in the production runtime
```

TypeScript, Next.js/React, Better Auth and SQLite run in one application. The
server session owns every private read/write. Ratings are stored in a persistent
Docker volume. [Architecture](docs/architecture.md) explains the save path;
[quality](docs/quality.md) covers the tests and the manual release checklist.

## Limits

FLIPLOG is a small demo for adult learners in coached practice. It has no email
verification, password recovery or session history. Ratings and foundation
reminders are personal notes, not coaching approval; the catalogue is not a
validated curriculum. [Security and rights](docs/security-and-rights.md)
describes data handling and dependency advisories.

Built with AI assistance; Tomasz Jura maintains and is responsible for the code.

Original code and SVGs: [MIT](LICENSE). Dependencies retain their
[own licenses](THIRD_PARTY_NOTICES.md).
