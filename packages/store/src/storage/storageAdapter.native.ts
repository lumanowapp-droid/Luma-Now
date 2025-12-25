import AsyncStorage from '@react-native-async-storage/async-storage'
import { StorageAdapter } from './storageAdapter'

/**
 * React Native storage implementation using AsyncStorage
 * Used by Expo and React Native apps
 */
export const storage: StorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key)
    } catch (error) {
      console.error('AsyncStorage.getItem failed:', error)
      return null
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      console.error('AsyncStorage.setItem failed:', error)
      // Fail silently to prevent app crashes
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error('AsyncStorage.removeItem failed:', error)
    }
  },
}
