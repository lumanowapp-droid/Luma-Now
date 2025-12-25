/**
 * TextField Primitive Component
 * Auto-growing multiline input with calm focus states
 *
 * Features:
 * - Auto-growing multiline input
 * - Calm focus states (no aggressive borders)
 * - Optional character count (neutral tone)
 * - Platform-aware keyboard
 * - ADHD-friendly design (clear, minimal stress)
 */

import React from 'react';
import { fontSizes, getPlatformFont } from '../tokens/typography';
import { baseColors, semanticColors } from '../tokens/colors';
import { spacing, borderRadius } from '../tokens/spacing';
import { focusRing } from '../tokens/shadows';

export interface TextFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  autoGrow?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  disabled?: boolean;
  error?: string;
  label?: string;
  autoFocus?: boolean;
  testID?: string;
  style?: any;
}

/**
 * Get base text field styles
 */
export const getTextFieldStyles = (
  disabled: boolean = false,
  hasError: boolean = false
) => {
  return {
    fontFamily: getPlatformFont(),
    fontSize: fontSizes.body.fontSize,
    lineHeight: fontSizes.body.lineHeight,
    color: disabled ? baseColors.textMuted : baseColors.textPrimary,
    backgroundColor: disabled ? baseColors.surfaceDisabled : baseColors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: hasError
      ? semanticColors.error
      : baseColors.border,
    minHeight: 120,
  };
};

// Platform detection
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

// Import platform-specific implementations
let WebTextField: React.ComponentType<TextFieldProps>;

if (isWeb) {
  WebTextField = require('./TextField.web').TextField;
}

/**
 * Cross-platform TextField component
 */
export const TextField: React.FC<TextFieldProps> = (props) => {
  return <WebTextField {...props} />;
};
