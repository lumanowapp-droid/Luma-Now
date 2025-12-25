import { StateCreator } from 'zustand'
import { LumaStore, UISlice } from '../types'

const initialState = {
  currentView: 'brain-dump' as const,
  modalOpen: null,
}

/**
 * UI Slice
 *
 * Manages UI state (view navigation, modals).
 * This is ephemeral state - always resets to brain-dump on load.
 */
export const createUISlice: StateCreator<
  LumaStore,
  [['zustand/immer', never]],
  [],
  UISlice
> = (set) => ({
  ...initialState,

  setCurrentView: (view) => {
    set((state) => {
      state.currentView = view
    })
  },

  openModal: (modalId) => {
    set((state) => {
      state.modalOpen = modalId
    })
  },

  closeModal: () => {
    set((state) => {
      state.modalOpen = null
    })
  },
})
