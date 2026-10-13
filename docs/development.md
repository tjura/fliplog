# Development and operations

Start with the [README](../README.md). All tools run in project-scoped Docker
containers; the host needs Git, Docker with Compose and Make.

## Commands

| Command                                        | Use                                                        |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `make doctor`                                  | Check Docker, Compose and the selected loopback ports      |
| `make up` / `make down`                        | Start or stop development; preserve data                   |
| `make status` / `make logs` / `make shell`     | Inspect the development app                                |
| `make format` / `make check`                   | Format owned files or run quality checks                   |
| `make production-up` / `make production-smoke` | Build/start the AMD64 preview and check its live contracts |
| `make production-down`                         | Stop the preview; preserve data                            |
| `make backup` / `make production-backup`       | Export a private development or preview snapshot           |

Development is at <http://127.0.0.1:3187/>; preview is at
<http://127.0.0.1:3188/>. `GET /health` reports process health.

Edit `src/` on the host; the development server reads that mount and reloads.
After changing dependencies, configuration or scripts, run `make up` again.
The first start creates `.env` with a random auth secret and private permissions.
Existing configuration is preserved. Keep that file out of source control.

For occupied ports, set `APP_PORT` and `PREVIEW_PORT` consistently, for example:

```sh
APP_PORT=3197 PREVIEW_PORT=3198 make up
APP_PORT=3197 PREVIEW_PORT=3198 make check
```

`DEV_PROJECT` and `PREVIEW_PROJECT` select separate Compose projects for isolated
environments. Each project has its own network and database volume. Setup/format
helpers use the checkout owner's numeric UID/GID; application containers use node.

The first request compiles a route in development. Docker Desktop file sharing
can make this slower than a native run; the AMD64 preview also uses emulation on
ARM64. Leave enough CPU and memory available, and run checks/builds sequentially
when resources are limited. See [Next.js local development guidance](https://nextjs.org/docs/app/guides/local-development).

Health probes use Node's built-in HTTP client. The emulated preview allows
15 seconds for the whole probe process and checks every 15 seconds; native
development and server probes use 5 seconds. Development page contracts allow
60 seconds for on-demand compilation. The production environment smoke uses a
10-second request budget; this is not a deadline for all application requests.

## Data and backup

SQLite lives in the app's `/data` volume. Normal stop/rebuild operations preserve
it. Do not use `down --volumes` or Docker-wide cleanup for routine maintenance.

Backup commands print the snapshot path only after success; a failed export
removes its partial file. Snapshots include committed WAL data, accounts,
password hashes, sessions and progress. They are stored under the ignored
`backups/` directory with mode 0600; keep them private. Copying only the live
main database file can omit committed WAL changes.

Restore into a new empty volume with its app stopped. The following example
uses the existing preview image, an unused port and a completed backup:

```sh
PREVIEW_PORT=3193 docker compose -p fliplog-restore -f compose.production.yaml create app
docker run --rm -i --platform linux/amd64 --network none --user node --read-only \
  --cap-drop ALL --security-opt no-new-privileges:true \
  --mount type=volume,src=fliplog-restore_preview-data,dst=/data \
  fliplog:production sh -c 'umask 077; set -C; cat > /data/fliplog.sqlite' \
  < backups/REPLACE_WITH_BACKUP.sqlite
PREVIEW_PORT=3193 docker compose -p fliplog-restore -f compose.production.yaml up --detach --no-build --wait
```

Choose an unused project name/port and replace the backup filename. The host
reads the private file through stdin; the node user writes the restored volume.
The command refuses to overwrite an existing database. Check integrity and
foreign keys, then sign in and verify the recovered journal before using it.
Keep the original auth configuration if sessions should survive; a changed
secret/base URL can require another sign-in.

## Deployment

`compose.server.yaml` runs a tested AMD64 image as one persistent Node app
behind an existing Traefik reverse proxy, with an app-specific route, a data
volume, read-only root, dropped capabilities and bounded resources. Transfer the
tested image without rebuilding it (for example with `docker save` and
`docker load`). The server keeps its configuration outside the repository:

- `.env.runtime` next to the Compose file, containing a separate
  `BETTER_AUTH_SECRET` of at least 32 characters.
- `.env` next to the Compose file with the deployment settings: `APP_IMAGE`,
  `APP_HOST`, `TRAEFIK_NETWORK`, `TRAEFIK_HTTP_ENTRYPOINT`,
  `TRAEFIK_HTTPS_ENTRYPOINT` and `TRAEFIK_CERT_RESOLVER`.

Deploy only an image whose source passed CI and the production smoke. Then
verify sign-in, saving a rating and persistence across a restart. Keep the
previous image for rollback and preserve the data volume.
