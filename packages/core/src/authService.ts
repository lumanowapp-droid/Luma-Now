import { User, AuthTokens, AuthSession } from '@multi-platform-app/types'

// Platform detection
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined'
const isReactNative = typeof navigator === 'undefined'

// Mock implementations - NEVER try to import mobile deps during SSR
const getKeychain = () => {
  // Only provide implementation on client-side web
  if (isWeb && typeof window !== 'undefined') {
    return {
      setInternetCredentials: async (service: string, username: string, password: string) => {
        localStorage.setItem(`${service}_${username}`, password)
      },
      getInternetCredentials: async (service: string) => {
        const password = localStorage.getItem(`${service}_keychain`)
        return password ? { username: 'web_user', password } : null
      },
      resetInternetCredentials: async (service: string) => {
        localStorage.removeItem(`${service}_keychain`)
      }
    }
  }
  
  // Server-side or React Native - return null (will be handled gracefully)
  return null
}

const getLocalAuth = () => {
  // Only provide implementation on client-side web
  if (isWeb && typeof window !== 'undefined') {
    return {
      hasHardwareAsync: async () => false,
      isEnrolledAsync: async () => false,
      authenticateAsync: async () => ({ success: false, error: 'Not supported on web' })
    }
  }
  
  // Server-side or React Native - return null (will be handled gracefully)
  return null
}

export class AuthService {
  private static instance: AuthService
  private keychain: any = null
  private localAuth: any = null

  private constructor() {
    this.keychain = getKeychain()
    this.localAuth = getLocalAuth()
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthSession> {
    try {
      // Simulate API call
      const response = await this.makeAuthRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      const { user, tokens } = response

      // Store tokens securely
      await this.storeTokens(tokens)

      // Create session
      const session: AuthSession = {
        user,
        tokens,
        isAuthenticated: true,
        lastActivity: new Date(),
      }

      return session
    } catch (error) {
      throw new Error(`Authentication failed: ${(error as Error).message}`)
    }
  }

  /**
   * Login with biometric authentication
   */
  async biometricLogin(): Promise<AuthSession> {
    if (!this.localAuth) {
      throw new Error('Biometric authentication not available')
    }

    try {
      // Check if biometric hardware is available
      const hasHardware = await this.localAuth.hasHardwareAsync()
      if (!hasHardware) {
        throw new Error('Biometric hardware not available')
      }

      // Check if biometric data is enrolled
      const isEnrolled = await this.localAuth.isEnrolledAsync()
      if (!isEnrolled) {
        throw new Error('No biometric data enrolled')
      }

      // Authenticate user
      const result = await this.localAuth.authenticateAsync({
        promptMessage: 'Authenticate to access the app',
        fallbackLabel: 'Use password',
        cancelLabel: 'Cancel',
      })

      if (!result.success) {
        throw new Error('Biometric authentication failed')
      }

      // Retrieve stored tokens
      const tokens = await this.getStoredTokens()
      if (!tokens) {
        throw new Error('No stored authentication data')
      }

      // Get user data
      const user = await this.getStoredUser()
      if (!user) {
        throw new Error('No stored user data')
      }

      // Create session
      const session: AuthSession = {
        user,
        tokens,
        isAuthenticated: true,
        lastActivity: new Date(),
      }

      return session
    } catch (error) {
      throw new Error(`Biometric login failed: ${(error as Error).message}`)
    }
  }

  /**
   * Setup biometric authentication
   */
  async setupBiometricAuth(): Promise<boolean> {
    if (!this.localAuth) {
      throw new Error('Biometric authentication not available')
    }

    try {
      // Check hardware availability
      const hasHardware = await this.localAuth.hasHardwareAsync()
      if (!hasHardware) {
        throw new Error('Biometric hardware not available')
      }

      // Enroll biometric data
      const result = await this.localAuth.authenticateAsync({
        promptMessage: 'Enable biometric authentication',
        fallbackLabel: 'Use password',
      })

      if (result.success) {
        // Store biometric setup flag
        await this.storeBiometricSetup(true)
        return true
      }

      return false
    } catch (error) {
      throw new Error(`Biometric setup failed: ${(error as Error).message}`)
    }
  }

  /**
   * Check if biometric authentication is available and enabled
   */
  async isBiometricAvailable(): Promise<boolean> {
    if (!this.localAuth) {
      return false
    }

    try {
      const hasHardware = await this.localAuth.hasHardwareAsync()
      const isEnrolled = await this.localAuth.isEnrolledAsync()
      const isSetup = await this.isBiometricSetup()

      return hasHardware && isEnrolled && isSetup
    } catch (error) {
      return false
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthTokens> {
    try {
      const currentTokens = await this.getStoredTokens()
      if (!currentTokens?.refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await this.makeAuthRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: currentTokens.refreshToken }),
      })

      const newTokens = response.tokens
      await this.storeTokens(newTokens)

      return newTokens
    } catch (error) {
      throw new Error(`Token refresh failed: ${(error as Error).message}`)
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Clear stored data
      await this.clearStoredData()
      
      // Notify server (optional)
      try {
        await this.makeAuthRequest('/auth/logout', { method: 'POST' })
      } catch (error) {
        // Continue logout even if server call fails
        console.warn('Server logout failed:', error)
      }
    } catch (error) {
      throw new Error(`Logout failed: ${(error as Error).message}`)
    }
  }

  /**
   * Get current authentication session
   */
  async getCurrentSession(): Promise<AuthSession | null> {
    try {
      const tokens = await this.getStoredTokens()
      const user = await this.getStoredUser()

      if (!tokens || !user) {
        return null
      }

      // Check if token is expired
      if (new Date() >= new Date(tokens.expiresAt)) {
        // Try to refresh token
        try {
          const newTokens = await this.refreshToken()
          return {
            user,
            tokens: newTokens,
            isAuthenticated: true,
            lastActivity: new Date(),
          }
        } catch (error) {
          // Token refresh failed, clear session
          await this.clearStoredData()
          return null
        }
      }

      return {
        user,
        tokens,
        isAuthenticated: true,
        lastActivity: new Date(),
      }
    } catch (error) {
      console.error('Failed to get current session:', error)
      return null
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession()
    return session !== null
  }

  // Private methods

  private async makeAuthRequest(endpoint: string, options: RequestInit): Promise<any> {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
    const url = `${baseUrl}${endpoint}`

    const response = await fetch(url, {
     ...options,
     headers: {
       'Content-Type': 'application/json',
       ...options.headers,
     },
   })

   if (!response.ok) {
     const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
     throw new Error(errorData.message || 'Authentication request failed')
   }

   return response.json()
  }

  private async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      if (this.keychain) {
        await this.keychain.setInternetCredentials(
          'auth_tokens',
          tokens.accessToken,
          tokens.refreshToken
        )
      } else {
        // Web fallback - use localStorage
        localStorage.setItem('auth_tokens', JSON.stringify(tokens))
      }
    } catch (error) {
      throw new Error(`Failed to store tokens: ${(error as Error).message}`)
    }
  }

  private async getStoredTokens(): Promise<AuthTokens | null> {
    try {
      if (this.keychain) {
        const credentials = await this.keychain.getInternetCredentials('auth_tokens')
        if (credentials) {
          return {
            accessToken: credentials.username,
            refreshToken: credentials.password,
            expiresAt: new Date(Date.now() + 3600000), // 1 hour
            tokenType: 'Bearer',
          }
        }
      } else {
        // Web fallback
        const stored = localStorage.getItem('auth_tokens')
        if (stored) {
          return JSON.parse(stored)
        }
      }
    } catch (error) {
      console.error('Failed to retrieve tokens:', error)
    }
    return null
  }

  private async storeUser(user: User): Promise<void> {
    try {
      if (this.keychain) {
        await this.keychain.setInternetCredentials('user_data', user.id, JSON.stringify(user))
      } else {
        // Web fallback
        localStorage.setItem('user_data', JSON.stringify(user))
      }
    } catch (error) {
      throw new Error(`Failed to store user data: ${(error as Error).message}`)
    }
  }

  private async getStoredUser(): Promise<User | null> {
    try {
      if (this.keychain) {
        const credentials = await this.keychain.getInternetCredentials('user_data')
        if (credentials) {
          return JSON.parse(credentials.password)
        }
      } else {
        // Web fallback
        const stored = localStorage.getItem('user_data')
        if (stored) {
          return JSON.parse(stored)
        }
      }
    } catch (error) {
      console.error('Failed to retrieve user data:', error)
    }
    return null
  }

  private async storeBiometricSetup(enabled: boolean): Promise<void> {
    try {
      if (this.keychain) {
        await this.keychain.setInternetCredentials('biometric_setup', 'enabled', enabled.toString())
      } else {
        // Web fallback
        localStorage.setItem('biometric_setup', enabled.toString())
      }
    } catch (error) {
      console.error('Failed to store biometric setup:', error)
    }
  }

  private async isBiometricSetup(): Promise<boolean> {
    try {
      if (this.keychain) {
        const credentials = await this.keychain.getInternetCredentials('biometric_setup')
        return credentials && credentials.password === 'true'
      } else {
        // Web fallback
        return localStorage.getItem('biometric_setup') === 'true'
      }
    } catch (error) {
      console.error('Failed to check biometric setup:', error)
      return false
    }
  }

  private async clearStoredData(): Promise<void> {
    try {
      if (this.keychain) {
        await this.keychain.resetInternetCredentials('auth_tokens')
        await this.keychain.resetInternetCredentials('user_data')
        await this.keychain.resetInternetCredentials('biometric_setup')
      } else {
        // Web fallback
        localStorage.removeItem('auth_tokens')
        localStorage.removeItem('user_data')
        localStorage.removeItem('biometric_setup')
      }
    } catch (error) {
      console.error('Failed to clear stored data:', error)
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance()