#!/bin/sh
set -eu
port=${1:?Port is required}
project=${2:?Compose project is required}
case "$port" in
  ''|*[!0-9]*) echo "Invalid port: $port" >&2; exit 1 ;;
esac
if [ "$port" -lt 1024 ] || [ "$port" -gt 65535 ]; then
  echo "Choose an unprivileged port from 1024 to 65535." >&2
  exit 1
fi
if command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
  # An already running container from this project can keep its own port.
  if docker ps --filter "label=com.docker.compose.project=$project" --filter "publish=$port" --format '{{.Names}}' | grep -q .; then
    exit 0
  fi
  echo "Port $port is already in use. Set APP_PORT or PREVIEW_PORT to a free port." >&2
  exit 1
fi
