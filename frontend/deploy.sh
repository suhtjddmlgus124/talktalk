#!/usr/bin/env bash
set -e

echo "Building..."
npm run build

echo "Deploying..."
rsync -av --delete dist/ /var/www/talktalk/frontend/

echo "Reloading nginx..."
sudo systemctl reload nginx

echo "Deploy complete."