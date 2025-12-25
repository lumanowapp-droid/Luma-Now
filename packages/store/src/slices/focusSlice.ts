import { StateCreator } from 'zustand'
import { LumaStore, FocusSlice } from '../types'

const initialState = {
  currentTaskId: null,
  elapsedTime: 0,
  isActive: false,
}

/**
 * Focus Slice
 *
 * Manages focus mode session state.
 * Tracks current task, elapsed time, and active status.
 * This is ephemeral state - resets on app load.
 */
export const createFocusSlice: StateCreator<
  LumaStore,
  [['zustand/immer', never]],
  [],
  FocusSlice
> = (set) => ({
  ...initialState,

  startFocus: (taskId) => {
    set((state) => {
      state.currentTaskId = taskId
      state.elapsedTime = 0
      state.isActive = true
    })
  },

  endFocus: () => {
    set((state) => {
      state.currentTaskId = null
      state.elapsedTime = 0
      state.isActive = false
    })
  },

  updateElapsedTime: (seconds) => {
    set((state) => {
      state.elapsedTime = seconds
    })
  },
})
