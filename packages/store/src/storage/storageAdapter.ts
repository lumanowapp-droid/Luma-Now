/**
 * Platform-agnostic storage interface
 * Implementations: storageAdapter.web.ts (localStorage) and storageAdapter.native.ts (AsyncStorage)
 */
export interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>
  setItem: (key: string, value: string) => Promise<void>
  removeItem: (key: string) => Promise<void>
}

// Re-export platform-specific implementation
// Build tools (Metro/Next.js) will automatically resolve to the correct file
export * from './storageAdapter.web'
