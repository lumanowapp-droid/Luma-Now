# @luma/store

**ADHD-friendly state management for Luma Now**

A modular Zustand store with selective persistence, platform-agnostic storage, and ADHD-first design principles.

## Features

- ✅ **6 Modular Slices**: brainDump, tasks, capacity, focus, ui, settings
- ✅ **Selective Persistence**: Tasks and settings survive app restart, ephemeral state resets
- ✅ **Platform-Agnostic**: localStorage (web) and AsyncStorage (mobile) with automatic resolution
- ✅ **Type-Safe**: Full TypeScript support with rich types from `@multi-platform-app/types`
- ✅ **Immer Integration**: Safe state mutations with clean syntax
- ✅ **Performance Optimized**: Selectors for efficient component subscriptions

## Installation

```bash
pnpm add @luma/store
```

## Usage

### Basic Usage

```typescript
import { useLumaStore } from '@luma/store'

function MyComponent() {
  // Subscribe to entire store (re-renders on any change)
  const store = useLumaStore()

  return (
    <div>
      <p>Current view: {store.currentView}</p>
      <p>Tasks: {store.tasks.length}</p>
    </div>
  )
}
```

### Optimized Usage with Selectors

```typescript
import { useLumaStore, selectTasks, selectCapacity } from '@luma/store'

function TaskList() {
  // Only re-renders when tasks change
  const tasks = useLumaStore(selectTasks)

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  )
}

function CapacityIndicator() {
  // Only re-renders when capacity changes
  const { level, max } = useLumaStore(selectCapacity)

  return <p>Capacity: {level} ({max} tasks max)</p>
}
```

## Store Slices

### 1. Brain Dump Slice

Manages brain dump text input and processing state.

**State:**
- `text: string` - Current brain dump text (ephemeral)
- `isProcessing: boolean` - AI processing state (ephemeral)

**Actions:**
- `setText(text: string)` - Update brain dump text
- `setIsProcessing(isProcessing: boolean)` - Set processing state
- `compress()` - Trigger AI compression (async)
- `reset()` - Clear brain dump state

**Example:**
```typescript
const { text, setText, compress } = useLumaStore()

<textarea value={text} onChange={(e) => setText(e.target.value)} />
<button onClick={() => compress()}>Compress</button>
```

### 2. Tasks Slice

Core task management with rich Task type.

**State:**
- `tasks: Task[]` - Array of tasks (persisted)

**Actions:**
- `addTask(task)` - Add single task (auto-generates id, createdAt, order)
- `addTasks(tasks)` - Add multiple tasks (bulk import from AI)
- `toggleTask(id)` - Toggle completion status
- `removeTask(id)` - Delete task
- `updateTask(id, updates)` - Update task fields
- `clearCompleted()` - Remove all completed tasks
- `reorderTasks(taskIds)` - Reorder tasks by ID array

**Example:**
```typescript
const { tasks, addTask, toggleTask } = useLumaStore()

addTask({
  title: 'Buy groceries',
  category: 'personal',
  completed: false,
})

toggleTask(taskId)
```

### 3. Capacity Slice

Manages ADHD-friendly capacity system.

**State:**
- `currentCapacity: CapacityLevel` - 'light' | 'medium' | 'full' (persisted)
- `maxTasks: number` - Max tasks for current capacity (persisted)

**Actions:**
- `setCapacity(level)` - Set capacity level (updates maxTasks automatically)
- `getMaxTasksForCapacity(level)` - Get max tasks for a level

**Capacity Config:**
- Light: 3 tasks
- Medium: 5 tasks
- Full: 7 tasks

**Example:**
```typescript
const { currentCapacity, maxTasks, setCapacity } = useLumaStore()

<button onClick={() => setCapacity('light')}>Light Day (3 tasks)</button>
<p>Current: {currentCapacity} - Max {maxTasks} tasks</p>
```

### 4. Focus Slice

Manages focus mode session state.

**State:**
- `currentTaskId: string | null` - Active task ID (ephemeral)
- `elapsedTime: number` - Elapsed seconds (ephemeral)
- `isActive: boolean` - Focus mode active (ephemeral)

**Actions:**
- `startFocus(taskId)` - Start focus session for task
- `endFocus()` - End focus session
- `updateElapsedTime(seconds)` - Update timer (called by component)

**Example:**
```typescript
const { currentTaskId, elapsedTime, startFocus, endFocus } = useLumaStore()

<button onClick={() => startFocus(task.id)}>Focus</button>
<button onClick={() => endFocus()}>Exit Focus</button>
<p>Time: {elapsedTime}s</p>
```

### 5. UI Slice

Manages UI state (view navigation, modals).

**State:**
- `currentView: 'brain-dump' | 'timeline'` - Active view (ephemeral, resets to 'brain-dump')
- `modalOpen: string | null` - Modal identifier (ephemeral)

**Actions:**
- `setCurrentView(view)` - Switch view
- `openModal(modalId)` - Open modal
- `closeModal()` - Close modal

**Example:**
```typescript
const { currentView, setCurrentView, modalOpen, openModal } = useLumaStore()

<button onClick={() => setCurrentView('timeline')}>Timeline</button>
<button onClick={() => openModal('capacity-modal')}>Set Capacity</button>
```

### 6. Settings Slice

Manages user preferences and accessibility settings.

**State:**
- `settings: LumaUserSettings` - All user settings (persisted)

**Settings Structure:**
```typescript
{
  defaultCapacity: 'medium',
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    hapticFeedback: true,
    voiceInput: false,
  },
  theme: 'system',
  notifications: {
    gentleNudges: true,
    dailyReflection: false,
  },
}
```

**Actions:**
- `updateSettings(updates)` - Update settings (partial merge)
- `resetSettings()` - Reset to defaults

**Example:**
```typescript
const { settings, updateSettings } = useLumaStore()

<select
  value={settings.theme}
  onChange={(e) => updateSettings({ theme: e.target.value })}
>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
  <option value="system">System</option>
</select>
```

## Persistence Strategy

### What Persists (Survives App Restart)

✅ **tasks[]** - User's work must survive
✅ **currentCapacity, maxTasks** - Today's energy level choice
✅ **settings** - All user preferences

### What's Ephemeral (Resets on Load)

❌ **text, isProcessing** - Fresh brain dump on each session
❌ **currentTaskId, elapsedTime, isActive** - Focus session is temporary
❌ **currentView, modalOpen** - Always start at brain-dump

## Available Selectors

Selectors optimize performance by subscribing to specific parts of state:

```typescript
import {
  selectTasks,
  selectCurrentView,
  selectCapacity,
  selectSettings,
  selectBrainDumpText,
  selectIsProcessing,
  selectFocusState,
  selectModalOpen,
} from '@luma/store'

// Usage
const tasks = useLumaStore(selectTasks)
const { level, max } = useLumaStore(selectCapacity)
const settings = useLumaStore(selectSettings)
```

## Platform Compatibility

### Web (Next.js, Vite, etc.)

Uses `localStorage` for persistence. Automatically resolved via `.web.ts` files.

### Mobile (React Native, Expo)

Uses `AsyncStorage` for persistence. Automatically resolved via `.native.ts` files.

### Build Tool Configuration

Build tools (Metro, Next.js) automatically resolve platform-specific files:
- Web: `storageAdapter.web.ts`
- Mobile: `storageAdapter.native.ts`

No runtime checks needed - platform detection at build time!

## ADHD-Friendly Design Patterns

✅ **Auto-save everything** - No manual save buttons
✅ **Predictable state** - All actions are synchronous and immediate
✅ **Clear ownership** - Each slice owns one domain
✅ **Smart defaults** - Fresh start on load (brain dump text cleared)
✅ **Type safety** - Compile-time error prevention
✅ **Minimal API** - Only 6 slices, 3-5 actions each

## Types

All types are exported for use in your components:

```typescript
import type {
  LumaStore,
  Task,
  TaskCategory,
  CapacityLevel,
  LumaUserSettings,
} from '@luma/store'

const task: Task = {
  id: '123',
  title: 'My task',
  category: 'work',
  completed: false,
  createdAt: new Date(),
  order: 0,
}
```

## Future: Web App Migration

This package is ready for use, but the current web app (`apps/web`) still uses its local store at `apps/web/lib/store.ts`.

**Phase 2 Migration Plan:**
1. Update web app to import `@luma/store`
2. Migrate from simple Task type to rich Task type
3. Map AI colors to categories (blue→work, coral→personal, etc.)
4. Remove `apps/web/lib/store.ts`

## Development

```bash
# Install dependencies
pnpm install

# Build package
pnpm run build

# Watch mode
pnpm run dev

# Type check
pnpm run type-check

# Clean dist
pnpm run clean
```

## License

MIT
