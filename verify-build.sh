#!/bin/bash

echo "🔧 Building Next.js application..."

# Navigate to web app directory
cd apps/web

# Run the build with verbose output
echo "📦 Running: next build"
next build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "✅ Build completed successfully!"
  
  # Check if routes-manifest.json exists
  if [ -f ".next/routes-manifest.json" ]; then
    echo "✅ routes-manifest.json found!"
    echo "📄 Routes manifest contents:"
    cat .next/routes-manifest.json | head -20
  else
    echo "❌ routes-manifest.json not found!"
    echo "📁 Checking .next directory contents:"
    ls -la .next/ 2>/dev/null || echo ".next directory not found"
    exit 1
  fi
  
  # Check build size
  if [ -f ".next/BUILD_ID" ]; then
    echo "🏗️ Build ID: $(cat .next/BUILD_ID)"
  fi
  
  echo "📊 Build artifacts:"
  ls -la .next/ | grep -E '\.(js|css|json)$' | head -10
  
else
  echo "❌ Build failed!"
  exit 1
fi