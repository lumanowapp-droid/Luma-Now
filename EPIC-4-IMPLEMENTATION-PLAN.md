# EPIC 4: Mobile Foundation - Expo Setup
## Detailed Implementation Plan

**Status**: Ready for Implementation
**Epic Goal**: Establish mobile-first architecture sharing 80% of code with web
**Why ADHD-Critical**: Mobile is always-accessible. Brain dump at moment of overwhelm, not when you remember to open a website.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Environment Setup](#phase-1-environment-setup)
3. [Phase 2: Expo App Initialization](#phase-2-expo-app-initialization)
4. [Phase 3: Configuration Files](#phase-3-configuration-files)
5. [Phase 4: Routing Structure](#phase-4-routing-structure)
6. [Phase 5: Integration & Testing](#phase-5-integration--testing)
7. [Phase 6: Validation Checklist](#phase-6-validation-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js**: >=18.0.0 (already installed)
- **pnpm**: >=8.0.0 (already installed - version 8.10.0)
- **Expo CLI**: Will be installed via npx
- **EAS CLI**: For builds (optional for initial setup)

### Platform-Specific Requirements

#### For iOS Development (macOS only)
- Xcode 14+ with Command Line Tools
- iOS Simulator
- CocoaPods (for native dependencies)

#### For Android Development
- Android Studio
- Android SDK (API 33+)
- Android Emulator or physical device

#### For Windows Development
- Android Studio (iOS development not available)
- Can test Android only

### Existing Project Status

✅ **Current State Verified**:
- Monorepo structure exists with pnpm workspaces
- Turbo build system configured
- Web app functional at `apps/web`
- Shared packages exist: `@multi-platform-app/ui`, `@multi-platform-app/store`, `@multi-platform-app/types`, `@multi-platform-app/core`, `@multi-platform-app/ai`
- Zustand state management in web app
- Supabase authentication working

---

## Phase 1: Environment Setup

### Step 1.1: Install Expo CLI Globally (Optional)

```bash
# Optional: Install Expo CLI globally for convenience
pnpm add -g expo-cli

# Or use npx for all commands (recommended for consistency)
# npx expo-cli [command]
```

### Step 1.2: Verify Prerequisites

```bash
# Check Node version
node --version
# Should show v18.0.0 or higher

# Check pnpm version
pnpm --version
# Should show 8.10.0 or higher

# Verify workspace configuration
cat pnpm-workspace.yaml
# Should include "apps/*"
```

---

## Phase 2: Expo App Initialization

### Step 2.1: Create Expo App Directory

**Location**: `apps/mobile/`

**Command**:
```bash
# Navigate to apps directory
cd apps

# Create Expo app with TypeScript template
npx create-expo-app mobile --template blank-typescript

# The template will create:
# - apps/mobile/
#   ├── App.tsx
#   ├── package.json
#   ├── tsconfig.json
#   ├── app.json
#   └── node_modules/
```

**Expected Output**:
```
✔ Downloaded and extracted project files.
✔ Installed JavaScript dependencies.

✅ Your project is ready!

To run your project, navigate to the directory and run one of the following commands:

- cd mobile
- npx expo start
```

### Step 2.2: Update package.json for Monorepo

**File**: `apps/mobile/package.json`

**Replace** the generated content with:

```json
{
  "name": "@multi-platform-app/mobile",
  "version": "1.0.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:ios": "eas build --platform ios",
    "build:android": "eas build --platform android",
    "build:all": "eas build --platform all",
    "submit:ios": "eas submit --platform ios",
    "submit:android": "eas submit --platform android",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@multi-platform-app/ui": "workspace:*",
    "@multi-platform-app/store": "workspace:*",
    "@multi-platform-app/types": "workspace:*",
    "@multi-platform-app/core": "workspace:*",
    "@multi-platform-app/ai": "workspace:*",
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "expo-status-bar": "~1.12.0",
    "expo-haptics": "~13.0.0",
    "expo-speech": "~12.0.0",
    "expo-secure-store": "~13.0.0",
    "expo-av": "~14.0.0",
    "react": "18.2.0",
    "react-native": "0.74.0",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "~3.31.1",
    "react-native-gesture-handler": "~2.16.1",
    "react-native-reanimated": "~3.10.0",
    "nativewind": "^4.0.1",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@types/react": "~18.2.0",
    "@types/react-native": "~0.73.0",
    "typescript": "^5.2.2",
    "tailwindcss": "^3.4.0"
  }
}
```

**Key Changes**:
- Changed `name` to `@multi-platform-app/mobile` for consistency
- Set `main` to `expo-router/entry` for Expo Router
- Added workspace dependencies (ui, store, types, core, ai)
- Added Expo Router and required libraries
- Added NativeWind for Tailwind support
- Added native feature libraries (haptics, speech, secure-store, av)
- Added build and submit scripts

### Step 2.3: Install Dependencies

```bash
# From apps/mobile directory
cd mobile
pnpm install

# This will:
# 1. Install all dependencies listed in package.json
# 2. Link workspace packages (@multi-platform-app/*)
# 3. Set up node_modules
```

### Step 2.4: Delete Default App.tsx

```bash
# From apps/mobile directory
rm App.tsx

# We'll use Expo Router file-based routing instead
```

---

## Phase 3: Configuration Files

### Step 3.1: Configure app.json

**File**: `apps/mobile/app.json`

**Replace** with:

```json
{
  "expo": {
    "name": "Luma Now",
    "slug": "luma-now",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FAFAF7"
    },
    "scheme": "lumanow",
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "bundleIdentifier": "com.lumanow.app",
      "supportsTablet": true,
      "infoPlist": {
        "NSMicrophoneUsageDescription": "Luma Now uses your microphone for voice input when you need it.",
        "NSUserNotificationsUsageDescription": "Luma Now sends gentle reminders to help you stay on track."
      }
    },
    "android": {
      "package": "com.lumanow.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FAFAF7"
      },
      "permissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.VIBRATE"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      [
        "expo-av",
        {
          "microphonePermission": "Allow Luma Now to use your microphone for voice input."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "YOUR_EAS_PROJECT_ID"
      }
    }
  }
}
```

**Key Configuration Points**:
- `orientation: "portrait"` - ADHD focus on single orientation
- `userInterfaceStyle: "automatic"` - Respects system theme
- `splash.backgroundColor: "#FAFAF7"` - Calm warm white from design tokens
- iOS microphone permission with clear explanation
- Android permissions for audio recording and haptics
- `expo-router` plugin enabled
- Typed routes enabled for better DX

### Step 3.2: Configure Metro Bundler

**File**: `apps/mobile/metro.config.js`

**Create** with:

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

// 4. NativeWind configuration
config.transformer.babelTransformerPath = require.resolve('nativewind/dist/transformer');

module.exports = config;
```

**What This Does**:
- Enables monorepo package resolution
- Watches workspace packages for hot reload
- Configures NativeWind transformer for Tailwind CSS

### Step 3.3: Configure Tailwind CSS (NativeWind)

**File**: `apps/mobile/tailwind.config.js`

**Create** with:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ADHD category colors from design system
        workBlue: '#6B85A6',
        personalGreen: '#7A9B8E',
        carePurple: '#9A8FB0',
        urgencyAmber: '#C89B5C',

        // Base colors (HSL for accessibility)
        bgLight: '#FAFAF7',
        bgDark: '#0F1115',
        textPrimaryLight: '#1A1A1A',
        textPrimaryDark: '#EDEDED',
        textMuted: '#6B7280',
      },
      fontFamily: {
        // Will be set up with platform-specific fonts
      },
      spacing: {
        // 4px base unit for consistent rhythm
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
      },
    },
  },
  plugins: [],
};
```

**Alignment with Design System**:
- Uses ADHD category colors from Epic 1 specification
- 4px spacing scale for rhythm
- Includes shared package UI components in content paths

### Step 3.4: Configure TypeScript

**File**: `apps/mobile/tsconfig.json`

**Replace** with:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "lib": ["ES2020"],
    "jsx": "react-native",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@multi-platform-app/ui": ["../../packages/ui/src"],
      "@multi-platform-app/store": ["../../packages/store/src"],
      "@multi-platform-app/types": ["../../packages/types/src"],
      "@multi-platform-app/core": ["../../packages/core/src"],
      "@multi-platform-app/ai": ["../../packages/ai/src"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

**Key Points**:
- Extends Expo's base TypeScript config
- Strict mode enabled for safety
- Path aliases for workspace packages
- Includes Expo type definitions

### Step 3.5: Configure Babel

**File**: `apps/mobile/babel.config.js`

**Create** or **replace** with:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }]
    ],
    plugins: [
      // Required for expo-router
      'expo-router/babel',
      // Required for react-native-reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

**Plugin Order Matters**:
- `expo-router/babel` must come before reanimated
- `react-native-reanimated/plugin` must be last

### Step 3.6: Create NativeWind Types

**File**: `apps/mobile/nativewind-env.d.ts`

**Create** with:

```typescript
/// <reference types="nativewind/types" />
```

This enables TypeScript support for NativeWind className prop.

---

## Phase 4: Routing Structure

### Step 4.1: Create App Directory Structure

```bash
# From apps/mobile directory
mkdir -p app/\(tabs\)
mkdir -p assets
```

**Directory Structure**:
```
apps/mobile/
├── app/
│   ├── _layout.tsx           # Root layout
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab navigator layout
│   │   ├── index.tsx         # Brain dump (home screen)
│   │   ├── timeline.tsx      # Timeline view
│   │   └── settings.tsx      # Settings
│   ├── focus.tsx             # Full screen focus mode (modal)
│   ├── capacity.tsx          # Capacity selection (modal)
│   └── welcome.tsx           # First-time welcome
├── assets/
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   └── favicon.png
├── metro.config.js
├── tailwind.config.js
├── babel.config.js
├── tsconfig.json
├── app.json
└── package.json
```

### Step 4.2: Create Root Layout

**File**: `apps/mobile/app/_layout.tsx`

**Create** with:

```typescript
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css'; // NativeWind global styles

export default function RootLayout() {
  useEffect(() => {
    // Initialize any app-wide services here
    // - Haptics
    // - Voice
    // - Analytics
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  );
}
```

**Key Points**:
- `GestureHandlerRootView` wraps entire app for gestures
- `Slot` renders the current route
- Place for theme provider (will add later with Epic 1)
- Place for Zustand store initialization

### Step 4.3: Create Tab Layout

**File**: `apps/mobile/app/(tabs)/_layout.tsx`

**Create** with:

```typescript
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FAFAF7', // bgLight from design tokens
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarActiveTintColor: '#6B85A6', // workBlue
        tabBarInactiveTintColor: '#6B7280', // textMuted
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Brain Dump',
          tabBarIcon: ({ color, size }) => {
            // TODO: Add icon when ui package has icon component
            return null;
          },
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color, size }) => {
            return null;
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => {
            return null;
          },
        }}
      />
    </Tabs>
  );
}
```

**Design Decisions**:
- No header (calm, minimal)
- Platform-aware tab bar height
- Design token colors
- Icons placeholder (will add with Epic 2)

### Step 4.4: Create Brain Dump Screen (Placeholder)

**File**: `apps/mobile/app/(tabs)/index.tsx`

**Create** with:

```typescript
import { View, Text, StyleSheet } from 'react-native';

export default function BrainDumpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brain Dump</Text>
      <Text style={styles.subtitle}>
        This is a placeholder. Will be implemented in Epic 5.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAF7', // bgLight
    padding: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '300', // Light weight from design system
    color: '#1A1A1A', // textPrimaryLight
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    color: '#6B7280', // textMuted
    textAlign: 'center',
  },
});
```

### Step 4.5: Create Timeline Screen (Placeholder)

**File**: `apps/mobile/app/(tabs)/timeline.tsx`

**Create** with:

```typescript
import { View, Text, StyleSheet } from 'react-native';

export default function TimelineScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timeline</Text>
      <Text style={styles.subtitle}>
        This is a placeholder. Will be implemented in Epic 6.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAF7',
    padding: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '300',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    color: '#6B7280',
    textAlign: 'center',
  },
});
```

### Step 4.6: Create Settings Screen (Placeholder)

**File**: `apps/mobile/app/(tabs)/settings.tsx`

**Create** with:

```typescript
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>
        This is a placeholder. Will be implemented in Epic 10.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAF7',
    padding: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '300',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    color: '#6B7280',
    textAlign: 'center',
  },
});
```

### Step 4.7: Create Global CSS (NativeWind)

**File**: `apps/mobile/global.css`

**Create** with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

This enables NativeWind's Tailwind utilities.

### Step 4.8: Create Placeholder Assets

For initial setup, you can use placeholder images:

```bash
# From apps/mobile directory

# Option 1: Create simple colored squares (temporary)
# You'll replace these with proper assets later

# Option 2: Copy from web app if available
# cp ../web/public/icon.png assets/icon.png

# For now, create placeholder note
echo "TODO: Add proper app icons and splash screens" > assets/README.md
```

**Asset Requirements** (to add later):
- `icon.png`: 1024x1024px app icon
- `splash.png`: Splash screen (1284x2778px for iPhone 14 Pro)
- `adaptive-icon.png`: Android adaptive icon (foreground)
- `favicon.png`: Web favicon

---

## Phase 5: Integration & Testing

### Step 5.1: Update Turbo Configuration

**File**: `turbo.json` (root)

**Add** mobile app to pipeline:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    "**/.env.*local"
  ],
  "pipeline": {
    "build": {
      "dependsOn": [
        "^build"
      ],
      "outputs": [
        "dist/**",
        "build/**",
        ".next/**",
        "!.next/cache/**",
        ".expo/**"
      ]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "dev:mobile": {
      "cache": false,
      "persistent": true
    },
    // ... rest of existing pipeline
  }
}
```

### Step 5.2: Add Mobile Scripts to Root package.json

**File**: `package.json` (root)

**Add** to scripts:

```json
{
  "scripts": {
    // ... existing scripts
    "mobile": "pnpm --filter @multi-platform-app/mobile start",
    "mobile:ios": "pnpm --filter @multi-platform-app/mobile ios",
    "mobile:android": "pnpm --filter @multi-platform-app/mobile android"
  }
}
```

### Step 5.3: Verify Workspace Linking

```bash
# From root directory
pnpm install

# This should:
# 1. Link all workspace packages
# 2. Install mobile app dependencies
# 3. Set up symlinks between packages
```

### Step 5.4: Test Mobile App

**Option A: iOS Simulator (macOS only)**

```bash
# From root directory
pnpm mobile:ios

# Or from apps/mobile
cd apps/mobile
pnpm ios
```

**Option B: Android Emulator**

```bash
# Ensure Android emulator is running first
# Then:
pnpm mobile:android

# Or from apps/mobile
cd apps/mobile
pnpm android
```

**Option C: Expo Go (Physical Device)**

```bash
# Start Expo dev server
pnpm mobile

# Scan QR code with:
# - iOS: Camera app
# - Android: Expo Go app
```

**Expected Result**:
- App launches successfully
- Shows tab navigator with 3 tabs
- Brain Dump tab is selected by default
- Shows placeholder content
- No errors in console

### Step 5.5: Test Package Imports

**Create test file**: `apps/mobile/app/test-imports.tsx`

```typescript
// Test workspace package imports
import type { Task } from '@multi-platform-app/types';
// import { useAppStore } from '@multi-platform-app/store'; // Will work after Epic 3
// import { Button } from '@multi-platform-app/ui'; // Will work after Epic 2

export default function TestImports() {
  // Test that types are accessible
  const testTask: Task = {
    id: '1',
    title: 'Test task',
    completed: false,
  };

  return null; // This is just for testing imports
}
```

**Run type check**:
```bash
cd apps/mobile
pnpm type-check

# Should complete without errors
```

### Step 5.6: Test Hot Reload

1. Start the app: `pnpm mobile`
2. Open `apps/mobile/app/(tabs)/index.tsx`
3. Change the title text
4. Save the file
5. Verify the app updates without full reload

**Expected**: Changes appear within 1-2 seconds

---

## Phase 6: Validation Checklist

Use this checklist to verify Epic 4 is complete:

### Environment & Setup
- [ ] Node.js >=18.0.0 installed
- [ ] pnpm >=8.0.0 installed
- [ ] Expo CLI accessible via npx
- [ ] Android Studio installed (for Android development)
- [ ] Xcode installed (for iOS development, macOS only)

### Project Structure
- [ ] `apps/mobile/` directory exists
- [ ] `apps/mobile/package.json` uses workspace dependencies
- [ ] `pnpm-workspace.yaml` includes `apps/*`
- [ ] All workspace packages link correctly

### Configuration Files
- [ ] `app.json` configured with correct bundle IDs
- [ ] `metro.config.js` supports monorepo resolution
- [ ] `tailwind.config.js` includes shared package paths
- [ ] `tsconfig.json` has workspace path aliases
- [ ] `babel.config.js` includes required plugins

### Routing Structure
- [ ] `app/_layout.tsx` exists (root layout)
- [ ] `app/(tabs)/_layout.tsx` exists (tab navigator)
- [ ] `app/(tabs)/index.tsx` exists (brain dump)
- [ ] `app/(tabs)/timeline.tsx` exists (timeline)
- [ ] `app/(tabs)/settings.tsx` exists (settings)
- [ ] File-based routing works correctly

### Testing & Validation
- [ ] `pnpm install` completes without errors
- [ ] `pnpm type-check` passes in mobile app
- [ ] App launches on iOS simulator (macOS only)
- [ ] App launches on Android emulator
- [ ] Tab navigation works
- [ ] Hot reload functions correctly
- [ ] No console errors or warnings
- [ ] Workspace packages are importable

### Integration Points
- [ ] Can import from `@multi-platform-app/types`
- [ ] Can import from `@multi-platform-app/ui` (after Epic 2)
- [ ] Can import from `@multi-platform-app/store` (after Epic 3)
- [ ] Metro bundler resolves monorepo packages
- [ ] TypeScript recognizes workspace paths

### Turbo & Scripts
- [ ] `turbo.json` includes mobile outputs
- [ ] Root `package.json` has mobile scripts
- [ ] `pnpm mobile` starts Expo dev server
- [ ] `pnpm mobile:ios` launches iOS simulator
- [ ] `pnpm mobile:android` launches Android emulator

### Documentation
- [ ] Assets README created
- [ ] EPIC 4 plan documented
- [ ] Known issues/limitations documented

---

## Troubleshooting

### Issue: Metro bundler can't resolve workspace packages

**Symptoms**:
```
Error: Unable to resolve module @multi-platform-app/types
```

**Solution**:
1. Clear Metro cache: `pnpm start --clear`
2. Reinstall dependencies: `rm -rf node_modules && pnpm install`
3. Verify `metro.config.js` includes workspace root in `watchFolders`
4. Check `tsconfig.json` has correct path aliases

### Issue: React Native Reanimated not working

**Symptoms**:
```
Error: Reanimated 2 failed to create a worklet
```

**Solution**:
1. Verify `babel.config.js` has `react-native-reanimated/plugin` as LAST plugin
2. Clear Babel cache: `pnpm start --clear`
3. Restart dev server

### Issue: NativeWind styles not applying

**Symptoms**:
- `className` prop doesn't apply styles
- TypeScript errors on className

**Solution**:
1. Verify `nativewind-env.d.ts` exists
2. Check `babel.config.js` has `jsxImportSource: 'nativewind'`
3. Ensure `global.css` is imported in `_layout.tsx`
4. Clear cache and restart: `pnpm start --clear`

### Issue: iOS build fails with CocoaPods error

**Symptoms**:
```
[!] CocoaPods could not find compatible versions for pod
```

**Solution**:
```bash
cd ios
pod install --repo-update
cd ..
pnpm ios
```

### Issue: Android build fails

**Symptoms**:
```
Task :app:installDebug FAILED
```

**Solution**:
1. Ensure Android emulator is running
2. Check Android SDK is installed (API 33+)
3. Clear Gradle cache: `cd android && ./gradlew clean`
4. Verify `ANDROID_HOME` environment variable is set

### Issue: Type errors in shared packages

**Symptoms**:
```
Cannot find module '@multi-platform-app/types' or its corresponding type declarations
```

**Solution**:
1. Build shared packages first:
   ```bash
   pnpm --filter @multi-platform-app/types build
   ```
2. Verify `package.json` in shared package has correct `main` and `types` fields
3. Run type-check: `pnpm type-check`

### Issue: Expo dev server won't start

**Symptoms**:
```
Error: EADDRINUSE: address already in use :::8081
```

**Solution**:
1. Kill existing Metro bundler:
   ```bash
   # macOS/Linux
   lsof -ti:8081 | xargs kill -9

   # Windows
   netstat -ano | findstr :8081
   taskkill /PID <PID> /F
   ```
2. Restart: `pnpm start`

---

## Next Steps After EPIC 4

Once Epic 4 is complete and validated:

1. **Epic 1**: Design System Foundation
   - Create design tokens in `packages/ui/src/tokens/`
   - Build theme provider for mobile
   - Implement platform-specific fonts

2. **Epic 2**: Component Primitives
   - Build shared primitives in `packages/ui/src/primitives/`
   - Create `.web.tsx` and `.native.tsx` variants
   - Replace placeholder screens with real components

3. **Epic 3**: State Architecture
   - Migrate to unified Zustand store
   - Test state sharing between web and mobile
   - Implement persistence layer

4. **Epic 5**: Core Screens
   - Implement Brain Dump screen
   - Add Capacity selection modal
   - Integrate with AI compression

---

## Success Criteria

Epic 4 is considered **complete** when:

✅ **Functional**:
- [ ] Mobile app runs on iOS simulator
- [ ] Mobile app runs on Android emulator
- [ ] Tab navigation works smoothly
- [ ] Hot reload functions correctly
- [ ] No runtime errors or warnings

✅ **Code Sharing**:
- [ ] Workspace packages are importable
- [ ] Types are shared and type-safe
- [ ] Monorepo structure is validated

✅ **Developer Experience**:
- [ ] Fast refresh works (<2s)
- [ ] TypeScript errors are caught
- [ ] Linting works consistently
- [ ] Build commands are documented

✅ **Documentation**:
- [ ] Architecture decisions are documented
- [ ] Setup instructions are clear
- [ ] Troubleshooting guide exists

✅ **Preparation for Next Epics**:
- [ ] Theme provider placeholder exists
- [ ] Component import structure is ready
- [ ] State management hook points exist

---

## Timeline Estimate (For Reference Only)

**Total Estimated Effort**: 8-12 hours (spread across 2-3 days)

**Breakdown**:
- Phase 1 (Environment Setup): 1-2 hours
- Phase 2 (Expo Initialization): 1-2 hours
- Phase 3 (Configuration): 2-3 hours
- Phase 4 (Routing Structure): 2-3 hours
- Phase 5 (Integration & Testing): 2-3 hours
- Phase 6 (Validation): 1 hour

**Note**: No timeline pressure. This is reference only for planning purposes.

---

## Resources

### Official Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://expo.github.io/router/docs/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [pnpm Workspaces](https://pnpm.io/workspaces)

### Community Resources
- [Expo Discord](https://chat.expo.dev/)
- [React Native Community](https://reactnative.dev/community/overview)

---

**EPIC 4 Implementation Plan - Version 1.0**
**Created**: 2025-12-23
**Status**: Ready for Implementation
**Next Epic**: Epic 1 (Design System Foundation)
