/**
 * Spacing Tokens for Luma Now
 * 4px base unit for consistent rhythm and predictable patterns
 * ADHD-friendly: Generous whitespace reduces visual clutter
 */

/**
 * Spacing Scale
 * Based on 4px increments for mathematical consistency
 */
export const spacing = {
  xs: 4,     // 0.25rem - Minimal spacing
  sm: 8,     // 0.5rem  - Small gaps
  md: 12,    // 0.75rem - Medium spacing
  base: 16,  // 1rem    - Default spacing
  lg: 24,    // 1.5rem  - Large gaps
  xl: 32,    // 2rem    - Extra large
  xxl: 48,   // 3rem    - Section spacing
  xxxl: 64,  // 4rem    - Major sections
} as const;

/**
 * Spacing Array
 * Useful for iteration or programmatic access
 */
export const spacingScale = [4, 8, 12, 16, 24, 32, 48, 64] as const;

/**
 * Component-Specific Spacing
 * Pre-calculated spacing for common patterns
 */
export const componentSpacing = {
  // Tap targets (iOS HIG: 44pt minimum)
  tapTarget: 44,
  tapTargetSmall: 36,

  // Input fields
  inputPadding: spacing.base,
  inputHeight: 48,

  // Cards and surfaces
  cardPadding: spacing.lg,
  cardGap: spacing.base,

  // Layout
  screenPadding: spacing.lg,
  sectionGap: spacing.xxl,
  listItemGap: spacing.md,

  // Navigation
  headerHeight: 64,
  tabBarHeight: 56,
} as const;

/**
 * Border Radius
 * ClickUp-style: 4px to 6px radius for professional buttons
 */
export const borderRadius = {
  sm: 4,    // ClickUp standard radius
  md: 6,    // ClickUp slightly rounded
  lg: 8,
  xl: 12,
  full: 9999,
} as const;

/**
 * Type Exports
 */
export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
