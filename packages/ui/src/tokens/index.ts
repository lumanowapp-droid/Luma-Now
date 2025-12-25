/**
 * Design Tokens for Luma Now
 * Unified export for all design system tokens
 *
 * Usage:
 *   import { tokens } from '@multi-platform-app/ui/tokens';
 *   import { categoryColors, spacing } from '@multi-platform-app/ui/tokens';
 */

// Re-export all token modules
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './motion';
export * from './shadows';

// Import for unified tokens object
import {
  categoryColors,
  baseColors,
  semanticColors,
  chartColors,
} from './colors';

import {
  fonts,
  fontSizes,
  fontWeights,
  getPlatformFont,
  fontStack,
} from './typography';

import {
  spacing,
  spacingScale,
  componentSpacing,
  borderRadius,
} from './spacing';

import {
  duration,
  easing,
  easingCSS,
  transitions,
  transitionsCSS,
  motionVariants,
  processingDotsConfig,
  shouldReduceMotion,
} from './motion';

import {
  shadows,
  shadowsCSS,
  focusRing,
  focusRingCSS,
  innerShadows,
} from './shadows';

/**
 * Unified Tokens Object
 * Single import for all design tokens
 *
 * @example
 * ```typescript
 * import { tokens } from '@multi-platform-app/ui/tokens';
 *
 * const backgroundColor = tokens.colors.category.workBlue;
 * const fontSize = tokens.typography.sizes.body.fontSize;
 * const padding = tokens.spacing.scale.lg;
 * ```
 */
export const tokens = {
  colors: {
    category: categoryColors,
    base: baseColors,
    semantic: semanticColors,
    chart: chartColors,
  },
  typography: {
    fonts,
    sizes: fontSizes,
    weights: fontWeights,
    stack: fontStack,
    getPlatformFont,
  },
  spacing: {
    scale: spacing,
    array: spacingScale,
    component: componentSpacing,
    radius: borderRadius,
  },
  motion: {
    duration,
    easing,
    easingCSS,
    transitions,
    transitionsCSS,
    variants: motionVariants,
    processingDots: processingDotsConfig,
    shouldReduceMotion,
  },
  shadows: {
    native: shadows,
    css: shadowsCSS,
    focus: focusRing,
    focusCSS: focusRingCSS,
    inner: innerShadows,
  },
} as const;

/**
 * Type Export for Tokens
 * Useful for type-safe token access
 */
export type Tokens = typeof tokens;
