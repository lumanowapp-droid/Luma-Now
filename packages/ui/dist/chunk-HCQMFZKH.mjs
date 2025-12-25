var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

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
  textPrimary: "hsl(0, 0%, 10%)",
  // #1A1A1A - Default text color
  textPrimaryLight: "hsl(0, 0%, 10%)",
  // #1A1A1A
  textPrimaryDark: "hsl(0, 0%, 93%)",
  // #EDEDED
  textMuted: "hsl(215, 14%, 45%)",
  // #6B7280
  // Surface colors
  surface: "hsl(0, 0%, 100%)",
  // White surface
  surfaceElevated: "hsl(0, 0%, 98%)",
  // Slightly elevated surface
  surfaceDisabled: "hsl(220, 13%, 95%)",
  // Disabled surface
  // UI colors
  border: "hsl(220, 13%, 85%)",
  // Border color
  overlay: "rgba(0, 0, 0, 0.5)"
  // Modal overlay
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
  taskUrgent: "hsl(34, 45%, 57%)",
  // urgencyAmber in HSL
  // State colors
  success: "hsl(142, 71%, 45%)",
  // Success/positive state
  error: "hsl(0, 84%, 60%)",
  // Error/negative state
  warning: "hsl(38, 92%, 50%)",
  // Warning state
  info: "hsl(199, 89%, 48%)"
  // Info state
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
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500"
    // Medium weight for labels
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
  normal: "400",
  // Alias for regular
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

// src/tokens/motion.ts
var duration = {
  instant: 0,
  // No animation
  fast: 150,
  // Quick feedback (hover, focus)
  normal: 250,
  // Default transitions
  slow: 400,
  // Major state changes
  verySlow: 600
  // Page transitions
};
var easing = {
  calm: [0.25, 0.1, 0.25, 1],
  // Calm ease-in-out
  gentle: [0.4, 0, 0.2, 1],
  // Gentle acceleration (Material ease)
  linear: [0, 0, 1, 1]
  // Linear (for progress bars)
};
var easingCSS = {
  calm: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
  gentle: "cubic-bezier(0.4, 0.0, 0.2, 1.0)",
  linear: "linear"
};
var transitions = {
  fade: {
    duration: duration.normal,
    easing: easing.calm,
    properties: ["opacity"]
  },
  slide: {
    duration: duration.slow,
    easing: easing.gentle,
    properties: ["transform"]
  },
  scale: {
    duration: duration.fast,
    easing: easing.calm,
    properties: ["transform"]
  },
  color: {
    duration: duration.normal,
    easing: easing.calm,
    properties: ["color", "background-color", "border-color"]
  }
};
var transitionsCSS = {
  fade: `opacity ${duration.normal}ms ${easingCSS.calm}`,
  slide: `transform ${duration.slow}ms ${easingCSS.gentle}`,
  scale: `transform ${duration.fast}ms ${easingCSS.calm}`,
  color: `color ${duration.normal}ms ${easingCSS.calm}, background-color ${duration.normal}ms ${easingCSS.calm}, border-color ${duration.normal}ms ${easingCSS.calm}`,
  all: `all ${duration.normal}ms ${easingCSS.calm}`
};
var motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration.normal / 1e3, ease: easing.calm }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: duration.slow / 1e3, ease: easing.gentle }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: duration.fast / 1e3, ease: easing.calm }
  }
};
var processingDotsConfig = {
  dotCount: 3,
  duration: 200,
  // 200ms per dot
  totalDuration: 600,
  // 3 dots × 200ms
  staggerDelay: 200
  // Delay between each dot
};
var shouldReduceMotion = () => {
  if (typeof window === "undefined")
    return false;
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  return mediaQuery.matches;
};

// src/tokens/shadows.ts
var shadows = {
  0: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0
    // Android
  },
  1: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
    // Android
  },
  2: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
    // Android
  },
  none: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0
    // Android
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
    // Android
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
    // Android
  }
};
var shadowsCSS = {
  0: "none",
  1: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  2: "0 2px 4px 0 rgb(0 0 0 / 0.08)",
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 2px 4px 0 rgb(0 0 0 / 0.08)"
};
var focusRing = {
  default: {
    boxShadow: "0 0 0 2px hsl(var(--ring))",
    outline: "none"
  },
  highContrast: {
    boxShadow: "0 0 0 3px hsl(var(--ring))",
    outline: "none"
  }
};
var focusRingCSS = "0 0 0 2px rgba(59, 130, 246, 0.5)";
var focusRingCSSVariants = {
  default: "0 0 0 2px rgba(59, 130, 246, 0.5)",
  highContrast: "0 0 0 3px rgba(59, 130, 246, 0.8)"
};
var innerShadows = {
  input: "inset 0 1px 2px 0 rgb(0 0 0 / 0.05)",
  well: "inset 0 2px 4px 0 rgb(0 0 0 / 0.06)"
};

// src/tokens/index.ts
var tokens = {
  colors: {
    category: categoryColors,
    base: baseColors,
    semantic: semanticColors,
    chart: chartColors
  },
  typography: {
    fonts,
    sizes: fontSizes,
    weights: fontWeights,
    stack: fontStack,
    getPlatformFont
  },
  spacing: {
    scale: spacing,
    array: spacingScale,
    component: componentSpacing,
    radius: borderRadius
  },
  motion: {
    duration,
    easing,
    easingCSS,
    transitions,
    transitionsCSS,
    variants: motionVariants,
    processingDots: processingDotsConfig,
    shouldReduceMotion
  },
  shadows: {
    native: shadows,
    css: shadowsCSS,
    focus: focusRing,
    focusCSS: focusRingCSS,
    inner: innerShadows
  }
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
  borderRadius,
  duration,
  easing,
  easingCSS,
  transitions,
  transitionsCSS,
  motionVariants,
  processingDotsConfig,
  shouldReduceMotion,
  shadows,
  shadowsCSS,
  focusRing,
  focusRingCSS,
  focusRingCSSVariants,
  innerShadows,
  tokens
};
