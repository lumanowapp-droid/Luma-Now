// Core platform types
export interface PlatformInfo {
  OS: 'ios' | 'android' | 'web'
  isPad: boolean
  isTV: boolean
  isTablet: boolean
  version: string
  model?: string
  manufacturer?: string
}

// User and Authentication types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'admin' | 'user' | 'guest'

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  biometricEnabled: boolean
  offlineMode: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: Date
  tokenType: 'Bearer'
}

export interface AuthSession {
  user: User
  tokens: AuthTokens
  isAuthenticated: boolean
  lastActivity: Date
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined
  Main: undefined
  Profile: undefined
  Settings: undefined
  NotFound: undefined
}

export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  BiometricSetup: undefined
}

export type MainTabParamList = {
  Dashboard: undefined
  Profile: undefined
  Settings: undefined
  Notifications: undefined
}

export interface NavigationState {
  currentRoute: string
  previousRoute?: string
  params?: Record<string, any>
}

// API types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  timestamp: string
  requestId?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
  requestId?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox'
  placeholder?: string
  required?: boolean
  validation?: ValidationRule[]
  options?: SelectOption[]
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: any
  message: string
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

// UI Component types
export interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  icon?: string
  fullWidth?: boolean
}

export interface InputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  label?: string
  error?: string
  type?: 'text' | 'email' | 'password' | 'number'
  required?: boolean
  disabled?: boolean
  multiline?: boolean
  numberOfLines?: number
  icon?: string
}

export interface ModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  animation?: 'slide' | 'fade' | 'none'
}

// Offline types
export interface OfflineAction {
  id: string
  type: string
  payload: any
  timestamp: number
  retryCount: number
  status: 'pending' | 'syncing' | 'completed' | 'failed'
}

export interface SyncConflict {
  id: string
  localData: any
  remoteData: any
  strategy: 'local' | 'remote' | 'merge' | 'manual'
  resolved: boolean
  timestamp: number
}

export interface OfflineQueue {
  actions: OfflineAction[]
  conflicts: SyncConflict[]
  lastSync: Date
  isOnline: boolean
}

// Analytics types
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  userId?: string
  timestamp: Date
  sessionId?: string
}

export interface UserProperty {
  key: string
  value: string | number | boolean
}

// Theme types
export interface Theme {
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    error: string
    warning: string
    success: string
    info: string
  }
  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xxl: number
  }
  typography: {
    fontSize: {
      xs: number
      sm: number
      md: number
      lg: number
      xl: number
      xxl: number
    }
    fontWeight: {
      light: string
      regular: string
      medium: string
      semibold: string
      bold: string
    }
  }
  borderRadius: {
    sm: number
    md: number
    lg: number
    xl: number
  }
  shadows: {
    sm: string
    md: string
    lg: string
  }
}

// Feature flags types
export interface FeatureFlag {
  key: string
  enabled: boolean
  rolloutPercentage?: number
  conditions?: FeatureCondition[]
  variants?: FeatureVariant[]
}

export interface FeatureCondition {
  type: 'user_property' | 'platform' | 'app_version'
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: any
}

export interface FeatureVariant {
  name: string
  weight: number
  payload?: any
}

// Notification types
export interface PushNotification {
  id: string
  title: string
  body: string
  data?: Record<string, any>
  imageUrl?: string
  category?: string
  priority: 'low' | 'normal' | 'high'
  scheduledAt?: Date
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
  stack?: string
  timestamp: Date
  userId?: string
  sessionId?: string
}

// Internationalization types
export interface TranslationKey {
  key: string
  defaultValue: string
  description?: string
  namespace?: string
}

export interface Locale {
  code: string
  name: string
  direction: 'ltr' | 'rtl'
  currency: string
  dateFormat: string
  timeFormat: string
}

// Accessibility types
export interface AccessibilityOptions {
  screenReaderEnabled: boolean
  reduceMotion: boolean
  highContrast: boolean
  largeText: boolean
  boldText: boolean
}

// Deep linking types
export interface DeepLink {
  url: string
  scheme: string
  host: string
  path: string
  params: Record<string, string>
}

// Environment types
export interface EnvironmentConfig {
  apiUrl: string
  websocketUrl: string
  sentryDsn?: string
  firebaseConfig?: {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
  }
  featureFlags: Record<string, boolean>
  analytics: {
    googleAnalyticsId?: string
    mixpanelToken?: string
  }
}

// Performance types
export interface PerformanceMetrics {
  renderTime: number
  memoryUsage: number
  batteryLevel?: number
  networkType: 'wifi' | 'cellular' | 'unknown'
  networkSpeed?: 'slow' | 'fast'
  deviceInfo: PlatformInfo
}

// Component props types
export interface BaseComponentProps {
  testID?: string
  accessibilityLabel?: string
  accessibilityHint?: string
  accessibilityRole?: string
  style?: any
  children?: React.ReactNode
}

// Export utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type AsyncResult<T, E = Error> = {
  loading: boolean
  data: T | null
  error: E | null
}

export type AsyncAction<T extends any[], R> = (...args: T) => Promise<R>

// React Native specific types
export interface Dimensions {
  width: number
  height: number
}

export interface ScreenInfo {
  width: number
  height: number
  scale: number
  fontScale: number
  isLandscape: boolean
  isPortrait: boolean
}

// Web specific types
export interface WindowInfo {
  width: number
  height: number
  innerWidth: number
  innerHeight: number
  devicePixelRatio: number
  userAgent: string
  isOnline: boolean
}

// Cross-platform utilities
export type PlatformSpecific<TWeb, TMobile> = TWeb | TMobile

export type ResponsiveValue<T> = {
  base?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}

export type StyleSheetType = Record<string, any>

// Event types
export interface TouchEvent {
  touches: Array<{
    identifier: number
    pageX: number
    pageY: number
  }>
  changedTouches: Array<{
    identifier: number
    pageX: number
    pageY: number
  }>
}

// Network types
export interface NetworkInfo {
  type: 'wifi' | 'cellular' | 'ethernet' | 'bluetooth' | 'vpn' | 'unknown'
  isConnected: boolean
  isInternetReachable: boolean
  strength?: number
}

// Storage types
export interface StorageItem {
  key: string
  value: any
  expiresAt?: Date
  encrypted: boolean
}

export interface SecureStorageOptions {
  keychainService?: string
  keychainAccessGroup?: string
  touchID: boolean
  showModal: boolean
  fallbackLabel?: string
}

// ===================================
// ADHD-SPECIFIC TYPES (Luma Now)
// ===================================

/**
 * AI Provider Types
 * Supported AI providers for premium features
 */
export type AIProvider = 'cloudflare' | 'anthropic' | 'openai'

/**
 * Task Category Types
 * ADHD-friendly color coding for task types
 */
export type TaskCategory = 'work' | 'personal' | 'care' | 'urgent'

/**
 * Capacity Levels
 * User-selected energy capacity for the day
 */
export type CapacityLevel = 'light' | 'medium' | 'full'

/**
 * Capacity Configuration
 * Maps capacity levels to max task counts
 */
export interface CapacityConfig {
  light: number   // 3 tasks
  medium: number  // 5 tasks
  full: number    // 7 tasks
}

/**
 * Task Interface
 * Represents a single task with ADHD-friendly properties
 */
export interface Task {
  id: string
  title: string
  category: TaskCategory
  duration?: number  // In minutes (optional, capacity-based)
  completed: boolean
  createdAt: Date
  completedAt?: Date
  order: number      // For timeline ordering
}

/**
 * Accessibility Preferences
 * System and user-controlled accessibility settings
 */
export interface AccessibilityPreferences {
  reducedMotion: boolean      // System: prefers-reduced-motion
  highContrast: boolean        // System: prefers-contrast
  fontSize: 'small' | 'medium' | 'large'  // User setting
  hapticFeedback: boolean      // Mobile only
  voiceInput: boolean          // Mobile only
}

/**
 * Motion Preference
 * Return type for motion detection hooks
 */
export interface MotionPreference {
  prefersReducedMotion: boolean
  shouldAnimate: boolean
}

/**
 * Enhanced Theme Interface (extending existing)
 * Adds ADHD-specific design tokens
 */
export interface ADHDTheme extends Theme {
  categoryColors: {
    workBlue: string
    personalGreen: string
    carePurple: string
    urgencyAmber: string
  }
  motion: {
    duration: {
      instant: number
      fast: number
      normal: number
      slow: number
      verySlow: number
    }
    easing: {
      calm: number[]
      gentle: number[]
      linear: number[]
    }
  }
}

/**
 * User Settings (Luma Now specific)
 * Extends UserPreferences with ADHD-specific settings
 */
export interface LumaUserSettings {
  defaultCapacity: CapacityLevel
  theme: 'light' | 'dark' | 'system'
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  hapticFeedback: boolean
  voiceInput: boolean
  gentleNudges: boolean
  dailyReflection: boolean
  hasCompletedOnboarding: boolean
  aiProvider: AIProvider
}