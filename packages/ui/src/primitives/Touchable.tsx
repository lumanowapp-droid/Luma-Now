/**
 * Touchable Primitive Component
 * Universal pressable with haptic feedback
 *
 * Features:
 * - 44pt minimum tap target (iOS HIG)
 * - Press states (subtle opacity change)
 * - Accessibility labels
 * - Optional haptic feedback
 * - Platform-aware interactions
 */

import React from 'react';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error';

export interface TouchableProps {
  children: React.ReactNode;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  hapticFeedback?: HapticType | false;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'checkbox' | 'radio';
  style?: any;
  testID?: string;
  activeOpacity?: number;
}

/**
 * Minimum tap target size (iOS HIG: 44x44pt)
 */
export const MIN_TAP_TARGET = 44;

/**
 * Default active opacity for press states
 */
export const DEFAULT_ACTIVE_OPACITY = 0.7;

/**
 * Base touchable component with shared logic
 * Platform-specific implementations are in Touchable.web.tsx and Touchable.native.tsx
 */
export const getTouchableBaseProps = (props: TouchableProps) => {
  const {
    disabled = false,
    activeOpacity = DEFAULT_ACTIVE_OPACITY,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'button',
    testID,
  } = props;

  return {
    disabled,
    activeOpacity,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole,
    testID,
  };
};

// Platform detection
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

// Import platform-specific implementations
let WebTouchable: React.ComponentType<TouchableProps>;

if (isWeb) {
  WebTouchable = require('./Touchable.web').Touchable;
}

/**
 * Cross-platform Touchable component
 */
export const Touchable: React.FC<TouchableProps> = (props) => {
  return <WebTouchable {...props} />;
};
