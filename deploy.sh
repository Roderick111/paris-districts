#!/bin/bash
set -e

SERVER="root@188.34.196.228"
REMOTE_DIR="/opt/paris-districts"

echo "Deploying Paris Student Map to $SERVER"
echo "   Target: $REMOTE_DIR"
echo ""

echo "Creating deployment directory..."
ssh "$SERVER" "mkdir -p $REMOTE_DIR"

echo "Syncing files..."
rsync -avz \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude .DS_Store \
  --exclude '*.png' \
  ./ "$SERVER:$REMOTE_DIR/"

echo "Building and starting container..."
ssh "$SERVER" "cd $REMOTE_DIR && docker compose up --build -d"

echo ""
echo "Done. https://paris-districts.beautiful-apps.com/"