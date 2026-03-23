#!/bin/sh
set -e

echo "==> Creating database directory..."
mkdir -p /app/prisma

echo "==> Running prisma db push..."
npx prisma db push --skip-generate

echo "==> Seeding database..."
node prisma/seed.js

echo "==> Starting Next.js..."
node_modules/.bin/next start -p ${PORT:-8080}
