import { createServerSupabaseClient } from '../supabase'

export interface CacheConfig {
  defaultTTL: number
  maxMemory: number
  compressionEnabled: boolean
  evictionPolicy: 'lru' | 'lfu' | 'ttl'
}

export interface CacheEntry<T> {
  key: string
  value: T
  ttl: number
  createdAt: number
  accessCount: number
  lastAccessed: number
  compressed: boolean
}

export interface CacheStats {
  hits: number
  misses: number
  hitRate: number
  totalKeys: number
  memoryUsage: number
  evictions: number
}

export class CacheService {
  protected cache = new Map<string, CacheEntry<any>>()
  protected stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalKeys: 0,
    memoryUsage: 0,
    evictions: 0
  }
  protected config: CacheConfig = {
    defaultTTL: 3600, // 1 hour
    maxMemory: 100 * 1024 * 1024, // 100MB
    compressionEnabled: true,
    evictionPolicy: 'lru'
  }

  constructor(config?: Partial<CacheConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
    // Start cleanup interval
    setInterval(() => this.cleanup(), 60000) // Clean up every minute
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<CacheConfig>) {
    this.config = { ...this.config, ...config }
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      this.stats.misses++
      this.updateHitRate()
      return null
    }

    // Check if expired
    if (Date.now() - entry.createdAt > entry.ttl) {
      this.cache.delete(key)
      this.stats.misses++
      this.updateHitRate()
      return null
    }

    // Update access statistics
    entry.accessCount++
    entry.lastAccessed = Date.now()
    
    this.stats.hits++
    this.updateHitRate()

    // Decompress if needed
    if (entry.compressed) {
      return this.decompress(entry.value)
    }

    return entry.value
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      key,
      value,
      ttl: ttl || this.config.defaultTTL,
      createdAt: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
      compressed: false
    }

    // Compress if enabled and beneficial
    if (this.config.compressionEnabled && this.shouldCompress(value)) {
      entry.value = this.compress(value) as T
      entry.compressed = true
    }

    // Check memory limit before adding
    this.ensureMemoryLimit()

    this.cache.set(key, entry)
    this.stats.totalKeys = this.cache.size
    this.updateMemoryUsage()
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      this.stats.totalKeys = this.cache.size
      this.updateMemoryUsage()
    }
    return deleted
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    // Check if expired
    if (Date.now() - entry.createdAt > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
    this.stats.totalKeys = 0
    this.stats.memoryUsage = 0
  }

  /**
   * Get multiple values
   */
  getMany<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {}
    
    for (const key of keys) {
      result[key] = this.get<T>(key)
    }
    
    return result
  }

  /**
   * Set multiple values
   */
  setMany<T>(entries: Record<string, T>, ttl?: number): void {
    for (const [key, value] of Object.entries(entries)) {
      this.set(key, value, ttl)
    }
  }

  /**
   * Delete multiple values
   */
  deleteMany(keys: string[]): number {
    let deleted = 0
    for (const key of keys) {
      if (this.delete(key)) {
        deleted++
      }
    }
    return deleted
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats }
  }

  /**
   * Get keys matching pattern
   */
  keys(pattern?: string): string[] {
    const allKeys = Array.from(this.cache.keys())
    
    if (!pattern) {
      return allKeys
    }

    // Simple pattern matching (wildcard *)
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    return allKeys.filter(key => regex.test(key))
  }

  /**
   * Increment counter
   */
  increment(key: string, by = 1): number {
    const current = this.get<number>(key) || 0
    const newValue = current + by
    this.set(key, newValue)
    return newValue
  }

  /**
   * Decrement counter
   */
  decrement(key: string, by = 1): number {
    const current = this.get<number>(key) || 0
    const newValue = current - by
    this.set(key, newValue)
    return newValue
  }

  /**
   * Get cache entry info
   */
  getEntryInfo(key: string): CacheEntry<any> | null {
    return this.cache.get(key) || null
  }

  /**
   * Update TTL for existing key
   */
  expire(key: string, ttl: number): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    entry.ttl = ttl
    entry.createdAt = Date.now() // Reset creation time
    return true
  }

  /**
   * Check if value should be compressed
   */
  protected shouldCompress(value: any): boolean {
    const jsonString = JSON.stringify(value)
    return jsonString.length > 1024 // Compress if larger than 1KB
  }

  /**
   * Simple compression (in production, use a proper compression library)
   */
  protected compress(value: any): string {
    const jsonString = JSON.stringify(value)
    // In production, use gzip or similar
    return Buffer.from(jsonString).toString('base64')
  }

  /**
   * Simple decompression
   */
  protected decompress(compressedValue: string): any {
    // In production, use proper decompression
    const jsonString = Buffer.from(compressedValue, 'base64').toString()
    return JSON.parse(jsonString)
  }

  /**
   * Ensure memory limit is not exceeded
   */
  protected ensureMemoryLimit(): void {
    while (this.stats.memoryUsage > this.config.maxMemory && this.cache.size > 0) {
      this.evictOne()
    }
  }

  /**
   * Evict one entry based on policy
   */
  protected evictOne(): void {
    if (this.cache.size === 0) return

    let evictKey: string | null = null
    let evictEntry: CacheEntry<any> | null = null

    for (const [key, entry] of this.cache.entries()) {
      if (!evictEntry) {
        evictKey = key
        evictEntry = entry
        continue
      }

      // Apply eviction policy
      switch (this.config.evictionPolicy) {
        case 'lru':
          if (entry.lastAccessed < evictEntry.lastAccessed) {
            evictKey = key
            evictEntry = entry
          }
          break
        case 'lfu':
          if (entry.accessCount < evictEntry.accessCount) {
            evictKey = key
            evictEntry = entry
          }
          break
        case 'ttl':
          const entryAge = Date.now() - entry.createdAt
          const evictAge = Date.now() - evictEntry.createdAt
          if (entryAge > evictAge) {
            evictKey = key
            evictEntry = entry
          }
          break
      }
    }

    if (evictKey) {
      this.cache.delete(evictKey)
      this.stats.evictions++
      this.stats.totalKeys = this.cache.size
      this.updateMemoryUsage()
    }
  }

  /**
   * Cleanup expired entries
   */
  protected cleanup(): void {
    const now = Date.now()
    const toDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.createdAt > entry.ttl) {
        toDelete.push(key)
      }
    }

    for (const key of toDelete) {
      this.cache.delete(key)
    }

    if (toDelete.length > 0) {
      this.stats.totalKeys = this.cache.size
      this.updateMemoryUsage()
    }
  }

  /**
   * Update hit rate statistics
   */
  protected updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0
  }

  /**
   * Update memory usage statistics
   */
  protected updateMemoryUsage(): void {
    let totalSize = 0
    for (const entry of this.cache.values()) {
      const entrySize = JSON.stringify(entry).length
      totalSize += entrySize
    }
    this.stats.memoryUsage = totalSize
  }
}

// Enterprise-specific cache implementations
export class TenantCacheService extends CacheService {
  private tenantCaches = new Map<string, CacheService>()

  constructor() {
    super({
      defaultTTL: 1800, // 30 minutes for tenant data
      maxMemory: 50 * 1024 * 1024, // 50MB per tenant
      evictionPolicy: 'lru'
    })
  }

  getTenantCache(tenantId: string): CacheService {
    if (!this.tenantCaches.has(tenantId)) {
      const cache = new CacheService({
        defaultTTL: 1800, // 30 minutes for tenant data
        maxMemory: 50 * 1024 * 1024, // 50MB per tenant
        evictionPolicy: 'lru'
      })
      this.tenantCaches.set(tenantId, cache)
    }
    return this.tenantCaches.get(tenantId)!
  }

  clearTenantCache(tenantId: string): void {
    const cache = this.tenantCaches.get(tenantId)
    if (cache) {
      cache.clear()
    }
  }
}

export class UserSessionCache extends CacheService {
  constructor() {
    super({
      defaultTTL: 3600, // 1 hour
      maxMemory: 20 * 1024 * 1024, // 20MB for sessions
      evictionPolicy: 'ttl'
    })
  }
}

// Export singleton instances
export const cacheService = new CacheService()
export const tenantCacheService = new TenantCacheService()
export const sessionCache = new UserSessionCache()