/**
 * Shadow Tokens for Luma Now
 * Premium elevation system inspired by Tiimo and TickTick
 * Subtle, soft shadows that create depth without harshness
 * ADHD-friendly: Gentle visual hierarchy
 */

/**
 * React Native Shadow Objects
 * Platform-specific shadow configuration
 * Refined for premium feel with soft blur and low opacity
 */
export const shadows = {
  none: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0, // Android
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,       // ClickUp card shadow opacity
    shadowRadius: 2,           // ClickUp card shadow radius
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,       // Gentle depth
    shadowRadius: 8,           // Soft spread
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,       // Cards, modals
    shadowRadius: 12,          // Premium blur
    elevation: 3,
  },
  // Legacy numeric keys (maintain compatibility)
  0: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  1: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  2: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

/**
 * CSS Box Shadow Strings
 * Pre-formatted for web usage
 * Soft, premium shadows
 */
export const shadowsCSS = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",                    // ClickUp card shadow
  md: "0 2px 8px 0 rgb(0 0 0 / 0.06)",                    // Card default
  lg: "0 4px 12px 0 rgb(0 0 0 / 0.08)",                   // Elevated cards
  xl: "0 8px 24px -4px rgb(0 0 0 / 0.1)",                 // Modals
  // Legacy numeric keys
  0: "none",
  1: "0 1px 3px 0 rgb(0 0 0 / 0.04)",
  2: "0 2px 8px 0 rgb(0 0 0 / 0.06)",
} as const;

/**
 * Focus Ring Shadows
 * Premium, accessible focus indicators
 * Meets WCAG requirements with clear visibility
 */
export const focusRing = {
  default: {
    boxShadow: "0 0 0 2px hsl(var(--primary) / 0.4), 0 0 0 4px hsl(var(--primary) / 0.1)",
    outline: "none",
  },
  highContrast: {
    boxShadow: "0 0 0 3px hsl(var(--primary)), 0 0 0 6px hsl(var(--background))",
    outline: "none",
  },
  subtle: {
    boxShadow: "0 0 0 2px hsl(var(--primary) / 0.2)",
    outline: "none",
  },
} as const;

/**
 * CSS Focus Ring Strings
 * Pre-formatted for direct CSS usage
 */
export const focusRingCSS = "0 0 0 2px hsl(213 85% 45% / 0.4), 0 0 0 4px hsl(213 85% 45% / 0.1)";

export const focusRingCSSVariants = {
  default: "0 0 0 2px hsl(213 85% 45% / 0.4), 0 0 0 4px hsl(213 85% 45% / 0.1)",
  highContrast: "0 0 0 3px hsl(213 85% 45%), 0 0 0 6px white",
  subtle: "0 0 0 2px hsl(213 85% 45% / 0.2)",
} as const;

/**
 * Inner Shadows (for inputs)
 * Subtle inset shadow for depth perception
 */
export const innerShadows = {
  input: "inset 0 1px 2px 0 rgb(0 0 0 / 0.05)",
  well: "inset 0 2px 4px 0 rgb(0 0 0 / 0.06)",
} as const;

/**
 * Type Exports
 */
export type ShadowKey = keyof typeof shadows;
export type ShadowCSSKey = keyof typeof shadowsCSS;
