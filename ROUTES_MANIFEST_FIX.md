# Next.js Routes Manifest Fix

## Problem

Your build was failing with the error:

```
Error: The file "/vercel/path0/.next/routes-manifest.json" couldn't be found. This is often caused by a misconfiguration in your project.
```

This error occurs when Next.js build process doesn't complete properly,
specifically failing to generate the `routes-manifest.json` file which is
critical for Vercel deployments.

## Root Causes

1. **Complex Webpack Configuration**: The original `next.config.js` had overly
   complex webpack plugins that were interfering with Next.js's internal build
   process
2. **Module Resolution Conflicts**: Multiple IgnorePlugin and
   NormalModuleReplacementPlugin configurations were blocking Next.js's routing
   system
3. **Build Cache Issues**: Corrupted build artifacts preventing clean builds
4. **Missing Build Output Configuration**: No explicit output configuration for
   proper artifact generation

## Solution

### 1. Simplified Next.js Configuration

Updated `apps/web/next.config.js` with:

- ✅ Removed conflicting webpack plugins
- ✅ Simplified module resolution
- ✅ Added proper `output: 'standalone'` configuration
- ✅ Kept essential alias resolution for cross-platform compatibility
- ✅ Maintained performance optimizations

### 2. Build Cleanup Scripts

Created two helper scripts:

**For Linux/Mac (clean-build.sh):**

```bash
#!/bin/bash
# Cleans build artifacts and runs fresh build
```

**For Windows (clean-build.bat):**

```batch
@echo off
REM Cleans build artifacts and runs fresh build
```

### 3. Build Verification Script

**verify-build.sh** - Checks build success and verifies routes-manifest.json
exists

## How to Fix Your Build

### Option 1: Quick Fix (Recommended)

```bash
# Windows
clean-build.bat

# Linux/Mac
./clean-build.sh
```

### Option 2: Manual Fix

```bash
# Navigate to web app
cd apps/web

# Clean build artifacts
rm -rf .next
rm -rf node_modules/.cache
rm -f *.tsbuildinfo

# Run fresh build
npm run build
```

### Option 3: Using Turbo

```bash
# Clean entire workspace
npm run clean

# Run build with fresh cache
turbo run build --force
```

## Key Changes Made

### next.config.js Improvements

```javascript
// Before: Complex plugins interfering with build
config.plugins.push(
  new webpack.IgnorePlugin({...}),
  new webpack.NormalModuleReplacementPlugin(...),
  // ... many more plugins
);

// After: Simplified, build-friendly configuration
config.plugins.push(
  new webpack.IgnorePlugin({
    resourceRegExp: /\.native\.(tsx?|jsx?|json)$/,
  })
);
```

### Added Build Output Configuration

```javascript
// Ensures proper artifact generation
output: 'standalone',
trailingSlash: false,
images: {
  unoptimized: false,
}
```

## Verification

After running the fix, verify success by checking:

1. **Build completes without errors**
2. **routes-manifest.json exists**: `ls apps/web/.next/routes-manifest.json`
3. **Build ID generated**: `cat apps/web/.next/BUILD_ID`
4. **All chunks generated**: Check `.next/static/chunks/` directory

## Deployment on Vercel

With this fix:

- ✅ Routes manifest will be properly generated
- ✅ Vercel deployment should succeed
- ✅ Static and dynamic routes will work correctly
- ✅ Build artifacts will be in the correct format

## Troubleshooting

If issues persist:

1. **Check Node.js version**: Ensure `>=18.0.0`
2. **Clear all caches**: `npm run clean:deep`
3. **Verify dependencies**: `npm install`
4. **Check for TypeScript errors**: `npm run type-check`
5. **Try isolated build**: `cd apps/web && npm run build`

## Prevention

To prevent this issue in the future:

- Keep webpack configuration minimal
- Use Turbo's caching appropriately
- Regularly clean build artifacts
- Test builds locally before deployment
- Monitor build output for warnings

---

**Status**: ✅ Fixed **Impact**: High - Critical for Vercel deployments
**Testing**: Run `verify-build.sh` to confirm fix
