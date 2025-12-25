import {
  __esm
} from "./chunk-3X2YHN6Q.mjs";

// src/tokens/colors.ts
var categoryColors, backgroundTints, accentColors, baseColors, semanticColors, chartColors;
var init_colors = __esm({
  "src/tokens/colors.ts"() {
    "use strict";
    categoryColors = {
      work: "#2563EB",
      // Professional blue (focus, productivity)
      personal: "#059669",
      // Sophisticated green (balance, growth)
      care: "#7C3AED",
      // Refined purple (care, mindfulness)
      urgent: "#D97706"
      // Professional amber (priority, attention)
    };
    backgroundTints = {
      workBlue: "hsl(217, 91%, 97%)",
      // #EBF4FF - Clean blue
      personalGreen: "hsl(160, 84%, 96%)",
      // #ECFDF5 - Fresh green
      carePurple: "hsl(262, 83%, 96%)",
      // #F3F0FF - Soft purple
      urgencyAmber: "hsl(43, 96%, 96%)",
      // #FFFBEB - Warm amber
      neutral: "hsl(210, 40%, 98%)"
      // #F8FAFC - Clean neutral
    };
    accentColors = {
      completed: "hsl(142, 71%, 45%)",
      // Professional green - accomplishment
      focused: "hsl(217, 91%, 60%)",
      // Clean blue - active state
      hover: "hsl(210, 40%, 96%)",
      // Subtle neutral - hover feedback
      empty: "hsl(215, 16%, 47%)",
      // Professional gray - empty states
      highlight: "hsl(45, 93%, 85%)",
      // Soft yellow - subtle callouts
      success: "hsl(142, 71%, 45%)",
      // Success green
      warning: "hsl(43, 96%, 56%)",
      // Professional yellow
      error: "hsl(0, 84%, 60%)"
      // Clean red
    };
    baseColors = {
      // Light mode (ClickUp backgrounds)
      bgLight: "#F8F9FB",
      // Very light gray workspace background
      bgDark: "#0F172A",
      // Professional dark
      textPrimary: "#292d34",
      // ClickUp primary text
      textPrimaryLight: "#292d34",
      textPrimaryDark: "#ffffff",
      textMuted: "#7c828d",
      // ClickUp secondary/muted text
      // Surface colors
      surface: "hsl(0, 0%, 100%)",
      // White surface
      surfaceElevated: "hsl(210, 40%, 98%)",
      // Slightly elevated surface
      surfaceDisabled: "hsl(210, 40%, 96%)",
      // Disabled surface
      // UI colors
      border: "hsl(214, 32%, 91%)",
      // Border color
      overlay: "rgba(15, 23, 42, 0.5)"
      // Professional overlay
    };
    semanticColors = {
      // Primary brand colors (ClickUp brand colors)
      primary: "#7b68ee",
      // Brand purple
      primaryForeground: "#ffffff",
      primaryHover: "#6a5acd",
      // Darker purple on hover
      primaryLight: "#8a7ce6",
      // Lighter purple variant
      // Secondary actions
      secondary: "hsl(210, 40%, 96%)",
      // Clean neutral
      secondaryForeground: "hsl(222, 84%, 5%)",
      secondaryHover: "hsl(210, 40%, 92%)",
      // Muted elements (professional)
      muted: "hsl(210, 40%, 96%)",
      mutedForeground: "hsl(215, 16%, 47%)",
      // Accent highlights
      accent: "hsl(262, 83%, 58%)",
      // Professional purple
      accentForeground: "hsl(0, 0%, 100%)",
      // Destructive actions
      destructive: "hsl(0, 84%, 60%)",
      // Clean red
      destructiveForeground: "hsl(0, 0%, 100%)",
      // Task-specific semantic colors (professional palette)
      taskWork: "hsl(217, 91%, 60%)",
      // Professional blue
      taskPersonal: "hsl(160, 84%, 39%)",
      // Sophisticated green
      taskCare: "hsl(262, 83%, 58%)",
      // Refined purple
      taskUrgent: "hsl(43, 96%, 56%)",
      // Professional amber
      // State colors (ClickUp functional colors)
      success: "#2ecc71",
      // Success green
      error: "#e74c3c",
      // Danger red
      warning: "#ff9800",
      // Warning orange
      info: "#0091FF"
      // Link blue
    };
    chartColors = {
      chart1: "hsl(217, 91%, 60%)",
      // workBlue - professional
      chart2: "hsl(160, 84%, 39%)",
      // personalGreen - sophisticated
      chart3: "hsl(262, 83%, 58%)",
      // carePurple - refined
      chart4: "hsl(43, 96%, 56%)",
      // urgencyAmber - professional
      chart5: "hsl(215, 16%, 47%)",
      // textMuted - professional gray
      chart6: "hsl(271, 81%, 56%)",
      // extra purple
      chart7: "hsl(187, 85%, 43%)",
      // extra teal
      chart8: "hsl(25, 95%, 53%)"
      // extra coral
    };
  }
});

// src/tokens/typography.ts
var fonts, fontSizes, fontWeights, letterSpacing, getPlatformFont, fontStack;
var init_typography = __esm({
  "src/tokens/typography.ts"() {
    "use strict";
    fonts = {
      ios: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      android: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      brand: "Inter, Axiforma, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    };
    fontSizes = {
      labels: {
        fontSize: 11,
        lineHeight: 11,
        // 1.0 ratio
        fontWeight: "600",
        letterSpacing: 0
      },
      bodySmall: {
        fontSize: 12,
        lineHeight: 16.8,
        // 1.4 ratio
        fontWeight: "400",
        letterSpacing: 0
      },
      body: {
        fontSize: 14,
        lineHeight: 21,
        // 1.5 ratio
        fontWeight: "400",
        letterSpacing: 0
      },
      h2: {
        fontSize: 22,
        lineHeight: 28.6,
        // 1.3 ratio
        fontWeight: "600",
        letterSpacing: 0
      },
      h1: {
        fontSize: 28,
        lineHeight: 33.6,
        // 1.2 ratio
        fontWeight: "700",
        letterSpacing: 0
      },
      // Legacy support
      caption: {
        fontSize: 12,
        lineHeight: 16.8,
        fontWeight: "400",
        letterSpacing: 0
      },
      small: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "400",
        letterSpacing: 0
      },
      label: {
        fontSize: 11,
        lineHeight: 11,
        fontWeight: "600",
        letterSpacing: 0
      },
      large: {
        fontSize: 18,
        lineHeight: 27,
        fontWeight: "400",
        letterSpacing: 0
      },
      subheading: {
        fontSize: 20,
        lineHeight: 26,
        fontWeight: "600",
        letterSpacing: 0
      },
      heading: {
        fontSize: 28,
        lineHeight: 33.6,
        fontWeight: "700",
        letterSpacing: 0
      },
      display: {
        fontSize: 32,
        lineHeight: 38.4,
        fontWeight: "700",
        letterSpacing: 0
      }
    };
    fontWeights = {
      light: "300",
      normal: "400",
      // Alias for regular
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700"
      // For strong emphasis
    };
    letterSpacing = {
      tight: -1,
      // Display text (premium, tight)
      snug: -0.5,
      // Headings
      normal: 0,
      // Body text
      wide: 0.3,
      // Labels, captions (improved readability)
      wider: 0.5
      // Uppercase text
    };
    getPlatformFont = () => {
      if (typeof window !== "undefined") {
        return fonts.web;
      }
      return fonts.web;
    };
    fontStack = {
      sans: `"Inter", "Axiforma", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
      mono: `"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Dank Mono", monospace`
    };
  }
});

// src/tokens/spacing.ts
var spacing, spacingScale, componentSpacing, borderRadius;
var init_spacing = __esm({
  "src/tokens/spacing.ts"() {
    "use strict";
    spacing = {
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
    spacingScale = [4, 8, 12, 16, 24, 32, 48, 64];
    componentSpacing = {
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
    borderRadius = {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      full: 9999
    };
  }
});

// src/tokens/motion.ts
var duration, easing, easingCSS, transitions, transitionsCSS, motionVariants, processingDotsConfig, interactionPresets, shouldReduceMotion;
var init_motion = __esm({
  "src/tokens/motion.ts"() {
    "use strict";
    duration = {
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
    easing = {
      calm: [0.25, 0.1, 0.25, 1],
      // Calm ease-in-out
      gentle: [0.4, 0, 0.2, 1],
      // Gentle acceleration (Material ease)
      linear: [0, 0, 1, 1]
      // Linear (for progress bars)
    };
    easingCSS = {
      calm: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
      gentle: "cubic-bezier(0.4, 0.0, 0.2, 1.0)",
      linear: "linear"
    };
    transitions = {
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
    transitionsCSS = {
      fade: `opacity ${duration.normal}ms ${easingCSS.calm}`,
      slide: `transform ${duration.slow}ms ${easingCSS.gentle}`,
      scale: `transform ${duration.fast}ms ${easingCSS.calm}`,
      color: `color ${duration.normal}ms ${easingCSS.calm}, background-color ${duration.normal}ms ${easingCSS.calm}, border-color ${duration.normal}ms ${easingCSS.calm}`,
      all: `all ${duration.normal}ms ${easingCSS.calm}`
    };
    motionVariants = {
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
    processingDotsConfig = {
      dotCount: 3,
      duration: 200,
      // 200ms per dot
      totalDuration: 600,
      // 3 dots × 200ms
      staggerDelay: 200
      // Delay between each dot
    };
    interactionPresets = {
      // Tap feedback (instant visual response)
      tapFeedback: {
        duration: duration.fast,
        scale: 0.98,
        // Slight scale down
        opacity: 0.7
        // Optional opacity
      },
      // Hover state (web only)
      hoverFeedback: {
        duration: duration.fast,
        scale: 1.02,
        // Slight scale up
        brightness: 1.05
        // Slightly brighter
      },
      // Task completion (satisfying but not distracting)
      taskCompletion: {
        duration: duration.slow,
        fadeOut: 0.5,
        // Fade to 50% opacity
        slideOut: 20,
        // Slide right 20px
        scale: 0.95
        // Slightly smaller
      },
      // Swipe to complete (iOS/Android gesture)
      swipeComplete: {
        duration: duration.normal,
        threshold: 100,
        // Pixels to trigger
        checkmarkScale: { from: 0, to: 1 }
      },
      // List reorder (smooth, calm)
      listReorder: {
        duration: duration.normal,
        stagger: 50
        // 50ms delay between items
      },
      // Modal entry/exit
      modal: {
        duration: duration.slow,
        backdropOpacity: 0.5,
        slideDistance: 20
        // Slide up 20px
      },
      // Button press state
      buttonPress: {
        duration: 100,
        // Very quick
        scale: 0.96
        // Subtle scale
      }
    };
    shouldReduceMotion = () => {
      if (typeof window === "undefined")
        return false;
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      return mediaQuery.matches;
    };
  }
});

// src/tokens/shadows.ts
var shadows, shadowsCSS, focusRing, focusRingCSS, focusRingCSSVariants, innerShadows;
var init_shadows = __esm({
  "src/tokens/shadows.ts"() {
    "use strict";
    shadows = {
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
        shadowOpacity: 0.04,
        // Very subtle
        shadowRadius: 3,
        // Softer blur
        elevation: 1
      },
      md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        // Gentle depth
        shadowRadius: 8,
        // Soft spread
        elevation: 2
      },
      lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        // Cards, modals
        shadowRadius: 12,
        // Premium blur
        elevation: 3
      },
      // Legacy numeric keys (maintain compatibility)
      0: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0
      },
      1: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1
      },
      2: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2
      }
    };
    shadowsCSS = {
      none: "none",
      sm: "0 1px 3px 0 rgb(0 0 0 / 0.04)",
      // Subtle hint
      md: "0 2px 8px 0 rgb(0 0 0 / 0.06)",
      // Card default
      lg: "0 4px 12px 0 rgb(0 0 0 / 0.08)",
      // Elevated cards
      xl: "0 8px 24px -4px rgb(0 0 0 / 0.1)",
      // Modals
      // Legacy numeric keys
      0: "none",
      1: "0 1px 3px 0 rgb(0 0 0 / 0.04)",
      2: "0 2px 8px 0 rgb(0 0 0 / 0.06)"
    };
    focusRing = {
      default: {
        boxShadow: "0 0 0 2px hsl(var(--primary) / 0.4), 0 0 0 4px hsl(var(--primary) / 0.1)",
        outline: "none"
      },
      highContrast: {
        boxShadow: "0 0 0 3px hsl(var(--primary)), 0 0 0 6px hsl(var(--background))",
        outline: "none"
      },
      subtle: {
        boxShadow: "0 0 0 2px hsl(var(--primary) / 0.2)",
        outline: "none"
      }
    };
    focusRingCSS = "0 0 0 2px hsl(213 85% 45% / 0.4), 0 0 0 4px hsl(213 85% 45% / 0.1)";
    focusRingCSSVariants = {
      default: "0 0 0 2px hsl(213 85% 45% / 0.4), 0 0 0 4px hsl(213 85% 45% / 0.1)",
      highContrast: "0 0 0 3px hsl(213 85% 45%), 0 0 0 6px white",
      subtle: "0 0 0 2px hsl(213 85% 45% / 0.2)"
    };
    innerShadows = {
      input: "inset 0 1px 2px 0 rgb(0 0 0 / 0.05)",
      well: "inset 0 2px 4px 0 rgb(0 0 0 / 0.06)"
    };
  }
});

// src/tokens/index.ts
init_colors();
init_typography();
init_spacing();
init_motion();
init_shadows();
init_colors();
init_typography();
init_spacing();
init_motion();
init_shadows();
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
  categoryColors,
  backgroundTints,
  accentColors,
  baseColors,
  semanticColors,
  chartColors,
  init_colors,
  fonts,
  fontSizes,
  fontWeights,
  letterSpacing,
  getPlatformFont,
  fontStack,
  init_typography,
  spacing,
  spacingScale,
  componentSpacing,
  borderRadius,
  init_spacing,
  duration,
  easing,
  easingCSS,
  transitions,
  transitionsCSS,
  motionVariants,
  processingDotsConfig,
  interactionPresets,
  shouldReduceMotion,
  init_motion,
  shadows,
  shadowsCSS,
  focusRing,
  focusRingCSS,
  focusRingCSSVariants,
  innerShadows,
  init_shadows,
  tokens
};
