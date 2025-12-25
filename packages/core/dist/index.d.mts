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

declare class AuthService {
    private static instance;
    private keychain;
    private localAuth;
    private constructor();
    static getInstance(): AuthService;
    /**
     * Login with email and password
     */
    login(email: string, password: string): Promise<AuthSession>;
    /**
     * Login with biometric authentication
     */
    biometricLogin(): Promise<AuthSession>;
    /**
     * Setup biometric authentication
     */
    setupBiometricAuth(): Promise<boolean>;
    /**
     * Check if biometric authentication is available and enabled
     */
    isBiometricAvailable(): Promise<boolean>;
    /**
     * Refresh authentication token
     */
    refreshToken(): Promise<AuthTokens>;
    /**
     * Logout user
     */
    logout(): Promise<void>;
    /**
     * Get current authentication session
     */
    getCurrentSession(): Promise<AuthSession | null>;
    /**
     * Check if user is authenticated
     */
    isAuthenticated(): Promise<boolean>;
    private makeAuthRequest;
    private storeTokens;
    private getStoredTokens;
    private storeUser;
    private getStoredUser;
    private storeBiometricSetup;
    private isBiometricSetup;
    private clearStoredData;
}
declare const authService: AuthService;

/**
 * Haptic Feedback System
 *
 * Platform-agnostic haptic feedback service that provides tactile feedback
 * for user interactions. Respects user preferences and gracefully degrades
 * on platforms that don't support haptics (web).
 *
 * ADHD-Critical: Haptic feedback provides visceral confirmation without
 * demanding visual attention, reducing cognitive load.
 */
type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning';
/**
 * Haptic feedback service interface
 * Platform-specific implementations are loaded automatically
 */
interface HapticService {
    /**
     * Trigger haptic feedback
     * @param type - Type of haptic feedback to trigger
     * @returns Promise that resolves when haptic completes
     */
    trigger(type: HapticType): Promise<void>;
    /**
     * Check if haptics are available on this platform
     * @returns true if haptics are supported
     */
    isAvailable(): boolean;
    /**
     * Check if haptics are enabled in user settings
     * @returns Promise that resolves to true if haptics are enabled
     */
    isEnabled(): boolean | Promise<boolean>;
}
/**
 * Haptic feedback trigger function
 * Automatically checks availability and user preferences
 *
 * @example
 * ```typescript
 * // In a button press handler
 * await haptic('medium');
 *
 * // In task completion
 * await haptic('success');
 *
 * // In error state
 * await haptic('error');
 * ```
 */
declare function haptic(type: HapticType): Promise<void>;
/**
 * Hook for haptic feedback in components
 * Returns a memoized trigger function
 *
 * @example
 * ```typescript
 * function MyButton() {
 *   const triggerHaptic = useHaptic();
 *
 *   const handlePress = async () => {
 *     await triggerHaptic('medium');
 *     // ... rest of handler
 *   };
 * }
 * ```
 */
declare function useHaptic(): (type: HapticType) => Promise<void>;
/**
 * Haptic feedback patterns for common interactions
 */
declare const HapticPatterns: {
    readonly buttonPress: () => Promise<void>;
    readonly buttonLight: () => Promise<void>;
    readonly taskComplete: () => Promise<void>;
    readonly taskDelete: () => Promise<void>;
    readonly swipe: () => Promise<void>;
    readonly modalDismiss: () => Promise<void>;
    readonly toggleOn: () => Promise<void>;
    readonly toggleOff: () => Promise<void>;
    readonly success: () => Promise<void>;
    readonly error: () => Promise<void>;
    readonly warning: () => Promise<void>;
};

/**
 * Voice Input System
 *
 * Platform-agnostic voice recording and transcription service.
 * Uses native device microphone for recording and AI transcription.
 *
 * ADHD-Critical: Voice removes typing friction at moments of overwhelm.
 * Speak thoughts faster than typing them.
 */
type VoiceState = 'idle' | 'recording' | 'processing' | 'error';
interface VoiceRecording {
    uri: string;
    duration: number;
    mimeType: string;
}
interface TranscriptionResult {
    text: string;
    confidence?: number;
    language?: string;
}
interface VoiceError {
    code: 'PERMISSION_DENIED' | 'RECORDING_FAILED' | 'TRANSCRIPTION_FAILED' | 'UNKNOWN';
    message: string;
}
/**
 * Voice input service interface
 * Platform-specific implementations loaded automatically
 */
interface VoiceService {
    /**
     * Request microphone permissions
     * @returns Promise that resolves to true if granted
     */
    requestPermissions(): Promise<boolean>;
    /**
     * Start recording audio
     * @returns Promise that resolves when recording starts
     */
    startRecording(): Promise<void>;
    /**
     * Stop recording audio
     * @returns Promise that resolves with recording info
     */
    stopRecording(): Promise<VoiceRecording>;
    /**
     * Transcribe audio to text
     * @param recording - Recording to transcribe
     * @returns Promise that resolves with transcription
     */
    transcribe(recording: VoiceRecording): Promise<TranscriptionResult>;
    /**
     * Check if microphone is available
     * @returns true if microphone is available
     */
    isAvailable(): boolean;
    /**
     * Check if voice input is enabled in settings
     * @returns true if enabled
     */
    isEnabled(): boolean | Promise<boolean>;
}
/**
 * Hold-to-record voice input hook
 * Manages recording state and lifecycle
 *
 * @example
 * ```typescript
 * function VoiceButton() {
 *   const { state, startRecording, stopRecording, text, error } = useVoiceInput();
 *
 *   return (
 *     <Pressable
 *       onPressIn={startRecording}
 *       onPressOut={stopRecording}
 *     >
 *       <Icon name={state === 'recording' ? 'mic.fill' : 'mic'} />
 *     </Pressable>
 *   );
 * }
 * ```
 */
declare function useVoiceInput(): {
    state: VoiceState;
    text: string;
    error: VoiceError | null;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<void>;
    reset: () => void;
};

/**
 * Web Haptic Implementation
 *
 * Graceful degradation for web platform - no-op implementation
 * since haptics are not available in web browsers.
 */

declare class HapticServiceImpl implements HapticService {
    trigger(type: HapticType): Promise<void>;
    isAvailable(): boolean;
    isEnabled(): boolean;
}

export { AuthService, HapticPatterns, HapticServiceImpl as HapticService, type HapticType, type TranscriptionResult, type VoiceError, type VoiceRecording, type VoiceService, type VoiceState, authService, haptic, useHaptic, useVoiceInput };
