import { StorageAdapter } from './storageAdapter'

/**
 * Check if we're running in a browser environment
 */
const isBrowser = () => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

/**
 * Web storage implementation using localStorage
 * Used by Next.js and other web frameworks
 */
export const storage: StorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (!isBrowser()) {
        return null
      }
      return localStorage.getItem(key)
    } catch (error) {
      console.error('localStorage.getItem failed:', error)
      return null
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (!isBrowser()) {
        return
      }
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('localStorage.setItem failed:', error)
      // Fail silently to prevent app crashes on quota exceeded
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      if (!isBrowser()) {
        return
      }
      localStorage.removeItem(key)
    } catch (error) {
      console.error('localStorage.removeItem failed:', error)
    }
  },
}
