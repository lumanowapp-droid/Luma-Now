import {
  __esm
} from "./chunk-3X2YHN6Q.mjs";

// src/tokens/colors.ts
var categoryColors, backgroundTints, accentColors, baseColors, semanticColors, chartColors;
var init_colors = __esm({
  "src/tokens/colors.ts"() {
    "use strict";
    categoryColors = {
      workBlue: "#36C5F0",
      // Slack-inspired vibrant blue (energetic, productive)
      personalGreen: "#2EB67D",
      // Vibrant green (growth, nature, fresh start)
      carePurple: "#ECB22E",
      // Warm yellow-purple (caring, nurturing, creative)
      urgencyAmber: "#E01E5A"
      // Playful pink-red (attention, urgency, action)
    };
    backgroundTints = {
      workBlue: "hsl(194, 90%, 94%)",
      // #E6F7FD - Energetic blue
      personalGreen: "hsl(154, 55%, 94%)",
      // #E8F5F0 - Fresh green
      carePurple: "hsl(45, 100%, 94%)",
      // #FFF3D6 - Warm yellow
      urgencyAmber: "hsl(347, 100%, 95%)",
      // #FFE6EB - Playful pink
      neutral: "hsl(220, 20%, 98%)"
      // #FAFAFC - Clean default
    };
    accentColors = {
      completed: "hsl(153, 69%, 52%)",
      // Vibrant green - celebration!
      focused: "hsl(206, 90%, 55%)",
      // Playful blue - active state
      hover: "hsl(220, 15%, 88%)",
      // Subtle blue-gray - hover feedback
      empty: "hsl(220, 5%, 65%)",
      // Friendly gray - empty states
      highlight: "hsl(45, 100%, 80%)",
      // Warm yellow - joyful callouts
      success: "hsl(153, 69%, 52%)",
      // Success green
      warning: "hsl(45, 100%, 70%)",
      // Playful yellow
      error: "hsl(347, 82%, 58%)"
      // Playful red-pink
    };
    baseColors = {
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
    semanticColors = {
      // Primary brand colors (playful and energetic)
      primary: "hsl(206, 90%, 55%)",
      // Playful sky blue
      primaryForeground: "hsl(0, 0%, 100%)",
      primaryHover: "hsl(206, 90%, 45%)",
      // Darker on hover
      primaryLight: "hsl(206, 90%, 65%)",
      // Lighter variant
      // Secondary actions
      secondary: "hsl(220, 15%, 95%)",
      // Subtle blue-gray
      secondaryForeground: "hsl(220, 15%, 25%)",
      secondaryHover: "hsl(220, 15%, 90%)",
      // Muted elements (still friendly!)
      muted: "hsl(220, 15%, 95%)",
      mutedForeground: "hsl(220, 15%, 45%)",
      // Accent highlights
      accent: "hsl(45, 100%, 70%)",
      // Joyful yellow
      accentForeground: "hsl(220, 15%, 15%)",
      // Destructive actions
      destructive: "hsl(347, 82%, 58%)",
      // Playful red-pink
      destructiveForeground: "hsl(0, 0%, 100%)",
      // ADHD-specific semantic colors (vibrant palette)
      taskWork: "hsl(194, 90%, 55%)",
      // Energetic blue
      taskPersonal: "hsl(154, 55%, 52%)",
      // Fresh green
      taskCare: "hsl(45, 100%, 65%)",
      // Warm yellow
      taskUrgent: "hsl(347, 82%, 58%)",
      // Playful pink
      // State colors (delightful feedback)
      success: "hsl(153, 69%, 52%)",
      // Celebratory green
      error: "hsl(347, 82%, 58%)",
      // Playful red-pink
      warning: "hsl(45, 100%, 70%)",
      // Joyful yellow
      info: "hsl(206, 90%, 55%)"
      // Friendly blue
    };
    chartColors = {
      chart1: "hsl(194, 90%, 55%)",
      // workBlue - energetic
      chart2: "hsl(154, 55%, 52%)",
      // personalGreen - fresh
      chart3: "hsl(45, 100%, 65%)",
      // carePurple - warm yellow
      chart4: "hsl(347, 82%, 58%)",
      // urgencyAmber - playful pink
      chart5: "hsl(220, 15%, 45%)",
      // textMuted - friendly gray
      chart6: "hsl(260, 100%, 80%)",
      // extra purple
      chart7: "hsl(180, 70%, 60%)",
      // extra teal
      chart8: "hsl(15, 90%, 65%)"
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
      ios: "SF Pro Rounded",
      android: "Inter Rounded",
      web: "Inter Rounded"
    };
    fontSizes = {
      caption: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: "400",
        letterSpacing: 0.3
      },
      small: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "400",
        letterSpacing: 0
      },
      label: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: "500",
        // Medium weight for emphasis
        letterSpacing: 0.1
      },
      body: {
        fontSize: 16,
        // Balanced for readability and modern feel
        lineHeight: 24,
        fontWeight: "400",
        letterSpacing: 0
      },
      large: {
        fontSize: 18,
        lineHeight: 28,
        fontWeight: "400",
        letterSpacing: -0.1
      },
      subheading: {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: "600",
        // Stronger hierarchy
        letterSpacing: -0.2
      },
      heading: {
        fontSize: 28,
        lineHeight: 34,
        fontWeight: "600",
        // Bold for clear hierarchy
        letterSpacing: -0.5
      },
      display: {
        fontSize: 40,
        lineHeight: 48,
        fontWeight: "700",
        // Strong for headlines
        letterSpacing: -1
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
      rounded: `"Inter Rounded", "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
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
