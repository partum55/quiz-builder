#!/usr/bin/env bash
# Stops every container from docker-compose.yml and removes their volumes
# (this deletes the Postgres data) and any orphaned containers.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

docker compose down --volumes --remove-orphans

echo "Stopped and cleaned. Run 'docker compose up --build' to start fresh."
