interface PlatformInfo {
    OS: 'ios' | 'android' | 'web';
    isPad: boolean;
    isTV: boolean;
    isTablet: boolean;
    version: string;
    model?: string;
    manufacturer?: string;
}
interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: UserRole;
    preferences: UserPreferences;
    createdAt: Date;
    updatedAt: Date;
}
type UserRole = 'admin' | 'user' | 'guest';
interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    biometricEnabled: boolean;
    offlineMode: boolean;
}
interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    tokenType: 'Bearer';
}
interface AuthSession {
    user: User;
    tokens: AuthTokens;
    isAuthenticated: boolean;
    lastActivity: Date;
}
type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    Profile: undefined;
    Settings: undefined;
    NotFound: undefined;
};
type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    BiometricSetup: undefined;
};
type MainTabParamList = {
    Dashboard: undefined;
    Profile: undefined;
    Settings: undefined;
    Notifications: undefined;
};
interface NavigationState {
    currentRoute: string;
    previousRoute?: string;
    params?: Record<string, any>;
}
interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
    timestamp: string;
    requestId?: string;
}
interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId?: string;
}
interface PaginatedResponse<T = any> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
    placeholder?: string;
    required?: boolean;
    validation?: ValidationRule[];
    options?: SelectOption[];
}
interface ValidationRule {
    type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
    value?: any;
    message: string;
}
interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}
interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    fullWidth?: boolean;
}
interface InputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    type?: 'text' | 'email' | 'password' | 'number';
    required?: boolean;
    disabled?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    icon?: string;
}
interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large' | 'fullscreen';
    animation?: 'slide' | 'fade' | 'none';
}
interface OfflineAction {
    id: string;
    type: string;
    payload: any;
    timestamp: number;
    retryCount: number;
    status: 'pending' | 'syncing' | 'completed' | 'failed';
}
interface SyncConflict {
    id: string;
    localData: any;
    remoteData: any;
    strategy: 'local' | 'remote' | 'merge' | 'manual';
    resolved: boolean;
    timestamp: number;
}
interface OfflineQueue {
    actions: OfflineAction[];
    conflicts: SyncConflict[];
    lastSync: Date;
    isOnline: boolean;
}
interface AnalyticsEvent {
    name: string;
    properties?: Record<string, any>;
    userId?: string;
    timestamp: Date;
    sessionId?: string;
}
interface UserProperty {
    key: string;
    value: string | number | boolean;
}
interface Theme {
    colors: {
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        error: string;
        warning: string;
        success: string;
        info: string;
    };
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    typography: {
        fontSize: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
            xxl: number;
        };
        fontWeight: {
            light: string;
            regular: string;
            medium: string;
            semibold: string;
            bold: string;
        };
    };
    borderRadius: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
    shadows: {
        sm: string;
        md: string;
        lg: string;
    };
}
interface FeatureFlag {
    key: string;
    enabled: boolean;
    rolloutPercentage?: number;
    conditions?: FeatureCondition[];
    variants?: FeatureVariant[];
}
interface FeatureCondition {
    type: 'user_property' | 'platform' | 'app_version';
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
}
interface FeatureVariant {
    name: string;
    weight: number;
    payload?: any;
}
interface PushNotification {
    id: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    imageUrl?: string;
    category?: string;
    priority: 'low' | 'normal' | 'high';
    scheduledAt?: Date;
}
interface AppError {
    code: string;
    message: string;
    details?: Record<string, any>;
    stack?: string;
    timestamp: Date;
    userId?: string;
    sessionId?: string;
}
interface TranslationKey {
    key: string;
    defaultValue: string;
    description?: string;
    namespace?: string;
}
interface Locale {
    code: string;
    name: string;
    direction: 'ltr' | 'rtl';
    currency: string;
    dateFormat: string;
    timeFormat: string;
}
interface AccessibilityOptions {
    screenReaderEnabled: boolean;
    reduceMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    boldText: boolean;
}
interface DeepLink {
    url: string;
    scheme: string;
    host: string;
    path: string;
    params: Record<string, string>;
}
interface EnvironmentConfig {
    apiUrl: string;
    websocketUrl: string;
    sentryDsn?: string;
    firebaseConfig?: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
    };
    featureFlags: Record<string, boolean>;
    analytics: {
        googleAnalyticsId?: string;
        mixpanelToken?: string;
    };
}
interface PerformanceMetrics {
    renderTime: number;
    memoryUsage: number;
    batteryLevel?: number;
    networkType: 'wifi' | 'cellular' | 'unknown';
    networkSpeed?: 'slow' | 'fast';
    deviceInfo: PlatformInfo;
}
interface BaseComponentProps {
    testID?: string;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    accessibilityRole?: string;
    style?: any;
    children?: React.ReactNode;
}
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type AsyncResult<T, E = Error> = {
    loading: boolean;
    data: T | null;
    error: E | null;
};
type AsyncAction<T extends any[], R> = (...args: T) => Promise<R>;
interface Dimensions {
    width: number;
    height: number;
}
interface ScreenInfo {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
    isLandscape: boolean;
    isPortrait: boolean;
}
interface WindowInfo {
    width: number;
    height: number;
    innerWidth: number;
    innerHeight: number;
    devicePixelRatio: number;
    userAgent: string;
    isOnline: boolean;
}
type PlatformSpecific<TWeb, TMobile> = TWeb | TMobile;
type ResponsiveValue<T> = {
    base?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
};
type StyleSheetType = Record<string, any>;
interface TouchEvent {
    touches: Array<{
        identifier: number;
        pageX: number;
        pageY: number;
    }>;
    changedTouches: Array<{
        identifier: number;
        pageX: number;
        pageY: number;
    }>;
}
interface NetworkInfo {
    type: 'wifi' | 'cellular' | 'ethernet' | 'bluetooth' | 'vpn' | 'unknown';
    isConnected: boolean;
    isInternetReachable: boolean;
    strength?: number;
}
interface StorageItem {
    key: string;
    value: any;
    expiresAt?: Date;
    encrypted: boolean;
}
interface SecureStorageOptions {
    keychainService?: string;
    keychainAccessGroup?: string;
    touchID: boolean;
    showModal: boolean;
    fallbackLabel?: string;
}
/**
 * AI Provider Types
 * Supported AI providers for premium features
 */
type AIProvider = 'cloudflare' | 'anthropic' | 'openai';
/**
 * Task Category Types
 * ADHD-friendly color coding for task types
 */
type TaskCategory = 'work' | 'personal' | 'care' | 'urgent';
/**
 * Capacity Levels
 * User-selected energy capacity for the day
 */
type CapacityLevel = 'light' | 'medium' | 'full';
/**
 * Capacity Configuration
 * Maps capacity levels to max task counts
 */
interface CapacityConfig {
    light: number;
    medium: number;
    full: number;
}
/**
 * Task Interface
 * Represents a single task with ADHD-friendly properties
 */
interface Task {
    id: string;
    title: string;
    category: TaskCategory;
    duration?: number;
    completed: boolean;
    createdAt: Date;
    completedAt?: Date;
    order: number;
}
/**
 * Accessibility Preferences
 * System and user-controlled accessibility settings
 */
interface AccessibilityPreferences {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    hapticFeedback: boolean;
    voiceInput: boolean;
}
/**
 * Motion Preference
 * Return type for motion detection hooks
 */
interface MotionPreference {
    prefersReducedMotion: boolean;
    shouldAnimate: boolean;
}
/**
 * Enhanced Theme Interface (extending existing)
 * Adds ADHD-specific design tokens
 */
interface ADHDTheme extends Theme {
    categoryColors: {
        workBlue: string;
        personalGreen: string;
        carePurple: string;
        urgencyAmber: string;
    };
    motion: {
        duration: {
            instant: number;
            fast: number;
            normal: number;
            slow: number;
            verySlow: number;
        };
        easing: {
            calm: number[];
            gentle: number[];
            linear: number[];
        };
    };
}
/**
 * User Settings (Luma Now specific)
 * Extends UserPreferences with ADHD-specific settings
 */
interface LumaUserSettings {
    defaultCapacity: CapacityLevel;
    theme: 'light' | 'dark' | 'system';
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    hapticFeedback: boolean;
    voiceInput: boolean;
    gentleNudges: boolean;
    dailyReflection: boolean;
    hasCompletedOnboarding: boolean;
    aiProvider: AIProvider;
}

export type { ADHDTheme, AIProvider, AccessibilityOptions, AccessibilityPreferences, AnalyticsEvent, ApiError, ApiResponse, AppError, AsyncAction, AsyncResult, AuthSession, AuthStackParamList, AuthTokens, BaseComponentProps, ButtonProps, CapacityConfig, CapacityLevel, DeepLink, DeepPartial, Dimensions, EnvironmentConfig, FeatureCondition, FeatureFlag, FeatureVariant, FormField, InputProps, Locale, LumaUserSettings, MainTabParamList, ModalProps, MotionPreference, NavigationState, NetworkInfo, OfflineAction, OfflineQueue, OptionalFields, PaginatedResponse, PerformanceMetrics, PlatformInfo, PlatformSpecific, PushNotification, RequiredFields, ResponsiveValue, RootStackParamList, ScreenInfo, SecureStorageOptions, SelectOption, StorageItem, StyleSheetType, SyncConflict, Task, TaskCategory, Theme, TouchEvent, TranslationKey, User, UserPreferences, UserProperty, UserRole, ValidationRule, WindowInfo };
