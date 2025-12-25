import { StateCreator } from 'zustand'
import { LumaStore, CapacitySlice, CapacityLevel } from '../types'

/**
 * ADHD-friendly capacity configuration
 * Maps capacity levels to maximum task counts
 */
const CAPACITY_CONFIG = {
  light: 3,
  medium: 5,
  full: 7,
} as const

const initialState = {
  currentCapacity: 'medium' as CapacityLevel,
  maxTasks: CAPACITY_CONFIG.medium,
}

/**
 * Capacity Slice
 *
 * Manages the user's selected energy capacity for the day.
 * This prevents overcommitment - core ADHD-friendly feature.
 * This state is persisted - remembers today's capacity choice.
 */
export const createCapacitySlice: StateCreator<
  LumaStore,
  [['zustand/immer', never]],
  [],
  CapacitySlice
> = (set) => ({
  ...initialState,

  setCapacity: (level) => {
    set((state) => {
      state.currentCapacity = level
      state.maxTasks = CAPACITY_CONFIG[level]
    })
  },

  getMaxTasksForCapacity: (level) => {
    return CAPACITY_CONFIG[level]
  },
})
