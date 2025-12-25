import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../supabase'
import { authService, AuthenticatedRequest } from '../auth/auth-service'

// Types for header API
export interface NotificationItem {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export interface SearchResult {
  id: string
  type: 'task' | 'project' | 'team' | 'document'
  title: string
  description?: string
  url: string
  category: string
}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator?: (request: NextRequest) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  message?: string
}

export interface APIVersion {
  version: string
  deprecated?: boolean
  sunsetDate?: string
  maxAge?: number
}

export interface APIEndpoint {
  path: string
  methods: string[]
  version: string
  rateLimit: RateLimitConfig
  permissions?: string[]
  deprecated?: boolean
}

export class APIRateLimitError extends Error {
  constructor(message: string, public retryAfter?: number) {
    super(message)
    this.name = 'APIRateLimitError'
  }
}

export class APIValidationError extends Error {
  constructor(message: string, public statusCode = 400) {
    super(message)
    this.name = 'APIValidationError'
  }
}

export class APIVersionError extends Error {
  constructor(message: string, public statusCode = 400) {
    super(message)
    this.name = 'APIVersionError'
  }
}

export class APIGateway {
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>()
  
  // Define API versions and their configurations
  private apiVersions: APIVersion[] = [
    { version: 'v1', maxAge: 31536000 }, // 1 year
    { version: 'v2', maxAge: 31536000 }, // 1 year
  ]

  // Define API endpoints with rate limiting
  private endpoints: APIEndpoint[] = [
    {
      path: '/api/v1/compress',
      methods: ['POST'],
      version: 'v1',
      rateLimit: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10,
        message: 'Rate limit exceeded. Please try again in a minute.'
      },
      permissions: ['tasks.write']
    },
    {
      path: '/api/v2/compress',
      methods: ['POST'],
      version: 'v2',
      rateLimit: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 20,
        message: 'Rate limit exceeded. Please try again in a minute.'
      },
      permissions: ['tasks.write']
    },
    {
      path: '/api/v1/tasks',
      methods: ['GET', 'POST'],
      version: 'v1',
      rateLimit: {
        windowMs: 60 * 1000,
        maxRequests: 60,
        message: 'Rate limit exceeded. Please try again in a minute.'
      },
      permissions: ['tasks.read', 'tasks.write']
    },
    {
      path: '/api/v1/projects',
      methods: ['GET', 'POST'],
      version: 'v1',
      rateLimit: {
        windowMs: 60 * 1000,
        maxRequests: 30,
        message: 'Rate limit exceeded. Please try again in a minute.'
      },
      permissions: ['projects.read', 'projects.write']
    },
    {
      path: '/api/notifications',
      methods: ['GET'],
      version: 'v1',
      rateLimit: {
        windowMs: 60 * 1000,
        maxRequests: 60,
        message: 'Rate limit exceeded. Please try again in a minute.'
      },
      permissions: [] // No authentication required for notifications
    },
    {
      path: '/api/search',
      methods: ['GET'],
      version: 'v1',
      rateLimit: {
        windowMs: 60 * 1000,
        maxRequests: 60,
        message: 'Rate limit exceeded. Please try again in a minute.'
      },
      permissions: [] // No authentication required for search
    },
    {
      path: '/api/notifications/[id]/read',
      methods: ['POST'],
      version: 'v1',
      rateLimit: {
        windowMs: 60 * 1000,
        maxRequests: 100,
        message: 'Rate limit exceeded. Please try again in a minute.'
      },
      permissions: [] // No authentication required for marking read
    }
  ]

  /**
   * Check API version compatibility
   */
  private parseAPIVersion(request: NextRequest): string {
    // Check path version
    const pathMatch = request.nextUrl.pathname.match(/\/api\/v(\d+)\//)
    if (pathMatch) {
      const version = `v${pathMatch[1]}`
      const versionConfig = this.apiVersions.find(v => v.version === version)
      if (!versionConfig) {
        throw new APIVersionError(`Unsupported API version: ${version}`)
      }
      return version
    }

    // Check header version
    const headerVersion = request.headers.get('API-Version')
    if (headerVersion) {
      const versionConfig = this.apiVersions.find(v => v.version === headerVersion)
      if (!versionConfig) {
        throw new APIVersionError(`Unsupported API version: ${headerVersion}`)
      }
      return headerVersion
    }

    // Default to latest version
    return 'v2'
  }

  /**
   * Generate rate limit key
   */
  private generateRateLimitKey(
    request: NextRequest, 
    endpoint: APIEndpoint,
    authContext?: AuthenticatedRequest
  ): string {
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1'
    
    const identifier = authContext?.user?.id || clientIP
    const endpointPath = endpoint.path
    const windowStart = Math.floor(Date.now() / endpoint.rateLimit.windowMs)
    
    return `${endpointPath}:${identifier}:${windowStart}`
  }

  /**
   * Check rate limit for endpoint
   */
  private async checkRateLimit(
    request: NextRequest,
    endpoint: APIEndpoint,
    authContext?: AuthenticatedRequest
  ): Promise<void> {
    const key = this.generateRateLimitKey(request, endpoint, authContext)
    const now = Date.now()
    const windowMs = endpoint.rateLimit.windowMs
    
    const current = this.rateLimitStore.get(key)
    
    if (!current || now > current.resetTime) {
      // New window or expired window
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return
    }

    if (current.count >= endpoint.rateLimit.maxRequests) {
      const retryAfter = Math.ceil((current.resetTime - now) / 1000)
      throw new APIRateLimitError(
        endpoint.rateLimit.message || 'Rate limit exceeded',
        retryAfter
      )
    }

    current.count++
  }

  /**
   * Find matching endpoint configuration
   * Supports dynamic route segments like [id]
   */
  private findEndpoint(pathname: string, method: string): APIEndpoint | null {
    return this.endpoints.find(endpoint => {
      if (!endpoint.methods.includes(method)) {
        return false;
      }

      // Exact match
      if (endpoint.path === pathname) {
        return true;
      }

      // Dynamic route matching
      const endpointParts = endpoint.path.split('/');
      const pathnameParts = pathname.split('/');

      if (endpointParts.length !== pathnameParts.length) {
        return false;
      }

      return endpointParts.every((part, index) => {
        // Dynamic segment [id], [slug], etc.
        if (part.startsWith('[') && part.endsWith(']')) {
          return true;
        }
        return part === pathnameParts[index];
      });
    }) || null;
  }

  /**
   * Validate API request
   */
  private validateRequest(request: NextRequest): void {
    // Validate Content-Type for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentType = request.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new APIValidationError('Content-Type must be application/json')
      }
    }

    // Validate request size (10MB limit)
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      throw new APIValidationError('Request size exceeds 10MB limit')
    }
  }

  /**
   * Apply API versioning headers
   */
  private applyVersionHeaders(response: NextResponse, version: string): NextResponse {
    response.headers.set('API-Version', version)
    
    const versionConfig = this.apiVersions.find(v => v.version === version)
    if (versionConfig?.maxAge) {
      response.headers.set('Cache-Control', `public, max-age=${versionConfig.maxAge}`)
    }
    
    if (versionConfig?.deprecated) {
      response.headers.set('Deprecation', 'true')
      if (versionConfig.sunsetDate) {
        response.headers.set('Sunset', versionConfig.sunsetDate)
      }
    }

    return response
  }

  /**
   * Main API gateway handler
   */
  async handleRequest(
    request: NextRequest,
    handler: (req: NextRequest, authContext?: AuthenticatedRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    try {
      // Validate request
      this.validateRequest(request)

      // Parse API version
      const version = this.parseAPIVersion(request)
      
      // Find endpoint configuration
      const endpoint = this.findEndpoint(request.nextUrl.pathname, request.method)
      if (!endpoint) {
        return NextResponse.json(
          { error: 'Endpoint not found' },
          { status: 404 }
        )
      }

      // Check if endpoint is deprecated
      if (endpoint.deprecated) {
        console.warn(`Using deprecated endpoint: ${endpoint.path}`)
      }

      // Authenticate if required
      let authContext: AuthenticatedRequest | undefined
      if (endpoint.permissions && endpoint.permissions.length > 0) {
        authContext = await authService.authenticate(request)
      }

      // Check permissions
      if (endpoint.permissions) {
        for (const permission of endpoint.permissions) {
          const [resource, action] = permission.split('.')
          if (!authService.hasPermission(authContext!.permissions, resource, action)) {
            return NextResponse.json(
              { error: 'Insufficient permissions' },
              { status: 403 }
            )
          }
        }
      }

      // Check rate limit
      await this.checkRateLimit(request, endpoint, authContext)

      // Execute handler
      const response = await handler(request, authContext)

      // Apply version headers
      return this.applyVersionHeaders(response, version)

    } catch (error) {
      console.error('API Gateway error:', error)

      if (error instanceof APIRateLimitError) {
        return NextResponse.json(
          { error: error.message },
          { 
            status: 429,
            headers: {
              'Retry-After': error.retryAfter?.toString() || '60'
            }
          }
        )
      }

      if (error instanceof APIVersionError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        )
      }

      if (error instanceof APIValidationError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        )
      }

      // Check for authentication and authorization errors
      const authError = error as any
      if (authError.name === 'AuthenticationError') {
        return NextResponse.json(
          { error: authError.message || 'Authentication failed' },
          { status: 401 }
        )
      }

      if (authError.name === 'AuthorizationError') {
        return NextResponse.json(
          { error: authError.message || 'Authorization failed' },
          { status: 403 }
        )
      }

      // Generic error
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  /**
   * Get API documentation
   */
  getAPIDocumentation(): any {
    return {
      versions: this.apiVersions,
      endpoints: this.endpoints.map(endpoint => ({
        path: endpoint.path,
        methods: endpoint.methods,
        version: endpoint.version,
        rateLimit: {
          windowMs: endpoint.rateLimit.windowMs,
          maxRequests: endpoint.rateLimit.maxRequests
        },
        permissions: endpoint.permissions,
        deprecated: endpoint.deprecated
      }))
    }
  }
}

// Client-side API functions for the header component
export class HeaderAPI {
  private static async apiCall(endpoint: string, options?: RequestInit) {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }

    return response.json()
  }

  static async search(query: string, type?: string): Promise<SearchResult[]> {
    try {
      const params = new URLSearchParams({ q: query })
      if (type) params.append('type', type)

      return await this.apiCall(`/search?${params}`)
    } catch (error) {
      console.error('Search API error:', error)
      // Return empty results on error for graceful degradation
      return []
    }
  }

  static async getNotifications(): Promise<NotificationItem[]> {
    try {
      return await this.apiCall('/notifications')
    } catch (error) {
      console.error('Notifications API error:', error)
      return []
    }
  }

  static async markNotificationRead(id: string): Promise<void> {
    try {
      await this.apiCall(`/notifications/${id}/read`, { method: 'POST' })
    } catch (error) {
      console.error('Mark notification read error:', error)
    }
  }
}

// Export singleton instance
export const apiGateway = new APIGateway()