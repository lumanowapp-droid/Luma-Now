import { StateCreator, StoreApi } from 'zustand'
import { storage } from '../storage/storageAdapter'

/**
 * Options for persistence middleware
 */
interface PersistOptions<T> {
  name: string
  version: number
  partialize?: (state: T) => Partial<T>
  onRehydrateStorage?: (state: T) => void
}

/**
 * Persisted state structure with versioning
 */
interface PersistedState<T> {
  state: Partial<T>
  version: number
}

/**
 * Custom persistence middleware for Zustand
 *
 * Features:
 * - Selective persistence via partialize function
 * - Version tracking for future migrations
 * - Error handling (corrupted state doesn't crash app)
 * - Automatic rehydration on initialization
 * - Platform-agnostic storage (web/mobile)
 */
export const persist = <T extends object>(
  config: StateCreator<T>,
  options: PersistOptions<T>
): StateCreator<T> => {
  return (set, get, api) => {
    const { name, version, partialize, onRehydrateStorage } = options

    // Load persisted state on initialization
    const loadState = async () => {
      try {
        const persistedStateString = await storage.getItem(name)

        if (persistedStateString) {
          const persistedData: PersistedState<T> = JSON.parse(persistedStateString)

          // Version check for migrations
          if (persistedData.version === version) {
            // Merge persisted state with current state
            set(persistedData.state as Partial<T>)

            if (onRehydrateStorage) {
              onRehydrateStorage(get())
            }
          } else {
            console.warn(
              `State version mismatch for "${name}": expected ${version}, got ${persistedData.version}`
            )
            // Future: Add migration logic here
            // For now, clear invalid state
            await storage.removeItem(name)
          }
        }
      } catch (error) {
        console.error(`Failed to load persisted state for "${name}":`, error)
        // Don't crash the app, just continue with initial state
      }
    }

    // Save state on every update
    const saveState = async (state: T) => {
      try {
        // Select which parts of state to persist
        const stateToPersist = partialize ? partialize(state) : state

        const persistedData: PersistedState<T> = {
          state: stateToPersist,
          version,
        }

        const serialized = JSON.stringify(persistedData)
        await storage.setItem(name, serialized)
      } catch (error) {
        console.error(`Failed to persist state for "${name}":`, error)
        // Fail silently to prevent app crashes
      }
    }

    // Subscribe to state changes and persist
    api.subscribe((state) => {
      saveState(state)
    })

    // Load initial persisted state
    loadState()

    // Return the original config
    return config(set, get, api)
  }
}
