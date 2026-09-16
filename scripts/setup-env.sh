#!/usr/bin/env bash
# Generates every .env file the project needs (root, backend, frontend) from their
# .env.example templates. Safe to re-run — never overwrites a file that already exists.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

copy_if_missing() {
  local example="$1" target="$2"
  if [ -f "$target" ]; then
    echo "skip:    $target (already exists)"
  else
    cp "$example" "$target"
    echo "created: $target"
  fi
}

copy_if_missing ".env.example" ".env"
copy_if_missing "backend/.env.example" "backend/.env"
copy_if_missing "backend/.env.test.example" "backend/.env.test"
copy_if_missing "frontend/.env.local.example" "frontend/.env.local"

echo
echo "Env files ready. Start everything with: docker compose up --build"
