/**
 * Motion Hooks
 * Platform-agnostic animation utilities
 */

import { useEffect, useState } from 'react';
import { shouldReduceMotion } from '../tokens/motion';

/**
 * Hook to detect user's reduced motion preference
 * Respects prefers-reduced-motion system setting
 *
 * @returns boolean - true if animations should be reduced/disabled
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Initial check
    setPrefersReducedMotion(shouldReduceMotion());

    // Listen for changes
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to get animation configuration with reduced motion support
 * Returns instant duration if reduced motion is preferred
 *
 * @param duration - Animation duration in milliseconds
 * @returns Adjusted duration (0 if reduced motion, original otherwise)
 */
export function useAnimationDuration(duration: number): number {
  const shouldReduce = useReducedMotion();
  return shouldReduce ? 0 : duration;
}

/**
 * Hook to determine if an animation should play
 * Useful for enabling/disabling entire animation components
 *
 * @returns boolean - true if animations should play
 */
export function useShouldAnimate(): boolean {
  return !useReducedMotion();
}

/**
 * Hook for managing animation state
 * Provides enter/exit state management
 */
export function useAnimationState(isVisible: boolean) {
  const [state, setState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>(
    isVisible ? 'entered' : 'exited'
  );

  useEffect(() => {
    if (isVisible) {
      setState('entering');
      // Transition to entered after animation
      const timer = setTimeout(() => setState('entered'), 300);
      return () => clearTimeout(timer);
    } else {
      setState('exiting');
      const timer = setTimeout(() => setState('exited'), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return state;
}
