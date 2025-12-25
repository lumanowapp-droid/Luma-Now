/**
 * Motion Tokens for Luma Now
 * Calm, purposeful animations in the 200-400ms range
 * ADHD-friendly: No aggressive motion, always respects prefers-reduced-motion
 */

/**
 * Duration Tokens
 * Calm range: 200-400ms (per brief)
 * All values in milliseconds
 */
export const duration = {
  instant: 0,      // No animation
  fast: 150,       // Quick feedback (hover, focus)
  normal: 250,     // Default transitions
  slow: 400,       // Major state changes
  verySlow: 600,   // Page transitions
} as const;

/**
 * Easing Functions
 * No bounce or spring - calm, predictable motion only
 * Values are cubic-bezier control points [x1, y1, x2, y2]
 */
export const easing = {
  calm: [0.25, 0.1, 0.25, 1.0],      // Calm ease-in-out
  gentle: [0.4, 0.0, 0.2, 1.0],      // Gentle acceleration (Material ease)
  linear: [0.0, 0.0, 1.0, 1.0],      // Linear (for progress bars)
} as const;

/**
 * CSS Easing Strings
 * Pre-formatted for CSS cubic-bezier()
 */
export const easingCSS = {
  calm: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
  gentle: "cubic-bezier(0.4, 0.0, 0.2, 1.0)",
  linear: "linear",
} as const;

/**
 * Transition Presets
 * Common animation combinations
 */
export const transitions = {
  fade: {
    duration: duration.normal,
    easing: easing.calm,
    properties: ["opacity"],
  },
  slide: {
    duration: duration.slow,
    easing: easing.gentle,
    properties: ["transform"],
  },
  scale: {
    duration: duration.fast,
    easing: easing.calm,
    properties: ["transform"],
  },
  color: {
    duration: duration.normal,
    easing: easing.calm,
    properties: ["color", "background-color", "border-color"],
  },
} as const;

/**
 * CSS Transition Strings
 * Ready-to-use CSS transition values
 */
export const transitionsCSS = {
  fade: `opacity ${duration.normal}ms ${easingCSS.calm}`,
  slide: `transform ${duration.slow}ms ${easingCSS.gentle}`,
  scale: `transform ${duration.fast}ms ${easingCSS.calm}`,
  color: `color ${duration.normal}ms ${easingCSS.calm}, background-color ${duration.normal}ms ${easingCSS.calm}, border-color ${duration.normal}ms ${easingCSS.calm}`,
  all: `all ${duration.normal}ms ${easingCSS.calm}`,
} as const;

/**
 * Animation Variants for Framer Motion (Web)
 */
export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration.normal / 1000, ease: easing.calm },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: duration.slow / 1000, ease: easing.gentle },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: duration.fast / 1000, ease: easing.calm },
  },
} as const;

/**
 * Processing Dots Animation
 * For loading states (3 dots, not spinner per brief)
 */
export const processingDotsConfig = {
  dotCount: 3,
  duration: 200,           // 200ms per dot
  totalDuration: 600,      // 3 dots × 200ms
  staggerDelay: 200,       // Delay between each dot
} as const;

/**
 * Interaction Presets
 * Premium micro-interactions inspired by Tiimo and TickTick
 * Provides immediate, satisfying feedback
 */
export const interactionPresets = {
  // Tap feedback (instant visual response)
  tapFeedback: {
    duration: duration.fast,
    scale: 0.98,           // Slight scale down
    opacity: 0.7,          // Optional opacity
  },

  // Hover state (web only)
  hoverFeedback: {
    duration: duration.fast,
    scale: 1.02,           // Slight scale up
    brightness: 1.05,      // Slightly brighter
  },

  // Task completion (satisfying but not distracting)
  taskCompletion: {
    duration: duration.slow,
    fadeOut: 0.5,          // Fade to 50% opacity
    slideOut: 20,          // Slide right 20px
    scale: 0.95,           // Slightly smaller
  },

  // Swipe to complete (iOS/Android gesture)
  swipeComplete: {
    duration: duration.normal,
    threshold: 100,        // Pixels to trigger
    checkmarkScale: { from: 0, to: 1 },
  },

  // List reorder (smooth, calm)
  listReorder: {
    duration: duration.normal,
    stagger: 50,           // 50ms delay between items
  },

  // Modal entry/exit
  modal: {
    duration: duration.slow,
    backdropOpacity: 0.5,
    slideDistance: 20,     // Slide up 20px
  },

  // Button press state
  buttonPress: {
    duration: 100,         // Very quick
    scale: 0.96,           // Subtle scale
  },
} as const;

/**
 * Reduced Motion Detection
 * Utility function to check user preference
 */
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

/**
 * Type Exports
 */
export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
export type Transition = keyof typeof transitions;
