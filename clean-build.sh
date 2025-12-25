#!/bin/bash

# Clean build artifacts and cache
echo "🧹 Cleaning build artifacts..."

# Clean Next.js build artifacts
if [ -d "apps/web/.next" ]; then
  echo "Removing .next directory..."
  rm -rf apps/web/.next
fi

# Clean Turbo cache
if [ -d ".turbo" ]; then
  echo "Removing .turbo cache..."
  rm -rf .turbo
fi

# Clean node_modules cache
if [ -d "apps/web/node_modules/.cache" ]; then
  echo "Removing node_modules cache..."
  rm -rf apps/web/node_modules/.cache
fi

# Clean TypeScript build cache
find apps/web -name "*.tsbuildinfo" -delete 2>/dev/null || true

echo "✅ Cleanup complete!"

# Now run the build
echo "🚀 Starting build..."
cd apps/web
npm run build