import { StateCreator } from 'zustand'
import { LumaStore, SettingsSlice, LumaUserSettings, AIProvider } from '../types'

/**
 * Helper function to get default AI provider based on user status
 * TODO: Implement premium user check
 */
const getDefaultAIProvider = (): AIProvider => {
  // Placeholder: always return 'cloudflare' for now
  // In future: return 'anthropic' for premium users
  return 'cloudflare'
}

/**
 * Default ADHD-friendly settings
 */
const DEFAULT_SETTINGS: LumaUserSettings = {
  defaultCapacity: 'medium',
  theme: 'system',
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
  hapticFeedback: true,
  voiceInput: false,
  gentleNudges: true,
  dailyReflection: false,
  hasCompletedOnboarding: false,
  aiProvider: getDefaultAIProvider(),
}

const initialState = {
  settings: DEFAULT_SETTINGS,
}

/**
 * Settings Slice
 *
 * Manages user preferences and accessibility settings.
 * All settings are persisted - remembers user choices.
 */
export const createSettingsSlice: StateCreator<
  LumaStore,
  [['zustand/immer', never]],
  [],
  SettingsSlice
> = (set) => ({
  ...initialState,

  updateSettings: (updates) => {
    set((state) => {
      state.settings = { ...state.settings, ...updates }
    })
  },

  resetSettings: () => {
    set((state) => {
      state.settings = DEFAULT_SETTINGS
    })
  },
})
