/**
 * Motion Presets
 * Common animation patterns ready to use
 */

import { duration, easing } from '../tokens/motion';

/**
 * Playful Motion Presets
 * Delightful animations inspired by modern apps
 * Each animation adds personality and joy
 */
export const motionPresets = {
  /**
   * Gentle fade in with slight upward motion
   * Default animation for content appearing
   */
  fadeIn: {
    duration: duration.normal,
    y: [10, 0],
    opacity: [0, 1],
  },

  /**
   * Gentle fade out with slight downward motion
   * Default animation for content disappearing
   */
  fadeOut: {
    duration: duration.normal,
    y: [0, 10],
    opacity: [1, 0],
  },

  /**
   * Playful bounce in from bottom
   * Good for modals and sheets
   */
  slideInUp: {
    direction: 'up' as const,
    distance: 20,
    duration: duration.normal,
    bounce: 0.2,
  },

  /**
   * Slide in from top with bounce
   * Good for notifications
   */
  slideInDown: {
    direction: 'down' as const,
    distance: 20,
    duration: duration.normal,
    bounce: 0.1,
  },

  /**
   * Slide in from left with playful curve
   * Good for side panels
   */
  slideInLeft: {
    direction: 'right' as const,
    distance: 24,
    duration: duration.slow,
    curve: 'easeOut',
  },

  /**
   * Slide in from right with playful curve
   * Good for side panels
   */
  slideInRight: {
    direction: 'left' as const,
    distance: 24,
    duration: duration.slow,
    curve: 'easeOut',
  },

  /**
   * Delightful scale in with bounce
   * Good for buttons and small elements
   */
  scaleIn: {
    from: 0.9,
    to: 1,
    duration: duration.fast,
    bounce: 0.1,
  },

  /**
   * Quick scale out
   * Good for buttons and small elements
   */
  scaleOut: {
    from: 1,
    to: 0.9,
    duration: duration.fast,
  },

  /**
   * Springy collapse
   * Good for accordions and expandable sections
   */
  collapse: {
    isOpen: false,
    duration: duration.slow,
    spring: true,
  },

  /**
   * Springy expand
   * Good for accordions and expandable sections
   */
  expand: {
    isOpen: true,
    duration: duration.slow,
    spring: true,
  },

  /**
   * Playful shimmer effect
   * Good for loading states
   */
  shimmer: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut',
  },

  /**
   * Gentle pulse animation
   * Good for attention-grabbing elements
   */
  pulse: {
    scale: [1, 1.05, 1],
    duration: 2,
    repeat: Infinity,
  },

  /**
   * Happy wiggle
   * Good for celebratory moments
   */
  wiggle: {
    rotate: [-2, 2, -2, 2, 0],
    duration: 0.5,
  },

  /**
   * Floating animation
   * Good for decorative elements
   */
  float: {
    y: [-5, 5, -5],
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
  },
} as const;

/**
 * Stagger configuration for list animations
 * When animating multiple items in a list
 */
export const staggerPresets = {
  /**
   * Fast stagger - 50ms between items
   * Good for small lists
   */
  fast: {
    staggerChildren: 0.05,
    delayChildren: 0,
  },

  /**
   * Normal stagger - 100ms between items
   * Default for most lists
   */
  normal: {
    staggerChildren: 0.1,
    delayChildren: 0,
  },

  /**
   * Slow stagger - 150ms between items
   * Good for hero animations
   */
  slow: {
    staggerChildren: 0.15,
    delayChildren: 0.1,
  },
} as const;

/**
 * Helper to create a staggered list animation
 */
export const createStaggeredAnimation = (
  preset: keyof typeof staggerPresets = 'normal'
) => {
  return {
    container: {
      initial: 'hidden',
      animate: 'show',
      exit: 'hidden',
      variants: {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: staggerPresets[preset],
        },
      },
    },
    item: {
      variants: {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      },
    },
  };
};
