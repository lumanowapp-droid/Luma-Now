var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/tokens/typography.ts
var fonts = {
  ios: "SF Pro Rounded",
  android: "Inter Rounded",
  web: "Inter Rounded"
};
var fontSizes = {
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400"
  },
  small: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400"
  },
  body: {
    fontSize: 18,
    // Larger default for ADHD readability
    lineHeight: 28,
    fontWeight: "400"
  },
  large: {
    fontSize: 21,
    lineHeight: 32,
    fontWeight: "400"
  },
  heading: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "300"
    // Light weight for elegance
  },
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "200"
    // Ultra-light for impact
  }
};
var fontWeights = {
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600"
};
var getPlatformFont = () => {
  if (typeof window !== "undefined") {
    return fonts.web;
  }
  return fonts.web;
};
var fontStack = {
  rounded: `"Inter Rounded", "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  mono: `"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Dank Mono", monospace`
};

// src/tokens/colors.ts
var categoryColors = {
  workBlue: "#6B85A6",
  // Work/professional tasks
  personalGreen: "#7A9B8E",
  // Personal care, health
  carePurple: "#9A8FB0",
  // Relationships, caregiving
  urgencyAmber: "#C89B5C"
  // Time-sensitive items
};
var baseColors = {
  // Light mode
  bgLight: "hsl(40, 20%, 98%)",
  // #FAFAF7 - Warm white, not harsh
  bgDark: "hsl(222, 18%, 7%)",
  // #0F1115 - True dark, not gray
  textPrimaryLight: "hsl(0, 0%, 10%)",
  // #1A1A1A
  textPrimaryDark: "hsl(0, 0%, 93%)",
  // #EDEDED
  textMuted: "hsl(215, 14%, 45%)"
  // #6B7280
};
var semanticColors = {
  // Preserve existing semantic names
  primary: "hsl(240, 5.9%, 10%)",
  primaryForeground: "hsl(0, 0%, 98%)",
  secondary: "hsl(240, 4.8%, 95.9%)",
  secondaryForeground: "hsl(240, 5.9%, 10%)",
  muted: "hsl(240, 4.8%, 95.9%)",
  mutedForeground: "hsl(240, 3.8%, 46.1%)",
  accent: "hsl(240, 4.8%, 95.9%)",
  accentForeground: "hsl(240, 5.9%, 10%)",
  destructive: "hsl(0, 84.2%, 60.2%)",
  destructiveForeground: "hsl(0, 0%, 98%)",
  // ADHD-specific semantic colors (in HSL)
  taskWork: "hsl(213, 25%, 53%)",
  // workBlue in HSL
  taskPersonal: "hsl(157, 14%, 53%)",
  // personalGreen in HSL
  taskCare: "hsl(258, 17%, 62%)",
  // carePurple in HSL
  taskUrgent: "hsl(34, 45%, 57%)"
  // urgencyAmber in HSL
};
var chartColors = {
  chart1: "hsl(213, 25%, 53%)",
  // workBlue
  chart2: "hsl(157, 14%, 53%)",
  // personalGreen
  chart3: "hsl(258, 17%, 62%)",
  // carePurple
  chart4: "hsl(34, 45%, 57%)",
  // urgencyAmber
  chart5: "hsl(215, 14%, 45%)"
  // textMuted
};

// src/tokens/spacing.ts
var spacing = {
  xs: 4,
  // 0.25rem - Minimal spacing
  sm: 8,
  // 0.5rem  - Small gaps
  md: 12,
  // 0.75rem - Medium spacing
  base: 16,
  // 1rem    - Default spacing
  lg: 24,
  // 1.5rem  - Large gaps
  xl: 32,
  // 2rem    - Extra large
  xxl: 48,
  // 3rem    - Section spacing
  xxxl: 64
  // 4rem    - Major sections
};
var spacingScale = [4, 8, 12, 16, 24, 32, 48, 64];
var componentSpacing = {
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
  tabBarHeight: 56
};
var borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999
};

export {
  __require,
  fonts,
  fontSizes,
  fontWeights,
  getPlatformFont,
  fontStack,
  categoryColors,
  baseColors,
  semanticColors,
  chartColors,
  spacing,
  spacingScale,
  componentSpacing,
  borderRadius
};
