/**
 * Toggle Primitive Component
 * Switch component with haptic feedback
 *
 * Features:
 * - Haptic feedback on toggle (mobile)
 * - Accessibility support
 * - Smooth animation
 * - Platform-specific styling
 */

import React from 'react';
import { semanticColors, baseColors } from '../tokens/colors';

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  hapticFeedback?: boolean;
  testID?: string;
}

/**
 * Get toggle track styles
 */
export const getToggleTrackStyles = (
  value: boolean,
  disabled: boolean = false
) => {
  const getBackgroundColor = () => {
    if (disabled) return baseColors.surfaceDisabled;
    if (value) return semanticColors.success;
    return baseColors.border;
  };

  return {
    width: 51,
    height: 31,
    borderRadius: 31 / 2,
    backgroundColor: getBackgroundColor(),
    opacity: disabled ? 0.5 : 1,
  };
};

/**
 * Get toggle thumb styles
 */
export const getToggleThumbStyles = (value: boolean) => {
  return {
    width: 27,
    height: 27,
    borderRadius: 27 / 2,
    backgroundColor: baseColors.surface,
  };
};

// Platform detection
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

// Import platform-specific implementations
let WebToggle: React.ComponentType<ToggleProps>;

if (isWeb) {
  WebToggle = require('./Toggle.web').Toggle;
}

/**
 * Cross-platform Toggle component
 */
export const Toggle: React.FC<ToggleProps> = (props) => {
  return <WebToggle {...props} />;
};
