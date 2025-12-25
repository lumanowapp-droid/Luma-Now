import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from './middleware/persistenceMiddleware'
import { createBrainDumpSlice } from './slices/brainDumpSlice'
import { createTasksSlice } from './slices/tasksSlice'
import { createCapacitySlice } from './slices/capacitySlice'
import { createFocusSlice } from './slices/focusSlice'
import { createUISlice } from './slices/uiSlice'
import { createSettingsSlice } from './slices/settingsSlice'
import { LumaStore } from './types'

/**
 * Main Luma Store
 *
 * Combines all 6 slices into a single Zustand store with:
 * - Immer middleware for safe mutations
 * - Persistence middleware for selective state saving
 * - Platform-agnostic storage (web/mobile)
 *
 * Persisted state (survives app restart):
 * - tasks[]
 * - currentCapacity, maxTasks
 * - settings
 *
 * Ephemeral state (resets on load):
 * - text, isProcessing
 * - currentTaskId, elapsedTime, isActive
 * - currentView, modalOpen
 */
export const useLumaStore = create<LumaStore>()(
  immer(
    persist(
      (...args) => ({
        ...createBrainDumpSlice(...args),
        ...createTasksSlice(...args),
        ...createCapacitySlice(...args),
        ...createFocusSlice(...args),
        ...createUISlice(...args),
        ...createSettingsSlice(...args),
      }),
      {
        name: 'luma-store',
        version: 1,
        partialize: (state) => ({
          // Only persist these parts of the state
          tasks: state.tasks,
          currentCapacity: state.currentCapacity,
          maxTasks: state.maxTasks,
          settings: state.settings,
          // Everything else is ephemeral and resets on load
        }),
        onRehydrateStorage: (state) => {
          console.log('Luma store rehydrated from storage')
        },
      }
    )
  )
)

// ===================================
// SELECTORS FOR OPTIMIZED SUBSCRIPTIONS
// ===================================

/**
 * Select all tasks
 * Use: const tasks = useLumaStore(selectTasks)
 */
export const selectTasks = (state: LumaStore) => state.tasks

/**
 * Select current view
 * Use: const view = useLumaStore(selectCurrentView)
 */
export const selectCurrentView = (state: LumaStore) => state.currentView

/**
 * Select capacity state
 * Use: const { level, max } = useLumaStore(selectCapacity)
 */
export const selectCapacity = (state: LumaStore) => ({
  level: state.currentCapacity,
  max: state.maxTasks,
})

/**
 * Select settings
 * Use: const settings = useLumaStore(selectSettings)
 */
export const selectSettings = (state: LumaStore) => state.settings

/**
 * Select brain dump text
 * Use: const text = useLumaStore(selectBrainDumpText)
 */
export const selectBrainDumpText = (state: LumaStore) => state.text

/**
 * Select processing state
 * Use: const isProcessing = useLumaStore(selectIsProcessing)
 */
export const selectIsProcessing = (state: LumaStore) => state.isProcessing

/**
 * Select focus state
 * Use: const { taskId, elapsed, active } = useLumaStore(selectFocusState)
 */
export const selectFocusState = (state: LumaStore) => ({
  taskId: state.currentTaskId,
  elapsed: state.elapsedTime,
  active: state.isActive,
})

/**
 * Select modal state
 * Use: const modalOpen = useLumaStore(selectModalOpen)
 */
export const selectModalOpen = (state: LumaStore) => state.modalOpen
