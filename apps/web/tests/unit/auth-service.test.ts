import { describe, test, expect, beforeEach, vi } from 'vitest'
import { AuthenticationService } from '../../lib/auth/auth-service'
import { createServerSupabaseClient } from '../../lib/supabase'

// Mock the Supabase client
vi.mock('../../lib/supabase', () => ({
  createServerSupabaseClient: vi.fn()
}))

describe('AuthenticationService', () => {
  let authService: AuthenticationService
  let mockSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Create mock Supabase client
    mockSupabase = {
      auth: {
        getUser: vi.fn()
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
        is: vi.fn().mockReturnThis()
      }))
    }

    ;(createServerSupabaseClient as vi.MockedFunction<typeof createServerSupabaseClient>)
      .mockResolvedValue(mockSupabase)

    authService = new AuthenticationService()
  })

  describe('authenticate', () => {
    test('should authenticate user with valid token', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      const mockProfile = {
        id: 'user-123',
        tenant_id: 'tenant-123',
        email: 'test@example.com',
        full_name: 'Test User',
        avatar_url: null,
        role: 'member',
        status: 'active',
        preferences: {},
        last_login_at: null,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        tenants: {
          id: 'tenant-123',
          name: 'Test Tenant',
          slug: 'test-tenant',
          subscription_tier: 'free',
          status: 'active',
          limits: {
            api_requests_per_hour: 1000,
            storage_gb: 1,
            users: 5,
            features: []
          }
        }
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockProfile,
        error: null
      })

      // Mock permissions query
      mockSupabase.from().select().eq().is.mockResolvedValue({
        data: [
          {
            roles: {
              permissions: ['tasks.read', 'tasks.write']
            }
          }
        ],
        error: null
      })

      const request = new Request('http://localhost', {
        headers: {
          authorization: 'Bearer valid-token'
        }
      })

      const result = await authService.authenticate(request)

      expect(result).toBeDefined()
      expect(result.user.id).toBe('user-123')
      expect(result.tenant.id).toBe('tenant-123')
      expect(result.permissions).toContain('tasks.read')
      expect(result.permissions).toContain('tasks.write')
    })

    test('should throw AuthenticationError for missing authorization header', async () => {
      const request = new Request('http://localhost')

      await expect(authService.authenticate(request))
        .rejects.toThrow('Missing or invalid authorization header')
    })

    test('should throw AuthenticationError for invalid token', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' }
      })

      const request = new Request('http://localhost', {
        headers: {
          authorization: 'Bearer invalid-token'
        }
      })

      await expect(authService.authenticate(request))
        .rejects.toThrow('Invalid or expired token')
    })

    test('should throw AuthenticationError for inactive user', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      const mockProfile = {
        ...mockUser,
        tenant_id: 'tenant-123',
        email: 'test@example.com',
        role: 'member',
        status: 'inactive', // Inactive user
        tenants: {
          id: 'tenant-123',
          name: 'Test Tenant',
          slug: 'test-tenant',
          subscription_tier: 'free',
          status: 'active',
          limits: {
            api_requests_per_hour: 1000,
            storage_gb: 1,
            users: 5,
            features: []
          }
        }
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockProfile,
        error: null
      })

      const request = new Request('http://localhost', {
        headers: {
          authorization: 'Bearer valid-token'
        }
      })

      await expect(authService.authenticate(request))
        .rejects.toThrow('User account is not active')
    })
  })

  describe('hasPermission', () => {
    test('should return true for wildcard permission', () => {
      const permissions = ['*']
      expect(authService.hasPermission(permissions, 'tasks', 'read')).toBe(true)
      expect(authService.hasPermission(permissions, 'projects', 'write')).toBe(true)
    })

    test('should return true for exact permission match', () => {
      const permissions = ['tasks.read', 'projects.write']
      expect(authService.hasPermission(permissions, 'tasks', 'read')).toBe(true)
      expect(authService.hasPermission(permissions, 'projects', 'write')).toBe(true)
    })

    test('should return true for resource wildcard', () => {
      const permissions = ['tasks.*']
      expect(authService.hasPermission(permissions, 'tasks', 'read')).toBe(true)
      expect(authService.hasPermission(permissions, 'tasks', 'write')).toBe(true)
      expect(authService.hasPermission(permissions, 'tasks', 'delete')).toBe(true)
    })

    test('should return false for insufficient permissions', () => {
      const permissions = ['tasks.read']
      expect(authService.hasPermission(permissions, 'projects', 'read')).toBe(false)
      expect(authService.hasPermission(permissions, 'tasks', 'write')).toBe(false)
    })
  })

  describe('getTenantBySlug', () => {
    test('should return tenant for valid slug', async () => {
      const mockTenant = {
        id: 'tenant-123',
        name: 'Test Tenant',
        slug: 'test-tenant',
        subscription_tier: 'free',
        status: 'active',
        limits: {
          api_requests_per_hour: 1000,
          storage_gb: 1,
          users: 5,
          features: []
        }
      }

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockTenant,
        error: null
      })

      const result = await authService.getTenantBySlug('test-tenant')

      expect(result).toBeDefined()
      expect(result?.id).toBe('tenant-123')
      expect(result?.slug).toBe('test-tenant')
    })

    test('should return null for invalid slug', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' }
      })

      const result = await authService.getTenantBySlug('invalid-slug')

      expect(result).toBeNull()
    })
  })

  describe('createTenant', () => {
    test('should create tenant successfully', async () => {
      const mockTenant = {
        id: 'tenant-123',
        name: 'New Tenant',
        slug: 'new-tenant',
        subscription_tier: 'free',
        status: 'active'
      }

      // Mock getTenantBySlug to return null (slug available)
      vi.spyOn(authService, 'getTenantBySlug').mockResolvedValue(null)

      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: mockTenant,
        error: null
      })

      mockSupabase.from().update().eq.mockResolvedValue({
        error: null
      })

      const result = await authService.createTenant('New Tenant', 'new-tenant', 'user-123')

      expect(result).toBeDefined()
      expect(result.id).toBe('tenant-123')
      expect(result.name).toBe('New Tenant')
      expect(result.slug).toBe('new-tenant')
    })

    test('should throw error for duplicate slug', async () => {
      const existingTenant = {
        id: 'tenant-123',
        name: 'Existing Tenant',
        slug: 'existing-tenant'
      }

      vi.spyOn(authService, 'getTenantBySlug').mockResolvedValue(existingTenant)

      await expect(authService.createTenant('New Tenant', 'existing-tenant', 'user-123'))
        .rejects.toThrow('Tenant slug already exists')
    })
  })
})