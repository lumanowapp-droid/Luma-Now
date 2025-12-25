/**
 * @luma/store
 * ADHD-friendly state management for Luma Now
 */

// ===================================
// MAIN STORE HOOK
// ===================================

export { useLumaStore } from './createStore'
// Alias for compatibility
export { useLumaStore as useAppStore } from './createStore'

// ===================================
// SELECTORS
// ===================================

export {
  selectTasks,
  selectCurrentView,
  selectCapacity,
  selectSettings,
  selectBrainDumpText,
  selectIsProcessing,
  selectFocusState,
  selectModalOpen,
} from './createStore'

// ===================================
// TYPES
// ===================================

export type {
  // Main store
  LumaStore,
  // Slice types
  BrainDumpSlice,
  TasksSlice,
  CapacitySlice,
  FocusSlice,
  UISlice,
  SettingsSlice,
  // Re-exported from @multi-platform-app/types
  Task,
  TaskCategory,
  CapacityLevel,
  LumaUserSettings,
} from './types'

// ===================================
// STORAGE (for testing)
// ===================================

export { storage } from './storage/storageAdapter'