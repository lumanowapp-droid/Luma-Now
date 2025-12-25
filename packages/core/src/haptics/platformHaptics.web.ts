/**
 * Web Haptic Implementation
 *
 * Graceful degradation for web platform - no-op implementation
 * since haptics are not available in web browsers.
 */

import type { HapticService, HapticType } from './index';

export class HapticServiceImpl implements HapticService {
  async trigger(type: HapticType): Promise<void> {
    // No-op on web - haptics not available
    return Promise.resolve();
  }

  isAvailable(): boolean {
    // Haptics are not available on web
    return false;
  }

  isEnabled(): boolean {
    // Not applicable on web
    return false;
  }
}
