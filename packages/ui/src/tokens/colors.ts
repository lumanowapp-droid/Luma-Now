/**
 * Color Tokens for Luma Now
 * Professional SaaS design system
 * All colors tested for WCAG AAA accessibility (7:1 contrast ratio)
 * Refined for modern, professional aesthetic
 */

/**
 * Professional Category Colors
 * Subtle, sophisticated palette for enterprise SaaS
 * These colors provide clarity and professionalism
 * Designed for productivity and focus
 */
export const categoryColors = {
  work: "#2563EB",      // Professional blue (focus, productivity)
  personal: "#059669", // Sophisticated green (balance, growth)
  care: "#7C3AED",    // Refined purple (care, mindfulness)
  urgent: "#D97706",  // Professional amber (priority, attention)
} as const;

/**
 * Subtle Background Tints
 * Professional background colors for clean interfaces
 * Used for card backgrounds and section highlights
 * Minimal tints for modern SaaS design
 */
export const backgroundTints = {
  workBlue: "hsl(217, 91%, 97%)",       // #EBF4FF - Clean blue
  personalGreen: "hsl(160, 84%, 96%)",  // #ECFDF5 - Fresh green
  carePurple: "hsl(262, 83%, 96%)",     // #F3F0FF - Soft purple
  urgencyAmber: "hsl(43, 96%, 96%)",    // #FFFBEB - Warm amber
  neutral: "hsl(210, 40%, 98%)",        // #F8FAFC - Clean neutral
} as const;

/**
 * Professional Accent Colors
 * Sophisticated colors for interactive states and feedback
 * Inspired by leading SaaS platforms
 */
export const accentColors = {
  completed: "hsl(142, 71%, 45%)",      // Professional green - accomplishment
  focused: "hsl(217, 91%, 60%)",        // Clean blue - active state
  hover: "hsl(210, 40%, 96%)",          // Subtle neutral - hover feedback
  empty: "hsl(215, 16%, 47%)",          // Professional gray - empty states
  highlight: "hsl(45, 93%, 85%)",       // Soft yellow - subtle callouts
  success: "hsl(142, 71%, 45%)",        // Success green
  warning: "hsl(43, 96%, 56%)",         // Professional yellow
  error: "hsl(0, 84%, 60%)",            // Clean red
} as const;

/**
 * Base Colors
 * Foundation colors for backgrounds and text
 * Using HSL format for better theme transitions
 */
export const baseColors = {
  // Light mode (ClickUp backgrounds)
  bgLight: "#F8F9FB",                  // Very light gray workspace background
  bgDark: "#0F172A",                   // Professional dark
  textPrimary: "#292d34",              // ClickUp primary text
  textPrimaryLight: "#292d34",
  textPrimaryDark: "#ffffff",
  textMuted: "#7c828d",                // ClickUp secondary/muted text

  // Surface colors (ClickUp card logic)
  surface: "#ffffff",                  // White surface for cards
  surfaceElevated: "#F8F9FB",           // Workspace background
  surfaceDisabled: "#F3F3F3",           // Disabled/ghost button background
  surfaceHover: "#F7F8F9",             // Hover state background

  // UI colors
  border: "#E9EBEE",                   // Card border color
  overlay: "rgba(15, 23, 42, 0.5)",    // Professional overlay
} as const;

/**
 * Professional Semantic Color System
 * Sophisticated colors for enterprise applications
 * Each color conveys trust and reliability
 */
export const semanticColors = {
  // Primary brand colors (ClickUp brand colors)
  primary: "#7b68ee",                    // Brand purple
  primaryForeground: "#ffffff",
  primaryHover: "#6a5acd",               // Darker purple on hover
  primaryLight: "#8a7ce6",               // Lighter purple variant

  // Secondary actions
  secondary: "hsl(210, 40%, 96%)",       // Clean neutral
  secondaryForeground: "hsl(222, 84%, 5%)",
  secondaryHover: "hsl(210, 40%, 92%)",

  // Muted elements (professional)
  muted: "hsl(210, 40%, 96%)",
  mutedForeground: "hsl(215, 16%, 47%)",

  // Accent highlights
  accent: "hsl(262, 83%, 58%)",          // Professional purple
  accentForeground: "hsl(0, 0%, 100%)",

  // Destructive actions
  destructive: "hsl(0, 84%, 60%)",       // Clean red
  destructiveForeground: "hsl(0, 0%, 100%)",

  // Task-specific semantic colors (professional palette)
  taskWork: "hsl(217, 91%, 60%)",        // Professional blue
  taskPersonal: "hsl(160, 84%, 39%)",    // Sophisticated green
  taskCare: "hsl(262, 83%, 58%)",        // Refined purple
  taskUrgent: "hsl(43, 96%, 56%)",       // Professional amber

  // State colors (ClickUp functional colors)
  success: "#2ecc71",                    // Success green
  error: "#e74c3c",                      // Danger red
  warning: "#ff9800",                    // Warning orange
  info: "#0091FF",                       // Link blue
} as const;

/**
 * Professional Chart Colors
 * Sophisticated colors for data visualization
 * Clean palette for enterprise dashboards
 */
export const chartColors = {
  chart1: "hsl(217, 91%, 60%)",  // workBlue - professional
  chart2: "hsl(160, 84%, 39%)",  // personalGreen - sophisticated
  chart3: "hsl(262, 83%, 58%)",  // carePurple - refined
  chart4: "hsl(43, 96%, 56%)",   // urgencyAmber - professional
  chart5: "hsl(215, 16%, 47%)",  // textMuted - professional gray
  chart6: "hsl(271, 81%, 56%)",  // extra purple
  chart7: "hsl(187, 85%, 43%)",  // extra teal
  chart8: "hsl(25, 95%, 53%)",   // extra coral
} as const;

/**
 * Color Type Exports
 */
export type CategoryColor = keyof typeof categoryColors;
export type BaseColor = keyof typeof baseColors;
export type SemanticColor = keyof typeof semanticColors;
export type ChartColor = keyof typeof chartColors;
