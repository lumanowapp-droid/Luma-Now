/**
 * Text Primitive Component
 * Semantic typography with platform-aware font loading
 *
 * Features:
 * - Semantic variants: Display, Heading, Body, Label, Caption
 * - Automatic color inheritance
 * - Platform-aware font loading
 * - ADHD-friendly readability
 */

import React from 'react';
import { fontSizes, fontWeights, getPlatformFont } from '../tokens/typography';
import { baseColors } from '../tokens/colors';

export type TextVariant = 'h1' | 'h2' | 'body' | 'bodySmall' | 'labels' | 'display' | 'heading' | 'label' | 'caption';

export interface TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  color?: string;
  weight?: keyof typeof fontWeights;
  align?: 'left' | 'center' | 'right';
  style?: any;
  numberOfLines?: number;
  selectable?: boolean;
  testID?: string;
}

/**
 * Get variant-specific styles
 */
export const getVariantStyles = (variant: TextVariant) => {
  const styles = {
    h1: {
      fontSize: fontSizes.h1.fontSize,
      lineHeight: fontSizes.h1.lineHeight,
      fontWeight: fontWeights.bold,
      letterSpacing: 0,
    },
    h2: {
      fontSize: fontSizes.h2.fontSize,
      lineHeight: fontSizes.h2.lineHeight,
      fontWeight: fontWeights.semibold,
      letterSpacing: 0,
    },
    body: {
      fontSize: fontSizes.body.fontSize,
      lineHeight: fontSizes.body.lineHeight,
      fontWeight: fontWeights.normal,
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: fontSizes.bodySmall.fontSize,
      lineHeight: fontSizes.bodySmall.lineHeight,
      fontWeight: fontWeights.normal,
      letterSpacing: 0,
    },
    labels: {
      fontSize: fontSizes.labels.fontSize,
      lineHeight: fontSizes.labels.lineHeight,
      fontWeight: fontWeights.semibold,
      letterSpacing: 0,
    },
    // Legacy support
    display: {
      fontSize: fontSizes.display.fontSize,
      lineHeight: fontSizes.display.lineHeight,
      fontWeight: fontWeights.light,
      letterSpacing: -0.5,
    },
    heading: {
      fontSize: fontSizes.heading.fontSize,
      lineHeight: fontSizes.heading.lineHeight,
      fontWeight: fontWeights.bold,
      letterSpacing: -0.3,
    },
    label: {
      fontSize: fontSizes.label.fontSize,
      lineHeight: fontSizes.label.lineHeight,
      fontWeight: fontWeights.semibold,
      letterSpacing: 0.1,
    },
    caption: {
      fontSize: fontSizes.caption.fontSize,
      lineHeight: fontSizes.caption.lineHeight,
      fontWeight: fontWeights.normal,
      letterSpacing: 0,
    },
  };

  return styles[variant];
};

/**
 * Base Text component with shared logic
 * Platform-specific implementations are in Text.web.tsx and Text.native.tsx
 */
export const getTextBaseStyles = (
  variant: TextVariant = 'body',
  color?: string,
  weight?: keyof typeof fontWeights,
  align?: 'left' | 'center' | 'right'
) => {
  const variantStyles = getVariantStyles(variant);

  return {
    ...variantStyles,
    color: color || baseColors.textPrimary,
    fontWeight: weight ? fontWeights[weight] : variantStyles.fontWeight,
    textAlign: align || 'left',
    fontFamily: getPlatformFont(),
  };
};

/**
 * The actual Text component is exported from platform-specific files:
 * - Text.web.tsx for web
 * - Text.native.tsx for React Native
 *
 * Both import the types and helpers from this file.
 */

// Platform detection helper
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Cross-platform Text component
 */
export const Text: React.FC<TextProps> = (props) => {
  // Dynamic import to avoid circular dependencies
  if (isWeb) {
    const { Text: WebText } = require('./Text.web');
    return <WebText {...props} />;
  }
  
  // Fallback for non-web environments
  return <span {...props} />;
};
