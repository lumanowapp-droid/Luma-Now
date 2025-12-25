/**
 * Typography Tokens for Luma Now
 * Premium type system inspired by Tiimo and TickTick
 * Balanced readability with refined visual hierarchy
 */

/**
 * Platform-specific Font Families
 * ClickUp-style: Sans-serif stack with Inter/Axiforma for brand, system fonts for UI
 */
export const fonts = {
  ios: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  android: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  brand: "Inter, Axiforma, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
} as const;

/**
 * Font Sizes with ClickUp Visual Hierarchy
 * Professional typography system matching ClickUp design
 * Optimized for productivity and clarity
 */
export const fontSizes = {
  labels: {
    fontSize: 11,
    lineHeight: 11, // 1.0 ratio
    fontWeight: "600" as const,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16.8, // 1.4 ratio
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  body: {
    fontSize: 14,
    lineHeight: 21, // 1.5 ratio
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28.6, // 1.3 ratio
    fontWeight: "600" as const,
    letterSpacing: 0,
  },
  h1: {
    fontSize: 28,
    lineHeight: 33.6, // 1.2 ratio
    fontWeight: "700" as const,
    letterSpacing: 0,
  },
  // Legacy support
  caption: {
    fontSize: 12,
    lineHeight: 16.8,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  small: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  label: {
    fontSize: 11,
    lineHeight: 11,
    fontWeight: "600" as const,
    letterSpacing: 0,
  },
  large: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  subheading: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600" as const,
    letterSpacing: 0,
  },
  heading: {
    fontSize: 28,
    lineHeight: 33.6,
    fontWeight: "700" as const,
    letterSpacing: 0,
  },
  display: {
    fontSize: 32,
    lineHeight: 38.4,
    fontWeight: "700" as const,
    letterSpacing: 0,
  },
} as const;

/**
 * Font Weights
 * Limited set to maintain consistency and premium feel
 */
export const fontWeights = {
  light: "300",
  normal: "400",    // Alias for regular
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",      // For strong emphasis
} as const;

/**
 * Letter Spacing
 * Premium touch through refined spacing
 * Negative spacing for headings creates tighter, more elegant feel
 */
export const letterSpacing = {
  tight: -1,        // Display text (premium, tight)
  snug: -0.5,       // Headings
  normal: 0,        // Body text
  wide: 0.3,        // Labels, captions (improved readability)
  wider: 0.5,       // Uppercase text
} as const;

/**
 * Platform Font Detection
 * Returns appropriate font family based on platform
 * ClickUp-style: System fonts for UI, Inter/Axiforma for brand elements
 */
export const getPlatformFont = (): string => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    return fonts.web;
  }

  // For React Native, Platform.OS will be used at runtime
  // This is a placeholder that will be enhanced in mobile implementation
  return fonts.web;
};

/**
 * Font Stack for Web
 * ClickUp-style: Professional sans-serif stack
 */
export const fontStack = {
  sans: `"Inter", "Axiforma", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  mono: `"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Dank Mono", monospace`,
} as const;

/**
 * Type Exports
 */
export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;
export type Platform = keyof typeof fonts;
