// Test configuration and utilities
export const TEST_CONFIG = {
  supabase: {
    url: process.env.TEST_SUPABASE_URL || 'http://localhost:54321',
    anonKey: process.env.TEST_SUPABASE_ANON_KEY || 'test-anon-key',
    serviceKey: process.env.TEST_SUPABASE_SERVICE_KEY || 'test-service-key'
  },
  testTenant: {
    id: 'test-tenant-123',
    name: 'Test Tenant',
    slug: 'test-tenant'
  },
  testUser: {
    id: 'test-user-123',
    email: 'test@example.com',
    password: 'test-password-123'
  }
}

// Test utilities
export class TestHelpers {
  static async waitFor(condition: () => boolean, timeout = 5000): Promise<void> {
    const start = Date.now()
    while (!condition() && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    
    if (!condition()) {
      throw new Error('Condition not met within timeout')
    }
  }

  static generateTestData(count: number): any[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `test-${i}`,
      name: `Test Item ${i}`,
      value: i * 10,
      created_at: new Date().toISOString()
    }))
  }

  static createMockResponse() {
    return {
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      json: async () => ({}),
      text: async () => '',
      ok: true
    }
  }

  static createAuthenticatedRequest(
    path: string = '/api/test',
    method: string = 'GET',
    token?: string,
    body?: any
  ): Request {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Test-Agent/1.0'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return new Request(`http://localhost${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    })
  }
}