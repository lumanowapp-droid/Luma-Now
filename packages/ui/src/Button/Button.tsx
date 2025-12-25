/**
 * Button Component - Enhanced
 * Aligned with ADHD-friendly design principles
 *
 * Features:
 * - Variants: Primary, Secondary, Ghost
 * - Loading state with haptic feedback
 * - Disabled state (clear but not harsh)
 * - Minimal tap target (44pt)
 * - Calm press states
 */

import React from 'react';
import { getButtonStyles, ButtonVariant, ButtonSize } from './styles';

export type { ButtonVariant, ButtonSize } from './styles';
export { getButtonStyles };

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  style?: any;
}

// Platform detection
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

// Import platform-specific implementations
let WebButton: React.ComponentType<ButtonProps>;
let NativeButton: React.ComponentType<ButtonProps>;

if (isWeb) {
  WebButton = require('./Button.web').Button;
} else {
  NativeButton = require('./Button.native').Button;
}

/**
 * Cross-platform Button component
 */
export const Button: React.FC<ButtonProps> = (props) => {
  if (isWeb) {
    return <WebButton {...props} />;
  }
  return <NativeButton {...props} />;
};
