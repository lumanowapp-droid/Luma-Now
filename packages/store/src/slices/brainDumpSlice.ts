import { StateCreator } from 'zustand'
import { LumaStore, BrainDumpSlice } from '../types'

const initialState = {
  text: '',
  isProcessing: false,
}

/**
 * Brain Dump Slice
 *
 * Manages the brain dump text input and processing state.
 * This is ephemeral state - resets on app load for fresh start.
 */
export const createBrainDumpSlice: StateCreator<
  LumaStore,
  [['zustand/immer', never]],
  [],
  BrainDumpSlice
> = (set) => ({
  ...initialState,

  setText: (text) => {
    set((state) => {
      state.text = text
    })
  },

  setIsProcessing: (isProcessing) => {
    set((state) => {
      state.isProcessing = isProcessing
    })
  },

  compress: async () => {
    // This is called from components with AI compression logic
    // Store just manages the state
    set((state) => {
      state.isProcessing = true
    })
  },

  reset: () => {
    set((state) => {
      state.text = initialState.text
      state.isProcessing = initialState.isProcessing
    })
  },
})
