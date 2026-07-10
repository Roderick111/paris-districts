#!/bin/bash
set -e

SERVER="root@188.34.196.228"
REMOTE_DIR="/opt/paris-districts"

echo "Deploying District Quality Map to $SERVER"
echo "   Target: $REMOTE_DIR"
echo ""

echo "Running preflight checks..."
bun run lint
bun test

echo "Creating deployment directory..."
ssh "$SERVER" "mkdir -p $REMOTE_DIR"

echo "Syncing files..."
rsync -avz --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude .DS_Store \
  --exclude '__pycache__' \
  --exclude '*.png' \
  ./ "$SERVER:$REMOTE_DIR/"

echo "Building and starting container..."
ssh "$SERVER" "cd $REMOTE_DIR && docker compose up --build -d"

echo ""
echo "Done. https://urbanqualitymap.com/"