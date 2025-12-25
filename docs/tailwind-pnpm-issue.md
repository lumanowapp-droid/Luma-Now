# TailwindCSS + pnpm Dependency Resolution Issue

## Issue Summary

TailwindCSS v3.4.19 encounters a dependency resolution issue with sucrase on
Windows when using pnpm's strict module resolution. This is a known issue where
pnpm's isolation prevents TailwindCSS from accessing its sucrase dependency.

## Root Cause

pnpm uses strict module resolution that isolates dependencies, preventing
TailwindCSS from finding sucrase even when it's installed. This affects Windows
systems more commonly due to path resolution differences.

## Current Status - RESOLVED

- Dev server compiles successfully and serves the application
- No visible errors in browser or functionality issues
- Build process completes without PostCSS errors
- App is fully functional

## Solution Implemented

The issue has been resolved by configuring pnpm to properly hoist critical
dependencies:

**In `.npmrc`:**

```
# Fix pnpm hoisting issues with TailwindCSS dependencies
public-hoist-pattern[]=*sucrase*
public-hoist-pattern[]=*jiti*
shamefully-hoist=true
```

This configuration forces pnpm to hoist sucrase and jiti to the root
node_modules, making them accessible to TailwindCSS.

## Environment

- OS: Windows 11
- Package Manager: pnpm 8.10.0 with hoisting configuration
- TailwindCSS: 3.4.19
- Sucrase: 3.35.1

## Alternative Solutions (If Needed)

1. **Switch to npm**
   - Remove node_modules and pnpm-lock.yaml
   - Run `npm install`
   - Use `npm run dev:web`

2. **Browser Cache Clearing**
   - Open in incognito/private mode
   - Hard refresh (Ctrl+Shift+R)

## Recommendation

Continue with current pnpm setup with the hoisting configuration. The app is
fully functional and the build process works correctly.

## References

- Known issue with pnpm + TailwindCSS + Windows
- pnpm documentation on dependency hoisting
- TailwindCSS GitHub issues regarding pnpm compatibility
