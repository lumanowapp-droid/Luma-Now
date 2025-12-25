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

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning';

/**
 * Haptic feedback service interface
 * Platform-specific implementations are loaded automatically
 */
export interface HapticService {
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
export async function haptic(type: HapticType): Promise<void> {
  const { HapticServiceImpl } = await import('./platformHaptics');
  const service = new HapticServiceImpl();

  if (!service.isAvailable()) {
    return; // Platform doesn't support haptics
  }

  const enabled = await service.isEnabled();
  if (!enabled) {
    return; // User has disabled haptics
  }

  await service.trigger(type);
}

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
export function useHaptic() {
  return async (type: HapticType) => {
    await haptic(type);
  };
}

/**
 * Haptic feedback patterns for common interactions
 */
export const HapticPatterns = {
  // Button interactions
  buttonPress: () => haptic('medium'),
  buttonLight: () => haptic('light'),

  // Task interactions
  taskComplete: () => haptic('success'),
  taskDelete: () => haptic('warning'),

  // Navigation
  swipe: () => haptic('light'),
  modalDismiss: () => haptic('medium'),

  // State changes
  toggleOn: () => haptic('light'),
  toggleOff: () => haptic('light'),

  // Feedback
  success: () => haptic('success'),
  error: () => haptic('error'),
  warning: () => haptic('warning'),
} as const;
