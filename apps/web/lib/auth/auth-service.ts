import { createServerSupabaseClient } from '../supabase'
import { Database } from '@/types/database'

export interface TenantContext {
  id: string
  name: string
  slug: string
  subscription_tier: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'suspended' | 'cancelled'
  limits: {
    api_requests_per_hour: number
    storage_gb: number
    users: number
    features: string[]
  }
}

export interface UserProfile {
  id: string
  tenant_id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'owner' | 'admin' | 'member' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  preferences: Record<string, any>
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface Permission {
  resource: string
  action: 'read' | 'write' | 'delete' | '*'
  scope?: string
}

export interface AuthenticatedRequest {
  user: UserProfile
  tenant: TenantContext
  permissions: string[]
  tenantContext: TenantContext
}

export class AuthenticationError extends Error {
  constructor(message: string, public statusCode = 401) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string, public statusCode = 403) {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class TenantError extends Error {
  constructor(message: string, public statusCode = 400) {
    super(message)
    this.name = 'TenantError'
  }
}

export class AuthenticationService {
  /**
   * Authenticate user and get tenant context
   */
  async authenticate(request: Request): Promise<AuthenticatedRequest> {
    try {
      const supabase = await createServerSupabaseClient()

      // Get authorization header
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Missing or invalid authorization header')
      }

      const token = authHeader.substring(7)
      
      // Verify the JWT token
      const { data: { user }, error: userError } = await supabase.auth.getUser(token)
      if (userError || !user) {
        throw new AuthenticationError('Invalid or expired token')
      }

      // Get user profile with tenant context
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select(`
          *,
          tenants!inner (
            id,
            name,
            slug,
            subscription_tier,
            status,
            limits
          )
        `)
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        throw new AuthenticationError('User profile not found')
      }

      if (profile.status !== 'active') {
        throw new AuthenticationError('User account is not active')
      }

      if (profile.tenants.status !== 'active') {
        throw new TenantError('Tenant account is not active')
      }

      // Get user permissions
      const permissions = await this.getUserPermissions(user.id)

      return {
        user: profile as UserProfile,
        tenant: profile.tenants as TenantContext,
        permissions,
        tenantContext: profile.tenants as TenantContext
      }
    } catch (error) {
      if (error instanceof AuthenticationError || 
          error instanceof AuthorizationError || 
          error instanceof TenantError) {
        throw error
      }
      throw new AuthenticationError('Authentication failed')
    }
  }

  /**
   * Get user permissions from roles
   */
  private async getUserPermissions(userId: string): Promise<string[]> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        roles!inner (
          permissions
        )
      `)
      .eq('user_id', userId)
      .is('expires_at', null)

    if (error) {
      console.error('Error fetching user permissions:', error)
      return []
    }

    const permissions = new Set<string>()
    
    data?.forEach((userRole: any) => {
      const rolePermissions = userRole.roles.permissions as string[]
      rolePermissions.forEach((permission) => {
        permissions.add(permission)
      })
    })

    return Array.from(permissions)
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permissions: string[], resource: string, action: string): boolean {
    // Check for wildcard permission
    if (permissions.includes('*')) {
      return true
    }

    // Check for specific permission
    const permission = `${resource}.${action}`
    if (permissions.includes(permission)) {
      return true
    }

    // Check for resource wildcard
    const resourceWildcard = `${resource}.*`
    if (permissions.includes(resourceWildcard)) {
      return true
    }

    // Check for action wildcard on any resource
    const actionWildcard = `*.${action}`
    if (permissions.includes(actionWildcard)) {
      return true
    }

    return false
  }

  /**
   * Require specific permission
   */
  requirePermission(resource: string, action: string) {
    return (req: AuthenticatedRequest) => {
      if (!this.hasPermission(req.permissions, resource, action)) {
        throw new AuthorizationError(
          `Insufficient permissions. Required: ${resource}.${action}`
        )
      }
    }
  }

  /**
   * Get tenant by slug
   */
  async getTenantBySlug(slug: string): Promise<TenantContext | null> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return null
    }

    return data as TenantContext
  }

  /**
   * Create new tenant
   */
  async createTenant(
    name: string, 
    slug: string, 
    adminUserId: string
  ): Promise<TenantContext> {
    const supabase = await createServerSupabaseClient()

    // Check if slug is available
    const existing = await this.getTenantBySlug(slug)
    if (existing) {
      throw new TenantError('Tenant slug already exists')
    }

    // Create tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name,
        slug,
        subscription_tier: 'free',
        status: 'active'
      })
      .select()
      .single()

    if (tenantError || !tenant) {
      throw new TenantError('Failed to create tenant')
    }

    // Update user profile with tenant_id and owner role
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        tenant_id: tenant.id,
        role: 'owner'
      })
      .eq('id', adminUserId)

    if (profileError) {
      throw new TenantError('Failed to update user profile')
    }

    return tenant as TenantContext
  }

  /**
   * Log security event
   */
  async logSecurityEvent(
    tenantId: string,
    userId: string | null,
    eventType: string,
    description: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    metadata: Record<string, any> = {}
  ) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('security_events')
      .insert({
        tenant_id: tenantId,
        user_id: userId,
        event_type: eventType,
        description,
        severity,
        metadata
      })

    if (error) {
      console.error('Failed to log security event:', error)
    }
  }

  /**
   * Log audit event
   */
  async logAuditEvent(
    tenantId: string,
    userId: string | null,
    action: string,
    resourceType: string,
    resourceId: string | null,
    oldValues: Record<string, any> | null,
    newValues: Record<string, any> | null,
    request: Request
  ) {
    const supabase = await createServerSupabaseClient()
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const { error } = await supabase
      .from('audit_logs')
      .insert({
        tenant_id: tenantId,
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        old_values: oldValues,
        new_values: newValues,
        ip_address: ipAddress,
        user_agent: userAgent
      })

    if (error) {
      console.error('Failed to log audit event:', error)
    }
  }
}

// Export singleton instance
export const authService = new AuthenticationService()