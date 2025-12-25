# Luma Now: ADHD Visual Planner - Epic Implementation Plan

> **Philosophy**: "A calm system that happens to run everywhere" **Approach**:
> Hybrid architecture - Next.js web + Expo mobile, sharing 80% of code
> **Principles**: Dieter Rams' "Less but better" applied to ADHD-friendly design

---

## Executive Summary

**Current State**: Functional Next.js web app with brain dump feature, AI
compression, and Supabase auth. Monorepo structure exists but mobile app is not
yet built.

**Strategic Decisions (Locked)**:

- ✅ **Architecture**: Keep Next.js web, create new Expo mobile app, share via
  packages
- ✅ **State Management**: Zustand everywhere (simple, ADHD-friendly)
- ✅ **Styling**: NativeWind (Tailwind for React Native) for cross-platform
  consistency
- ✅ **Launch Priority**: Web first (validate), then iOS, then Android

**Key Strengths to Preserve**:

- Excellent ADHD-aware AI prompts already in `packages/ai/src/prompts.ts`
- Working brain dump with auto-growing textarea
- Comprehensive TypeScript types in `packages/types`
- HSL-based design tokens in web app

**Critical Gaps to Address**:

- No mobile app structure (Expo setup needed)
- Minimal shared component library (only 1 button component)
- State management split (web uses Zustand, packages have unused Redux)
- No animation system
- No native features (voice, haptics, gestures)
- No timeline/focus mode implementation

---

## Design Philosophy & Principles

### Dieter Rams' 10 Principles Applied

1. **Innovative**: Uses AI for cognitive load reduction, not flashy features
2. **Useful**: Every feature serves executive function support
3. **Aesthetic**: Calm, minimal, typography-driven design
4. **Understandable**: One clear action per screen
5. **Unobtrusive**: Technology disappears into daily life
6. **Honest**: Shows realistic capacity, doesn't overpromise
7. **Long-lasting**: Sustainable patterns, not trend-chasing
8. **Thorough**: Accessibility and motion preferences respected
9. **Environmentally-friendly**: Local-first, efficient, minimal data
10. **As little design as possible**: Remove everything unnecessary

### ADHD-First Design Tenets

- **Calm Computing**: No aggressive animations, no stress patterns
- **Cognitive Load Reduction**: One action at a time, clear hierarchy
- **Respectful Technology**: Serves executive function, doesn't demand it
- **Sustainable Pace**: Design for consistency over intensity
- **Embodied Interaction**: Voice, haptics, gestures reduce friction

---

## Epic 1: Design System Foundation

**Purpose**: Establish calm, predictable visual language that reduces decision
fatigue

**Why ADHD-Critical**: Consistent design tokens eliminate cognitive overhead.
Predictable patterns create psychological safety.

### Deliverables

#### 1.1 Design Token System

Create comprehensive token system in `packages/ui/src/tokens/`:

**Colors** (`colors.ts`):

```typescript
// Semantic color system (ADHD category colors from brief)
workBlue: '#6B85A6'; // Work/professional tasks
personalGreen: '#7A9B8E'; // Personal care, health
carePurple: '#9A8FB0'; // Relationships, caregiving
urgencyAmber: '#C89B5C'; // Time-sensitive items

// Base colors (HSL for accessibility)
bgLight: '#FAFAF7'; // Warm white, not harsh
bgDark: '#0F1115'; // True dark, not gray
textPrimaryLight: '#1A1A1A';
textPrimaryDark: '#EDEDED';
textMuted: '#6B7280';
```

**Typography** (`typography.ts`):

```typescript
// Platform-specific fonts
fonts: {
  ios: "SF Pro Rounded",
  android: "Inter Rounded",
  web: "Inter Rounded"
}

// Scale (readable, generous)
body: { fontSize: 18, lineHeight: 28 }
small: { fontSize: 15, lineHeight: 22 }
heading: { fontSize: 34, fontWeight: "300" } // Light weight
```

**Spacing** (`spacing.ts`):

- 4px base unit for consistent rhythm
- Scale: 4, 8, 12, 16, 24, 32, 48, 64

**Motion** (`motion.ts`):

```typescript
// Calm durations (200-400ms range)
duration: {
  fast: 150,
  normal: 250,
  slow: 400
}

// Easing (no bounce, calm transitions)
easing: {
  calm: [0.25, 0.1, 0.25, 1.0],
  gentle: [0.4, 0.0, 0.2, 1.0]
}
```

**Shadows** (`shadows.ts`):

- Minimal elevation (0-2 levels only per brief)
- Subtle, soft shadows (no harsh borders)

#### 1.2 Platform Adapters

- Web: CSS custom properties (extend `apps/web/app/globals.css`)
- React Native: JavaScript tokens for NativeWind

#### 1.3 Theme Provider Enhancement

Extend `apps/web/components/theme-provider.tsx`:

- Add reduced motion detection
- Add high contrast mode
- Respect system preferences

### Files to Create/Modify

- **CREATE**: `packages/ui/src/tokens/colors.ts`
- **CREATE**: `packages/ui/src/tokens/typography.ts`
- **CREATE**: `packages/ui/src/tokens/spacing.ts`
- **CREATE**: `packages/ui/src/tokens/motion.ts`
- **CREATE**: `packages/ui/src/tokens/shadows.ts`
- **CREATE**: `packages/ui/src/tokens/index.ts` (unified export)
- **MODIFY**: `apps/web/app/globals.css` (add new CSS variables)
- **MODIFY**: `apps/web/components/theme-provider.tsx` (enhance)

### Best Practices

- WCAG AAA contrast ratios (7:1 for text)
- Radix Colors approach (perceptually uniform scales)
- Respect `prefers-color-scheme`, `prefers-reduced-motion`, `prefers-contrast`
- Color-blind safe (use shapes/labels, not just color)

---

## Epic 2: Component Primitives

**Purpose**: Build small, powerful set of composable primitives with simple APIs

**Why ADHD-Critical**: Fewer, more capable components = less cognitive load.
Each component has one clear purpose.

### Deliverables

#### 2.1 Core Primitives

Create in `packages/ui/src/primitives/`:

**Text** (`Text.tsx`):

- Semantic variants: Display, Heading, Body, Label, Caption
- Automatic color inheritance
- Platform-aware font loading

**Touchable** (`Touchable.tsx`):

- Universal pressable with haptic feedback
- 44pt minimum tap target (iOS HIG)
- Press states (subtle opacity change)
- Accessibility labels

**Surface** (`Surface.tsx`):

- Container with elevation
- Rounded corners (8-16px range)
- Background color variants

**Stack** (`Stack.tsx`):

- Vertical/horizontal layout
- Consistent spacing from tokens
- No manual margin management

**Spacer** (`Spacer.tsx`):

- Explicit whitespace (better than margin)
- Responsive sizing

**Modal** (`Modal.tsx`):

- Simple overlay
- **No backdrop blur** (per brief)
- Dim background only
- Swipe-to-dismiss (mobile)

#### 2.2 Input Primitives

**TextField** (`TextField.tsx`):

- Auto-growing multiline input
- Calm focus states (no aggressive borders)
- Character count (neutral tone)
- Platform-aware keyboard

**Button** (`Button.tsx`):

- Enhance existing button from `packages/ui/src/Button`
- Variants: Primary, Secondary, Ghost
- Loading state (with haptic feedback)
- Disabled state (clear but not harsh)

**Toggle** (`Toggle.tsx`):

- Switch component
- Haptic feedback on toggle
- Accessibility support

### Files to Create/Modify

- **CREATE**: `packages/ui/src/primitives/Text.tsx`
- **CREATE**: `packages/ui/src/primitives/Touchable.tsx`
- **CREATE**: `packages/ui/src/primitives/Surface.tsx`
- **CREATE**: `packages/ui/src/primitives/Stack.tsx`
- **CREATE**: `packages/ui/src/primitives/Spacer.tsx`
- **CREATE**: `packages/ui/src/primitives/TextField.tsx`
- **CREATE**: `packages/ui/src/primitives/Modal.tsx`
- **CREATE**: `packages/ui/src/primitives/Toggle.tsx`
- **ENHANCE**: `packages/ui/src/Button/PlatformButton.tsx`
- **MODIFY**: `packages/ui/src/index.ts` (export all primitives)

### Platform Strategy

- Shared TypeScript interface
- `.web.tsx` and `.native.tsx` for platform-specific implementations
- Single import path (automatic platform selection)

### Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation (tab order, focus management)
- Screen reader announcements
- 2px focus indicators (high contrast)

---

## Epic 3: State Architecture - Zustand Migration

**Purpose**: Create calm, predictable state layer that works identically on web
and mobile

**Why ADHD-Critical**: Zustand's simplicity (no reducers, no actions) reduces
cognitive load. Consistent patterns across platforms.

### Current State Audit

- ✅ Web app uses Zustand (`apps/web/lib/store.ts`) - KEEP THIS PATTERN
- ❌ Packages have Redux Toolkit scaffolding - REMOVE AND REPLACE
- Goal: Unified Zustand store in `packages/store`, used by both web and mobile

### Deliverables

#### 3.1 Store Slices

Create modular slices in `packages/store/src/slices/`:

**brainDumpStore.ts**:

```typescript
export const createBrainDumpSlice = (set, get) => ({
  text: '',
  isProcessing: false,
  setText: text => set({ text }),
  compress: async () => {
    set({ isProcessing: true });
    // Call AI compression API
    set({ isProcessing: false });
  },
});
```

**tasksStore.ts**:

```typescript
export const createTasksSlice = (set, get) => ({
  tasks: [],
  addTask: task =>
    set(state => ({
      tasks: [...state.tasks, task],
    })),
  toggleTask: id =>
    set(state => ({
      tasks: state.tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    })),
});
```

**capacityStore.ts**:

```typescript
export const createCapacitySlice = (set, get) => ({
  capacity: 'medium', // "light" | "medium" | "full"
  maxTasks: { light: 3, medium: 5, full: 7 },
  setCapacity: capacity => set({ capacity }),
});
```

**focusStore.ts**:

```typescript
export const createFocusSlice = (set, get) => ({
  currentTask: null,
  elapsedTime: 0,
  startFocus: taskId => set({ currentTask: taskId, elapsedTime: 0 }),
  endFocus: () => set({ currentTask: null, elapsedTime: 0 }),
});
```

**uiStore.ts**:

```typescript
export const createUISlice = (set, get) => ({
  currentView: 'brain-dump', // "brain-dump" | "timeline" | "focus"
  modalOpen: false,
  setCurrentView: view => set({ currentView: view }),
});
```

**settingsStore.ts**:

```typescript
export const createSettingsSlice = (set, get) => ({
  theme: 'system',
  reducedMotion: false,
  hapticFeedback: true,
  voiceInput: true,
  defaultCapacity: 'medium',
  updateSetting: (key, value) =>
    set(state => ({
      settings: { ...state.settings, [key]: value },
    })),
});
```

#### 3.2 Combined Store

Create in `packages/store/src/index.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export const useAppStore = create(
  persist(
    immer((set, get) => ({
      ...createBrainDumpSlice(set, get),
      ...createTasksSlice(set, get),
      ...createCapacitySlice(set, get),
      ...createFocusSlice(set, get),
      ...createUISlice(set, get),
      ...createSettingsSlice(set, get),
    })),
    {
      name: 'luma-storage',
      storage: createPlatformStorage(), // AsyncStorage (mobile) or localStorage (web)
    }
  )
);
```

#### 3.3 Platform Storage Adapter

Create `packages/store/src/storage/platformStorage.ts`:

- Web: localStorage
- Mobile: AsyncStorage
- Automatic platform detection

### Files to Create/Modify

- **CREATE**: `packages/store/src/slices/brainDumpStore.ts`
- **CREATE**: `packages/store/src/slices/tasksStore.ts`
- **CREATE**: `packages/store/src/slices/capacityStore.ts`
- **CREATE**: `packages/store/src/slices/focusStore.ts`
- **CREATE**: `packages/store/src/slices/uiStore.ts`
- **CREATE**: `packages/store/src/slices/settingsStore.ts`
- **CREATE**: `packages/store/src/storage/platformStorage.ts`
- **REPLACE**: `packages/store/src/index.ts` (remove Redux, use Zustand)
- **DELETE**: `packages/store/src/appStore.ts` (Redux version)
- **DELETE**: `packages/store/src/slices/authSlice.ts` (Redux version)
- **MODIFY**: `packages/store/package.json` (remove Redux deps, add Zustand)
- **REFACTOR**: `apps/web/lib/store.ts` (migrate to use `packages/store`)

### Migration Strategy

1. Create new Zustand slices in packages
2. Update web app to import from `packages/store`
3. Remove local `apps/web/lib/store.ts` once migration complete
4. Remove all Redux Toolkit dependencies

---

## Epic 4: Mobile Foundation - Expo Setup

**Purpose**: Establish mobile-first architecture sharing 80% of code with web

**Why ADHD-Critical**: Mobile is always-accessible. Brain dump at moment of
overwhelm, not when you remember to open a website.

### Deliverables

#### 4.1 Expo App Initialization

Create new Expo app at `apps/mobile/`:

```bash
cd apps
npx create-expo-app mobile --template blank-typescript
```

Configure:

- TypeScript
- Expo Router
- NativeWind
- Monorepo workspace integration

#### 4.2 Core Configuration Files

**app.json**:

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
      "backgroundColor": "#FAFAF7"
    },
    "ios": {
      "bundleIdentifier": "com.lumanow.app",
      "supportsTablet": true
    },
    "android": {
      "package": "com.lumanow.app",
      "adaptiveIcon": {
        "backgroundColor": "#FAFAF7"
      }
    }
  }
}
```

**metro.config.js** (monorepo support):

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Monorepo packages
  const projectRoot = __dirname;
  const workspaceRoot = path.resolve(projectRoot, '../..');

  config.watchFolders = [workspaceRoot];
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ];

  // NativeWind
  config.transformer.babelTransformerPath =
    require.resolve('nativewind/transformer');

  return config;
})();
```

**tailwind.config.js** (NativeWind):

```javascript
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        workBlue: '#6B85A6',
        personalGreen: '#7A9B8E',
        carePurple: '#9A8FB0',
        urgencyAmber: '#C89B5C',
      },
    },
  },
};
```

#### 4.3 Routing Structure (Expo Router)

Create file-based routes in `apps/mobile/app/`:

```
app/
├── _layout.tsx              # Root layout (theme, providers)
├── (tabs)/
│   ├── _layout.tsx          # Tab navigator (hidden by default)
│   ├── index.tsx            # Brain dump (default screen)
│   ├── timeline.tsx         # Timeline view
│   └── settings.tsx         # Settings
├── focus.tsx                # Full screen focus mode (modal)
├── capacity.tsx             # Capacity selection (modal)
└── welcome.tsx              # First-time welcome
```

**Root Layout** (`app/_layout.tsx`):

```typescript
import { Slot } from 'expo-router'
import { ThemeProvider } from '@multi-platform-app/ui'
import { useAppStore } from '@multi-platform-app/store'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  )
}
```

#### 4.4 Dependencies

Add to `apps/mobile/package.json`:

```json
{
  "dependencies": {
    "@multi-platform-app/ui": "workspace:*",
    "@multi-platform-app/store": "workspace:*",
    "@multi-platform-app/types": "workspace:*",
    "@multi-platform-app/core": "workspace:*",
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "expo-haptics": "~13.0.0",
    "expo-speech": "~12.0.0",
    "expo-secure-store": "~13.0.0",
    "nativewind": "^4.0.0",
    "react-native-reanimated": "~3.10.0",
    "zustand": "^4.5.0"
  }
}
```

### Files to Create

- **CREATE**: `apps/mobile/` (entire directory structure)
- **CREATE**: `apps/mobile/app.json`
- **CREATE**: `apps/mobile/metro.config.js`
- **CREATE**: `apps/mobile/tailwind.config.js`
- **CREATE**: `apps/mobile/app/_layout.tsx`
- **CREATE**: `apps/mobile/app/(tabs)/_layout.tsx`
- **CREATE**: `apps/mobile/app/(tabs)/index.tsx`
- **CREATE**: `apps/mobile/app/(tabs)/timeline.tsx`
- **CREATE**: `apps/mobile/app/(tabs)/settings.tsx`
- **CREATE**: `apps/mobile/package.json`
- **MODIFY**: `turbo.json` (add mobile app to pipeline)
- **MODIFY**: `pnpm-workspace.yaml` (include apps/mobile)

### Testing Strategy

- Test on iOS Simulator (macOS)
- Test on Android Emulator
- Test on physical device (critical for haptics, voice)

---

## Epic 5: Core Screens - Brain Dump & Capacity

**Purpose**: Implement the heart of the experience - safe space for overwhelm
and gentle capacity constraint

**Why ADHD-Critical**: Brain dump is release valve for racing thoughts. Capacity
selection prevents overcommitment.

### Deliverables

#### 5.1 Enhanced Brain Dump Screen

Extract from `apps/web/components/brain-dump.tsx` to shared package.

**Create**: `packages/ui/src/screens/BrainDump/index.tsx`

Features:

- Multi-line auto-growing input (already working in web)
- Voice input button (mobile: hold-to-record)
- Live character count (neutral, not stressful)
- Compress button (calm, no urgency)
- Processing state (animated dots, not spinner)
- Gentle error handling

**Platform-Specific**:

- `.web.tsx`: Standard textarea
- `.native.tsx`: TextInput with voice button

Voice Input (mobile only):

```typescript
import * as Speech from 'expo-speech'

const VoiceButton = () => {
  const [isRecording, setIsRecording] = useState(false)

  return (
    <Touchable
      onPressIn={startRecording}
      onPressOut={stopRecording}
      hapticFeedback="medium"
    >
      <Icon name={isRecording ? "mic.fill" : "mic"} />
    </Touchable>
  )
}
```

#### 5.2 Capacity Selection Modal

**Create**: `packages/ui/src/screens/CapacityModal/index.tsx`

UI:

- Simple modal (no backdrop blur per brief)
- 3 capacity options:
  - Light: 3 tasks (battery icon at 33%)
  - Medium: 5 tasks (battery icon at 66%)
  - Full: 7 tasks (battery icon at 100%)
- Explanation: "How much energy do you have today?"
- Confirm button: "Set my capacity"
- Remember last selection (persist to settings)

Design:

```typescript
const capacityOptions = [
  { value: 'light', tasks: 3, label: 'Light Day', icon: 'battery.25' },
  { value: 'medium', tasks: 5, label: 'Medium Day', icon: 'battery.50' },
  { value: 'full', tasks: 7, label: 'Full Day', icon: 'battery.100' },
];
```

#### 5.3 Processing State Component

**Create**: `packages/ui/src/components/ProcessingDots/index.tsx`

- 3 animated dots (not spinner per brief)
- Fade in/out sequence (200ms per dot)
- Loop animation
- Respect reduced motion (static dots if preference set)

### Files to Create/Modify

- **CREATE**: `packages/ui/src/screens/BrainDump/index.tsx`
- **CREATE**: `packages/ui/src/screens/BrainDump/BrainDump.web.tsx`
- **CREATE**: `packages/ui/src/screens/BrainDump/BrainDump.native.tsx`
- **CREATE**: `packages/ui/src/screens/CapacityModal/index.tsx`
- **CREATE**: `packages/ui/src/components/VoiceInput/index.tsx`
- **CREATE**: `packages/ui/src/components/ProcessingDots/index.tsx`
- **REFACTOR**: `apps/web/components/brain-dump.tsx` (use shared component)
- **MODIFY**: `apps/web/app/page.tsx` (add capacity modal)
- **CREATE**: `apps/mobile/app/(tabs)/index.tsx` (brain dump screen)

### Integration Points

- AI compression API: `apps/web/app/api/compress/route.ts`
- State management: `brainDumpStore` and `capacityStore`
- Haptic feedback on button press (mobile)

---

## Epic 6: Core Screens - Timeline & Focus

**Purpose**: Transform chaos into calm order. Visual timeline that respects
capacity and energy.

**Why ADHD-Critical**: Time blindness is real. Visual timeline with realistic
durations externalizes time perception. Focus mode removes distractions.

### Deliverables

#### 6.1 Timeline Screen (Focus View)

**Create**: `packages/ui/src/screens/Timeline/index.tsx`

Features:

- Vertical stack of tasks (smooth, no grid)
- Color-coded by category (workBlue, personalGreen, carePurple, urgencyAmber)
- Duration displayed (capacity-based, NOT time-based per brief)
- Progress indicator (completed tasks fade, not disappear)
- Swipe-to-complete gesture (mobile)
- Tap-to-focus action
- Empty state: "Your timeline is clear. Take a breath."

Layout:

```typescript
<Stack spacing="md">
  {tasks.length === 0 ? (
    <EmptyState
      message="Your timeline is clear. Take a breath."
      icon="checkmark.circle"
    />
  ) : (
    tasks.map(task => (
      <TaskCard
        key={task.id}
        task={task}
        onToggle={() => toggleTask(task.id)}
        onFocus={() => navigateToFocus(task.id)}
      />
    ))
  )}
</Stack>
```

#### 6.2 Task Card Component

**Create**: `packages/ui/src/components/TaskCard/index.tsx`

Design:

- Color indicator (left border 4px, not background)
- Title (18px, clear, readable)
- Duration (15px, neutral gray)
- Completion state (checkmark, not strikethrough)
- Tap target: 44pt minimum (iOS HIG)
- Rounded corners (12px)

Gestures (mobile):

- Swipe right: Complete task (with haptic)
- Swipe left: Delete task (with undo toast)
- Tap: Navigate to focus mode

#### 6.3 Focus Mode Screen (Full Screen)

**Create**: `packages/ui/src/screens/FocusMode/index.tsx`

Features:

- Single task display (large, centered)
- Elapsed time timer (counting UP, not down - no pressure per brief)
- Minimal UI: Just task title and timer
- Status bar hidden (iOS)
- Gesture to exit: Swipe down
- Haptic on task completion
- Completion feedback: "Well done. Take a moment."

Layout:

```typescript
<View style={styles.fullScreen}>
  <Text variant="heading">{task.title}</Text>
  <Timer elapsed={elapsedTime} />
  <Button onPress={completeTask}>Complete</Button>
</View>
```

Timer Component:

- Circular SVG (shared web/mobile)
- Elapsed time display (MM:SS format)
- No countdown (reduces anxiety)

#### 6.4 Empty States

**Create**: `packages/ui/src/components/EmptyState/index.tsx`

Messages:

- Timeline empty: "Your timeline is clear. Take a breath."
- No tasks: "Brain dump to get started."
- All complete: "Everything's done. You did it."

### Files to Create/Modify

- **CREATE**: `packages/ui/src/screens/Timeline/index.tsx`
- **CREATE**: `packages/ui/src/screens/FocusMode/index.tsx`
- **CREATE**: `packages/ui/src/components/TaskCard/index.tsx`
- **CREATE**: `packages/ui/src/components/Timer/index.tsx`
- **CREATE**: `packages/ui/src/components/EmptyState/index.tsx`
- **CREATE**: `packages/ui/src/gestures/Swipeable.tsx` (swipe wrapper)
- **MODIFY**: `apps/web/app/page.tsx` (add timeline view)
- **CREATE**: `apps/mobile/app/(tabs)/timeline.tsx`
- **CREATE**: `apps/mobile/app/focus.tsx` (modal route)

### Accessibility

- Task cards: Semantic role="listitem"
- Focus mode: Announce time every minute (screen reader)
- Swipe gestures: Alternative tap actions for accessibility
- High contrast mode support

---

## Epic 7: Animation & Motion System

**Purpose**: Movement should be purposeful, calm, and respectful of attention
and preferences

**Why ADHD-Critical**: Aggressive animations trigger stress. Calm motion
provides feedback without demanding attention. Always optional.

### Deliverables

#### 7.1 Motion Primitives

**Create**: `packages/ui/src/motion/primitives.tsx`

Components:

- **FadeIn/FadeOut**: Gentle opacity (200ms)
- **SlideIn/SlideOut**: Directional entrance/exit (300ms)
- **ScaleIn/ScaleOut**: Subtle grow/shrink (200ms)
- **Collapse/Expand**: Height animations (400ms)

All respect `prefers-reduced-motion`.

#### 7.2 Platform Implementations

- **Web** (`.web.tsx`): Framer Motion
- **Mobile** (`.native.tsx`): React Native Reanimated 2

Shared API:

```typescript
<FadeIn duration={200}>
  <TaskCard />
</FadeIn>
```

#### 7.3 Animation Hooks

**Create**: `packages/ui/src/motion/hooks.ts`

- `useReducedMotion()`: Detect system preference
- `useAnimation()`: Platform-agnostic animation hook
- `withMotion(Component)`: HOC that disables animations if needed

#### 7.4 Processing States

**Create**: `packages/ui/src/components/ProcessingDots/index.tsx`

- 3 dots, fade in/out sequence (not spinner per brief)
- Loop animation: Dot 1 → Dot 2 → Dot 3 → repeat
- 200ms per dot
- Respects reduced motion (static dots)

Skeleton Loaders:

- Subtle pulse (not shimmer - less aggressive)
- Used for loading states

### Files to Create/Modify

- **CREATE**: `packages/ui/src/motion/primitives.tsx`
- **CREATE**: `packages/ui/src/motion/primitives.web.tsx`
- **CREATE**: `packages/ui/src/motion/primitives.native.tsx`
- **CREATE**: `packages/ui/src/motion/hooks.ts`
- **CREATE**: `packages/ui/src/motion/presets.ts`
- **CREATE**: `packages/ui/src/components/ProcessingDots/index.tsx`
- **MODIFY**: `packages/ui/package.json` (add framer-motion, reanimated)

### Motion Guidelines

- Default: Fade over slide (less aggressive)
- Duration: 200-400ms (calm range per brief)
- Easing: No bounce (calm, predictable)
- Always include reduced-motion fallback

### Accessibility

- Respect `prefers-reduced-motion` (critical)
- No auto-playing animations
- No parallax effects
- No infinite loops (except processing states)

---

## Epic 8: Native Features - Voice, Haptics, Gestures

**Purpose**: Leverage mobile device intimacy for embodied planning experience

**Why ADHD-Critical**: Voice removes typing friction. Haptics provide visceral
feedback. Gestures reduce cognitive load (muscle memory vs visual search).

### Deliverables

#### 8.1 Voice Input System

**Create**: `packages/core/src/voice/index.ts`

Features:

- Hold-to-record pattern (mobile)
- Visual feedback: Waveform or pulsing mic
- Transcription API: OpenAI Whisper or similar
- Auto-insert into brain dump
- Error handling: "Couldn't hear that. Try again?"

Implementation:

```typescript
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

export class VoiceService {
  static async startRecording() {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) throw new Error('Microphone permission denied');

    // Start recording
    // Return audio data
  }

  static async transcribe(audioData) {
    // Call transcription API
    // Return text
  }
}
```

#### 8.2 Haptic Feedback System

**Create**: `packages/core/src/haptics/index.ts`

Feedback Types:

- **Light**: On input focus, subtle interactions
- **Medium**: On button press, selections
- **Heavy**: On task completion, significant actions
- **Success**: On successful action completion
- **Error**: On validation failure (gentle vibration)

Platform Abstraction:

```typescript
import * as Haptics from 'expo-haptics';

export class HapticService {
  static async trigger(type: HapticType) {
    if (Platform.OS === 'web') return; // No haptics on web

    const { settings } = useAppStore.getState();
    if (!settings.hapticFeedback) return; // Respect user preference

    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      // ... other types
    }
  }
}
```

**Create Platform-Specific**:

- `haptics.web.ts`: No-op (graceful degradation)
- `haptics.native.ts`: expo-haptics implementation

#### 8.3 Gesture System

**Create**: `packages/ui/src/gestures/Swipeable.tsx`

Gestures (mobile-only):

- **Swipe down**: Dismiss modal/exit focus mode
- **Swipe right**: Complete task
- **Swipe left**: Delete task (with undo)
- **Long press**: Context menu (iOS-style)

Implementation:

```typescript
import { GestureDetector, Gesture } from 'react-native-gesture-handler'

export const Swipeable = ({ onSwipeRight, onSwipeLeft, children }) => {
  const swipe = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX > 100) onSwipeRight?.()
      if (event.translationX < -100) onSwipeLeft?.()
    })

  return (
    <GestureDetector gesture={swipe}>
      {children}
    </GestureDetector>
  )
}
```

#### 8.4 System Integration (Future)

- Share extension: Share to brain dump
- Widgets: Quick brain dump
- Shortcuts: Siri/Google Assistant
- Quick actions: 3D Touch app icon

### Files to Create

- **CREATE**: `packages/core/src/voice/index.ts`
- **CREATE**: `packages/core/src/haptics/index.ts`
- **CREATE**: `packages/core/src/haptics/haptics.web.ts`
- **CREATE**: `packages/core/src/haptics/haptics.native.ts`
- **CREATE**: `packages/ui/src/components/VoiceInput/index.tsx`
- **CREATE**: `packages/ui/src/gestures/Swipeable.tsx`
- **MODIFY**: `apps/mobile/app.json` (add permissions for microphone)

### Permissions Required

- Microphone (voice input)
- Notifications (gentle nudges)

---

## Epic 9: AI Integration - Enhanced Intelligence

**Purpose**: AI should feel like supportive friend, not demanding authority

**Why ADHD-Critical**: AI does cognitive heavy-lifting of prioritization and
scheduling, freeing executive function for task execution.

### Deliverables

#### 9.1 Enhanced Compression Service

**Enhance**: `packages/ai/src/compression/index.ts`

Current state: Basic compression exists in `apps/web/app/api/compress/route.ts`

Improvements:

- **Capacity awareness**: Compress to 3/5/7 tasks based on selected capacity
- **Context awareness**: Consider time of day, recurring patterns
- **Better error messages**: "That's a lot! Let's break it down together."
- **Streaming responses**: Show progress, don't block UI

Capacity-Aware Prompt:

```typescript
export const CAPACITY_AWARE_PROMPT = (
  capacity: 'light' | 'medium' | 'full'
) => {
  const maxTasks = { light: 3, medium: 5, full: 7 }[capacity];

  return `You are helping someone with ADHD plan their day. They have ${capacity} capacity today.

CRITICAL: Return exactly ${maxTasks} tasks, no more. Ruthlessly prioritize.

${SCHEDULE_SYSTEM_PROMPT} // Existing excellent prompt from packages/ai/src/prompts.ts

Remember: This person chose "${capacity}" capacity. Respect that self-awareness. Don't overfill their day.`;
};
```

#### 9.2 Intelligent Scheduling

**Create**: `packages/ai/src/scheduling/index.ts`

Features:

- Suggest task durations based on history
- Identify energy-draining vs energizing tasks
- Propose task ordering (hard-easy alternation)
- Recommend breaks

#### 9.3 Gentle Nudges (Not Notifications)

**Create**: `packages/ai/src/nudges/index.ts`

Messages (shown in-app, not push):

- "Your timeline is getting full. Remember to pace yourself."
- "You've been in focus mode for 2 hours. Time for a break?"
- "You completed 3 tasks today. That's meaningful progress."

Tone: Supportive friend, not nagging parent.

#### 9.4 AI Prompts Enhancement

**Enhance**: `packages/ai/src/prompts.ts`

Current prompts are EXCELLENT (ADHD-aware, empathetic).

Add:

- Capacity-aware variants
- Personalization based on user history
- Reflection prompts for end-of-day review

### Files to Create/Modify

- **ENHANCE**: `packages/ai/src/compression/index.ts`
- **CREATE**: `packages/ai/src/scheduling/index.ts`
- **CREATE**: `packages/ai/src/nudges/index.ts`
- **ENHANCE**: `packages/ai/src/prompts.ts`
- **MODIFY**: `apps/web/app/api/compress/route.ts` (add capacity awareness)
- **CREATE**: `apps/web/app/api/schedule/route.ts` (new endpoint)

### API Pattern

```typescript
// apps/web/app/api/compress/route.ts
export async function POST(req: Request) {
  const { text, capacity } = await req.json();

  const prompt = CAPACITY_AWARE_PROMPT(capacity);

  // Stream response to show progress
  const stream = await anthropic.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    messages: [{ role: 'user', content: `${prompt}\n\n${text}` }],
    // ...
  });

  return new Response(stream.toReadableStream());
}
```

---

## Epic 10: Settings & Personalization

**Purpose**: Give users control without overwhelming them with choices

**Why ADHD-Critical**: Too many settings = decision paralysis. Focus on few
things that genuinely impact experience.

### Deliverables

#### 10.1 Settings Screen

**Create**: `packages/ui/src/screens/Settings/index.tsx`

Structure (simple list, no complex navigation):

**Appearance**:

- Theme: System / Light / Dark
- Reduced motion: On/Off (show system preference)
- High contrast: On/Off

**Notifications** (minimal):

- Gentle nudges: On/Off
- Daily reflection: On/Off

**Accessibility**:

- Font size: Small / Medium / Large
- Haptic feedback: On/Off (mobile only)
- Voice input: On/Off (mobile only)

**Account**:

- Email (display only)
- Sign out
- Delete account (multi-step confirmation)

Platform-Specific Styling:

- iOS: Grouped list style
- Android: Flat list
- Web: Card-based

#### 10.2 Onboarding (First-Time Only)

**Create**: `packages/ui/src/screens/Welcome/index.tsx`

Flow:

1. **Welcome**: "A calm place to plan"
2. **Permissions** (with clear explanations):
   - Microphone: "For voice input when you need it"
   - Notifications: "For gentle reminders (optional)"
3. **Set default capacity**: "What feels right for most days?"
4. **Skip-able tour**: 3-screen walkthrough (can skip entirely)

Tone: Reassuring, not demanding.

#### 10.3 User Preferences Store

Already created in Epic 3 (`settingsStore.ts`).

Persistence:

- Local storage (platform-aware)
- Sync to Supabase (for cross-device consistency)

### Files to Create/Modify

- **CREATE**: `packages/ui/src/screens/Settings/index.tsx`
- **CREATE**: `packages/ui/src/screens/Welcome/index.tsx`
- **CREATE**: `apps/mobile/app/(tabs)/settings.tsx`
- **CREATE**: `apps/mobile/app/welcome.tsx`
- **ALREADY EXISTS**: `packages/store/src/slices/settingsStore.ts` (from Epic 3)

### Settings Best Practices

- Default to system preferences where possible
- Group related settings
- Explain why each setting matters
- Show current system preference (e.g., "System: Dark")
- Confirm destructive actions (delete account)

---

## Epic 11: Build & Deployment Pipeline

**Purpose**: Automate everything. Developers focus on features, not
infrastructure.

**Why Critical**: Fast feedback loops enable rapid iteration. Users get fixes
and features quickly.

### Deliverables

#### 11.1 Web Deployment (Vercel)

- Automatic preview deployments on PR
- Production deployment on main branch merge
- Environment variables management
- Analytics (privacy-focused: Plausible or PostHog)

**Create**: `.github/workflows/web-deploy.yml`

```yaml
name: Deploy Web
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm --filter web build
      - uses: amondnet/vercel-action@v25
```

#### 11.2 Mobile Deployment (EAS)

- Development builds: Internal testing
- Preview builds: Beta testers (TestFlight/Play Internal)
- Production builds: App Store/Play Store
- OTA updates for JS-only changes

**Create**: `apps/mobile/eas.json`

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account.json"
      }
    }
  }
}
```

#### 11.3 CI/CD Pipeline

**Create**: `.github/workflows/ci.yml`

Checks on PR:

- Lint (ESLint)
- Type check (tsc)
- Format check (Prettier)
- Unit tests (Vitest)
- Build validation

#### 11.4 Monitoring & Analytics

- **Error tracking**: Sentry (privacy-respecting configuration)
- **Analytics**: PostHog or Plausible (privacy-first)
- **Performance**: Web Vitals (web), native performance (mobile)

### Files to Create/Modify

- **CREATE**: `.github/workflows/ci.yml`
- **CREATE**: `.github/workflows/web-deploy.yml`
- **CREATE**: `.github/workflows/mobile-deploy.yml`
- **CREATE**: `apps/web/vercel.json`
- **CREATE**: `apps/mobile/eas.json`
- **MODIFY**: `turbo.json` (optimize build caching)
- **CREATE**: `.github/workflows/version-bump.yml` (automated versioning)

### Deployment Strategy

- **Web**: Merge to main → auto-deploy to Vercel
- **Mobile**: Manual trigger → EAS build → TestFlight/Play Internal
- **OTA Updates**: JS-only changes → automatic background updates

---

## Implementation Sequencing

### Phase 1: Foundation (Epics 1-3)

**Goal**: Establish design system, components, and state management

**Why First**: Can't build without foundation. Patterns for everything else.

**Epics**:

1. Design System Foundation
2. Component Primitives
3. State Architecture (Zustand Migration)

**Outcome**: Solid design tokens, reusable primitives, unified state layer

---

### Phase 2: Mobile Setup (Epic 4)

**Goal**: Set up Expo app structure and validate cross-platform patterns

**Why Second**: Validates platform abstraction early.

**Epic**: 4. Mobile Foundation - Expo Setup

**Outcome**: Working Expo app importing shared packages

---

### Phase 3: Core Experience (Epics 5-6)

**Goal**: Implement MVP user journey (brain dump → capacity → timeline → focus)

**Why Third**: Foundation ready, build core value.

**Epics**: 5. Core Screens - Brain Dump & Capacity 6. Core Screens - Timeline &
Focus

**Outcome**: Complete core loop working on web and mobile

---

### Phase 4: Polish & Native Features (Epics 7-8)

**Goal**: Make it feel native and delightful

**Why Fourth**: Core works, now add polish.

**Epics**: 7. Animation & Motion System 8. Native Features - Voice, Haptics,
Gestures

**Outcome**: Calm animations, haptic feedback, voice input, gestures

---

### Phase 5: Intelligence & Settings (Epics 9-10)

**Goal**: Enhance with AI and personalization

**Why Fifth**: Core solid, now add intelligence.

**Epics**: 9. AI Integration - Enhanced Intelligence 10. Settings &
Personalization

**Outcome**: Capacity-aware AI, gentle nudges, user preferences

---

### Phase 6: Deployment (Epic 11)

**Goal**: Automate deployment pipeline

**Why Last**: Everything works locally, now automate.

**Epic**: 11. Build & Deployment Pipeline

**Outcome**: CI/CD, automated deployments, monitoring

---

## Success Metrics

### User Experience Metrics

- **Cognitive Load**: Can users complete brain dump in <30 seconds?
- **Completion Rate**: Do users complete timeline tasks?
- **Return Rate**: Do users return daily?
- **Overwhelm Reduction**: Self-reported stress levels

### Technical Metrics

- **Code Sharing**: 80%+ code shared between platforms
- **Performance**: <100ms interaction-to-feedback latency
- **Accessibility**: WCAG AAA compliance
- **Reduced Motion**: 100% respect for system preference

### Business Metrics

- **Web**: Time to validate concept
- **Mobile**: DAU/MAU ratio (stickiness)
- **Conversion**: Free-to-paid conversion rate

---

## Risk Mitigation

### Technical Risks

1. **Cross-platform complexity**: Mitigated by NativeWind and platform-specific
   files
2. **State sync issues**: Mitigated by Zustand's simplicity
3. **Animation performance**: Mitigated by Reanimated (native thread)

### Product Risks

1. **Feature creep**: Mitigated by strict epic scoping
2. **Overwhelming users**: Mitigated by minimal default settings
3. **ADHD mismatch**: Mitigated by user testing with ADHD community

### Deployment Risks

1. **App Store rejection**: Mitigated by following HIG/Material Design
2. **Breaking changes**: Mitigated by CI/CD and automated testing
3. **Performance regression**: Mitigated by Web Vitals monitoring

---

## Accessibility & Inclusive Design Checklist

### Visual

- ✅ WCAG AAA contrast ratios (7:1 normal, 4.5:1 large)
- ✅ Respect `prefers-color-scheme`
- ✅ Respect `prefers-contrast`
- ✅ Color-blind safe (shapes + labels, not just color)
- ✅ Minimum 16px font size (18px for body)
- ✅ Clear focus indicators (2px outline)

### Motion

- ✅ Respect `prefers-reduced-motion` (CRITICAL)
- ✅ No auto-playing animations
- ✅ No parallax effects
- ✅ Gentle, purposeful transitions only

### Interaction

- ✅ 44pt minimum tap targets (iOS HIG)
- ✅ Keyboard navigation (tab order, focus management)
- ✅ Screen reader support (ARIA labels, semantic HTML)
- ✅ Haptic feedback (optional, can be disabled)

### Cognitive

- ✅ One primary action per screen
- ✅ Clear, concise labels (no jargon)
- ✅ Forgiving input (trim whitespace, case-insensitive)
- ✅ Undo for destructive actions
- ✅ Progress indicators for long operations

### Platform Conventions

- ✅ iOS: SF Symbols, native gestures, iOS HIG
- ✅ Android: Material icons, material gestures
- ✅ Web: Semantic HTML, WCAG compliance

---

## Final Architecture Summary

### Hybrid Architecture (Locked)

- **Web**: Next.js 14 (keep current app)
- **Mobile**: Expo + Expo Router (create new app)
- **Sharing**: 80% via packages (ui, store, types, core, ai)

### Technology Stack

- **State**: Zustand (everywhere)
- **Styling**: Tailwind CSS (web) + NativeWind (mobile)
- **Navigation**: Next.js App Router (web) + Expo Router (mobile)
- **Animation**: Framer Motion (web) + Reanimated 2 (mobile)
- **AI**: Anthropic Claude (existing, enhance)
- **Backend**: Supabase (existing)

### Package Structure

```
packages/
├── ui/          Design system, components, screens
├── store/       Zustand state management
├── types/       TypeScript types (comprehensive)
├── core/        Business logic, services (voice, haptics)
├── ai/          AI prompts and orchestration
```

### Critical Files Reference

#### Design System

- [packages/ui/src/tokens/colors.ts](packages/ui/src/tokens/colors.ts) - ADHD
  category colors
- [packages/ui/src/tokens/typography.ts](packages/ui/src/tokens/typography.ts) -
  Platform fonts
- [packages/ui/src/primitives/Text.tsx](packages/ui/src/primitives/Text.tsx) -
  Typography component
- [packages/ui/src/primitives/Touchable.tsx](packages/ui/src/primitives/Touchable.tsx) -
  Haptic button

#### State Management

- [packages/store/src/index.ts](packages/store/src/index.ts) - Main Zustand
  store
- [packages/store/src/slices/tasksStore.ts](packages/store/src/slices/tasksStore.ts) -
  Task state
- [packages/store/src/slices/capacityStore.ts](packages/store/src/slices/capacityStore.ts) -
  Capacity state

#### Core Screens

- [packages/ui/src/screens/BrainDump/index.tsx](packages/ui/src/screens/BrainDump/index.tsx) -
  Brain dump
- [packages/ui/src/screens/Timeline/index.tsx](packages/ui/src/screens/Timeline/index.tsx) -
  Timeline
- [packages/ui/src/screens/FocusMode/index.tsx](packages/ui/src/screens/FocusMode/index.tsx) -
  Focus mode

#### Mobile App

- [apps/mobile/app/\_layout.tsx](apps/mobile/app/_layout.tsx) - Root layout
- [apps/mobile/app/(tabs)/index.tsx](<apps/mobile/app/(tabs)/index.tsx>) - Brain
  dump screen
- [apps/mobile/metro.config.js](apps/mobile/metro.config.js) - Metro config

#### Native Features

- [packages/core/src/haptics/index.ts](packages/core/src/haptics/index.ts) -
  Haptic service
- [packages/core/src/voice/index.ts](packages/core/src/voice/index.ts) - Voice
  service

#### AI Enhancement

- [packages/ai/src/prompts.ts](packages/ai/src/prompts.ts) - Capacity-aware
  prompts
- [apps/web/app/api/compress/route.ts](apps/web/app/api/compress/route.ts) - API
  endpoint

---

## Conclusion

This plan represents a world-class ADHD planner built with:

- **Calm technology principles**: Technology that serves, not demands
- **Cross-platform excellence**: Shared codebase, native feel
- **Deep ADHD understanding**: Respects executive function challenges
- **Dieter Rams philosophy**: Less but better, honest, unobtrusive

**What would Dieter Rams do?** Remove everything unnecessary, make the essential
obvious, ensure technology disappears into daily life.

**That's what this plan delivers.**

---

_Ready for implementation. No timeline estimates. Just clear, actionable epics._
