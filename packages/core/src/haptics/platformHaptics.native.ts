/**
 * React Native Haptic Implementation
 *
 * Uses expo-haptics for tactile feedback on iOS and Android.
 * Respects user preferences from settings store.
 */

import * as Haptics from 'expo-haptics';
import type { HapticService, HapticType } from './index';

// Dynamic import to avoid requiring store in web environment
let getSettings: (() => { hapticFeedback: boolean }) | null = null;

async function loadSettings() {
  if (!getSettings) {
    try {
      const { useAppStore } = await import('@multi-platform-app/store');
      getSettings = () => useAppStore.getState().settings;
    } catch {
      // Store not available, default to enabled
      getSettings = () => ({ hapticFeedback: true });
    }
  }
  return getSettings();
}

export class HapticServiceImpl implements HapticService {
  async trigger(type: HapticType): Promise<void> {
    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;

        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;

        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;

        case 'success':
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
          break;

        case 'error':
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error
          );
          break;

        case 'warning':
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning
          );
          break;

        default:
          // Default to medium impact
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      // Silently fail if haptics unavailable
      console.debug('Haptic feedback failed:', error);
    }
  }

  isAvailable(): boolean {
    // Haptics are available on React Native (iOS/Android)
    return true;
  }

  async isEnabled(): Promise<boolean> {
    const settings = await loadSettings();
    return settings.hapticFeedback ?? true; // Default to enabled
  }
}
