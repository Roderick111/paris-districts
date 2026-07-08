#!/usr/bin/env bash
# Fix Next.js EPERM on .next/trace — run from project root in Terminal.
set -euo pipefail
cd "$(dirname "$0")"

echo "Stopping stray Next/Bun processes for this project..."
pkill -f "paris_student_map.*next dev" 2>/dev/null || true
pkill -f "paris_student_map/node_modules/.bin/next" 2>/dev/null || true
sleep 1

echo "Removing .next build cache (will be recreated on dev start)..."
if [[ -d .next ]]; then
  chmod -R u+rwX .next 2>/dev/null || true
  xattr -cr .next 2>/dev/null || true
  rm -rf .next
fi

echo "Clearing any quarantine on project (optional, harmless if none)..."
xattr -cr . 2>/dev/null || true

echo "Starting dev server..."
exec ~/.bun/bin/bun run dev