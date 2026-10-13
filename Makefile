DEV_PROJECT ?= fliplog
PREVIEW_PROJECT ?= fliplog-preview
COMPOSE := docker compose -p $(DEV_PROJECT)
PREVIEW := docker compose -p $(PREVIEW_PROJECT) -f compose.production.yaml
# Host-side helpers run as the checkout owner so generated files stay editable.
HELPER = docker run --rm --network none --user "$$(id -u):$$(id -g)" --cap-drop ALL --security-opt no-new-privileges:true --mount type=bind,src="$$(pwd)",dst=/project --workdir /project fliplog:development
# Create the snapshot exclusively and remove it if the export fails.
BACKUP = umask 077; mkdir -p backups; file="backups/fliplog-$$(date -u +%Y%m%dT%H%M%SZ)-$$$$.sqlite"; set -C; : > "$$file" || exit 1; if $(1) exec -T app node scripts/backup.mjs >> "$$file"; then echo "Private snapshot: $$file"; else rm -f "$$file"; exit 1; fi

.PHONY: doctor setup up down status logs shell build check smoke format backup production-up production-smoke production-down production-backup

doctor:
	@command -v docker >/dev/null
	@docker info >/dev/null
	@$(COMPOSE) version
	@$(COMPOSE) config --quiet
	@$(PREVIEW) config --quiet
	@sh scripts/check-port.sh "$${APP_PORT:-3187}" "$(DEV_PROJECT)"
	@sh scripts/check-port.sh "$${PREVIEW_PORT:-3188}" "$(PREVIEW_PROJECT)"

setup: build
	$(HELPER) node scripts/configure.mjs

up: setup
	@sh scripts/check-port.sh "$${APP_PORT:-3187}" "$(DEV_PROJECT)"
	$(COMPOSE) up --detach --build --wait --wait-timeout 120

down:
	$(COMPOSE) down

status:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs --follow --tail=100 app

shell:
	$(COMPOSE) exec app sh

build:
	$(COMPOSE) build app

check: up
	$(COMPOSE) run --rm --no-deps tools npm run check

smoke:
	$(COMPOSE) exec -T app node --test tests/environment.test.mjs

format: build
	$(HELPER) /app/node_modules/.bin/prettier --write .

production-up:
	@sh scripts/check-port.sh "$${PREVIEW_PORT:-3188}" "$(PREVIEW_PROJECT)"
	$(PREVIEW) up --detach --build --wait --wait-timeout 120

production-smoke:
	$(PREVIEW) exec -T -e SMOKE_ORIGIN=http://127.0.0.1:$${PREVIEW_PORT:-3188} app node --test tests/*.test.mjs

production-down:
	$(PREVIEW) down

backup:
	@$(call BACKUP,$(COMPOSE))

production-backup:
	@$(call BACKUP,$(PREVIEW))
