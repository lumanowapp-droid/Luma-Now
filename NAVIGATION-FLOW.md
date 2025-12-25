# Luma Now - Navigation Flow Documentation

## Overview

This document describes the complete navigation flow for both web and mobile platforms after the navigation improvements implemented on 2024-12-24.

---

## Navigation Architecture

### Web App (Next.js)
- **Pattern**: State-based view switching
- **Implementation**: `currentView` state in Zustand store
- **UI**: Floating navigation menu at bottom of screen

### Mobile App (Expo)
- **Pattern**: Route-based navigation with Expo Router
- **Implementation**: Tab navigator + modal routes
- **UI**: Bottom tab bar

---

## User Flow: Web App

### 1. Brain Dump → Timeline
```
User enters Brain Dump screen (default view)
  ↓
User types thoughts and selects capacity
  ↓
User clicks "Compress with AI"
  ↓
API processes text and returns tasks
  ↓
Tasks added to both stores (local + shared)
  ↓
View switches to Timeline (setCurrentView('timeline'))
```

**Files involved**:
- `apps/web/app/page.tsx` - Handles compress logic
- `apps/web/lib/store.ts` - Local state management
- `packages/store/src/index.ts` - Shared store

### 2. Timeline → Focus Mode
```
User sees tasks on Timeline
  ↓
User clicks "Focus" button on a TaskCard
  ↓
Timeline component calls handleFocus(taskId)
  ↓
Shared store: startFocus(taskId) + setCurrentView('focus')
  ↓
Web page detects currentView === 'focus' and renders FocusMode
```

**Files involved**:
- `packages/ui/src/screens/Timeline/index.tsx` - Timeline logic
- `packages/ui/src/components/TaskCard/index.tsx` - Task card UI
- `apps/web/app/page.tsx` - View switching

### 3. Focus Mode → Timeline
```
User completes task or exits focus mode
  ↓
FocusMode calls handleExit()
  ↓
Shared store: endFocus() + setCurrentView('timeline')
  ↓
Web page detects currentView === 'timeline' and renders Timeline
```

**Files involved**:
- `packages/ui/src/screens/FocusMode/index.tsx` - Focus mode logic
- `apps/web/app/page.tsx` - View switching

### 4. Navigation Menu (Any View → Any View)
```
User clicks navigation menu button (🧠 Brain Dump / 📋 Timeline / 🎯 Focus)
  ↓
NavigationMenu calls setCurrentView(view)
  ↓
Web page rerenders appropriate view
```

**Files involved**:
- `apps/web/components/navigation-menu.tsx` - Navigation UI
- `apps/web/lib/store.ts` - View state management

---

## User Flow: Mobile App

### 1. Brain Dump → Timeline
```
User opens Brain Dump tab (default)
  ↓
User types thoughts and selects capacity
  ↓
User clicks "Compress with AI"
  ↓
API processes text (TODO: implement mobile API endpoint)
  ↓
Tasks added to shared store
  ↓
Router navigates to Timeline tab (router.push('/(tabs)/timeline'))
```

**Files involved**:
- `apps/mobile/app/(tabs)/index.tsx` - Brain Dump screen
- `packages/store/src/index.ts` - Shared store

### 2. Timeline → Focus Mode
```
User taps "Focus" button on a TaskCard
  ↓
Timeline component calls handleFocus(taskId)
  ↓
Shared store: startFocus(taskId) + setCurrentView('focus')
  ↓
Timeline screen detects currentView === 'focus' via useEffect
  ↓
Router navigates to Focus modal (router.push('/focus'))
  ↓
Timeline screen resets view to 'timeline' to prevent re-trigger
```

**Files involved**:
- `packages/ui/src/screens/Timeline/index.tsx` - Timeline logic
- `apps/mobile/app/(tabs)/timeline.tsx` - Timeline screen wrapper with router
- `apps/mobile/app/focus.tsx` - Focus modal route

### 3. Focus Mode → Timeline
```
User completes task or exits focus mode
  ↓
FocusMode calls handleExit()
  ↓
Shared store: endFocus() + setCurrentView('timeline')
  ↓
Focus screen detects currentView === 'timeline' via useEffect
  ↓
Router navigates back (router.back())
  ↓
User returns to Timeline tab
```

**Files involved**:
- `packages/ui/src/screens/FocusMode/index.tsx` - Focus mode logic
- `apps/mobile/app/focus.tsx` - Focus screen wrapper with router

### 4. Tab Navigation
```
User taps any tab (Brain Dump / Timeline / Settings)
  ↓
Expo Router handles navigation automatically
  ↓
Tab content renders
```

**Files involved**:
- `apps/mobile/app/(tabs)/_layout.tsx` - Tab navigator configuration
- Individual tab screens

---

## Store Architecture

### Dual Store Pattern (Web Only)

**Local Store** (`apps/web/lib/store.ts`):
- Purpose: Web-specific state (currentView for page.tsx)
- Used by: Web app page component
- State: `currentView`, `tasks` (for API response), `isLoading`

**Shared Store** (`packages/store/src/index.ts`):
- Purpose: Cross-platform state (used by shared UI components)
- Used by: Timeline, FocusMode, BrainDump components
- State: All slices (brainDump, tasks, capacity, focus, ui, settings)

**Why both?**:
- Web app page.tsx uses local store for view management
- Shared UI components use shared store for data
- Tasks are synchronized between both stores

### Mobile: Single Store

**Shared Store Only** (`packages/store/src/index.ts`):
- Purpose: All state management
- Used by: All mobile screens and components
- Navigation: Handled by Expo Router (not store state)

---

## Key Navigation Patterns

### 1. State-to-Route Bridge (Mobile)

The mobile app uses a **bridge pattern** to convert state changes into router navigation:

```typescript
// In apps/mobile/app/(tabs)/timeline.tsx
useEffect(() => {
  if (currentView === 'focus') {
    router.push('/focus');
    setTimeout(() => setCurrentView('timeline'), 100);
  }
}, [currentView]);
```

This allows shared components (which call `setCurrentView`) to work on both platforms.

### 2. View State Types

All view types now include 'focus':

```typescript
// packages/store/src/types.ts
currentView: 'brain-dump' | 'timeline' | 'focus'

// apps/web/lib/store.ts
currentView: 'brain-dump' | 'timeline' | 'focus'
```

---

## Navigation UI Components

### Web: NavigationMenu
- **Location**: `apps/web/components/navigation-menu.tsx`
- **Style**: Floating pill at bottom center
- **Design**: Rounded buttons with icons and labels
- **Accessibility**: ARIA labels, current page indication

### Mobile: Tab Navigator
- **Location**: `apps/mobile/app/(tabs)/_layout.tsx`
- **Style**: Native bottom tab bar
- **Design**: 3 tabs (Brain Dump, Timeline, Settings)
- **Accessibility**: Platform native accessibility

---

## Files Modified (2024-12-24)

### Store Types
1. ✅ `packages/store/src/types.ts` - Added 'focus' to UIState
2. ✅ `apps/web/lib/store.ts` - Added 'focus' to AppState

### Shared Components
3. ✅ `packages/ui/src/screens/Timeline/index.tsx` - Added setCurrentView('focus') to handleFocus

### Web App
4. ✅ `apps/web/app/page.tsx` - Added shared store sync, imported useLumaStore
5. ✅ `apps/web/components/navigation-menu.tsx` - Created navigation UI

### Mobile App
6. ✅ `apps/mobile/app/(tabs)/index.tsx` - Implemented real Brain Dump screen
7. ✅ `apps/mobile/app/(tabs)/timeline.tsx` - Added router navigation bridge
8. ✅ `apps/mobile/app/focus.tsx` - Added router navigation bridge

---

## Testing Checklist

### Web App
- [ ] Brain Dump → Timeline (after compress)
- [ ] Timeline → Focus Mode (click Focus on task)
- [ ] Focus Mode → Timeline (click Exit or Complete)
- [ ] Navigation menu: Switch between all views
- [ ] Capacity modal opens and closes
- [ ] Tasks persist in Timeline after compress

### Mobile App
- [ ] Brain Dump tab renders with actual component
- [ ] Capacity modal opens and closes
- [ ] Brain Dump → Timeline (after compress) - **Requires API endpoint**
- [ ] Timeline → Focus Mode (tap Focus on task)
- [ ] Focus Mode → Timeline (tap Exit or Complete)
- [ ] Tab navigation works
- [ ] Back gesture works from Focus mode

---

## Known Issues & TODOs

### High Priority
1. **Mobile API endpoint**: Brain Dump compress needs mobile-compatible API
   - Current: Placeholder with `YOUR_API_ENDPOINT`
   - Action: Implement mobile API or use web API URL

### Medium Priority
2. **Tab icons**: Mobile tab bar shows no icons
   - Current: `return null` in tabBarIcon
   - Action: Add icon component or use emoji

3. **Welcome flow**: Onboarding is disabled on mobile
   - Current: Commented out in `_layout.tsx`
   - Action: Re-enable after navigation is tested

### Low Priority
4. **Store unification**: Web app uses two stores
   - Current: Works but could be cleaner
   - Action: Consider migrating web to use only shared store

---

## Navigation Best Practices

### For Shared Components
- Always use `setCurrentView()` for navigation
- Don't import router directly (breaks web)
- Platform-specific navigation handled by screen wrappers

### For Screen Wrappers (Mobile)
- Use `useEffect` to watch `currentView` changes
- Call `router.push()` or `router.back()` appropriately
- Reset view state after navigation to prevent loops

### For Web Pages
- Use conditional rendering based on `currentView`
- Include `<NavigationMenu />` in all views
- Sync tasks between local and shared stores

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER ACTIONS                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │   Shared UI Components        │
              │   (Timeline, FocusMode, etc)  │
              │                               │
              │   Uses: useLumaStore          │
              │   Calls: setCurrentView()     │
              └───────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │   Shared Store (@luma/store)  │
              │   - brainDump, tasks, etc     │
              │   - currentView: 'focus'      │
              └───────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
    ┌───────────────────────┐   ┌───────────────────────┐
    │   WEB WRAPPER         │   │   MOBILE WRAPPER      │
    │   (page.tsx)          │   │   (timeline.tsx)      │
    │                       │   │                       │
    │   If currentView ==   │   │   useEffect:          │
    │   'focus': render     │   │   If currentView ==   │
    │   FocusMode           │   │   'focus': router.    │
    │                       │   │   push('/focus')      │
    └───────────────────────┘   └───────────────────────┘
```

---

## Summary

The navigation system now provides:

✅ **Clear user flow** on both platforms
✅ **Consistent component API** (shared components work everywhere)
✅ **Platform-appropriate patterns** (state on web, routes on mobile)
✅ **Accessible navigation UI** (floating menu on web, tabs on mobile)
✅ **Bidirectional navigation** (all views can navigate to each other)
✅ **Store synchronization** (web syncs both stores, mobile uses shared)

The architecture respects platform conventions while maximizing code sharing through the shared UI component library.
