/**
 * Motion Primitives - Web Implementation (Framer Motion)
 * Calm, purposeful animations that respect prefers-reduced-motion
 */

'use client';

import { motion, AnimatePresence as FramerAnimatePresence } from 'framer-motion';
import { duration, easing } from '../tokens/motion';
import { useReducedMotion } from './hooks';
import type {
  FadeProps,
  SlideProps,
  ScaleProps,
  CollapseProps,
  AnimatedPresenceProps,
} from './primitives';

/**
 * FadeIn Component
 * Gentle opacity animation from 0 to 1
 */
export function FadeIn({
  children,
  duration: customDuration,
  delay = 0,
  from = 0,
  to = 1,
  onAnimationComplete,
}: FadeProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: from }}
      animate={{ opacity: to }}
      transition={{
        duration: shouldReduce ? 0 : (customDuration ?? duration.normal) / 1000,
        delay: shouldReduce ? 0 : delay / 1000,
        ease: easing.calm,
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeOut Component
 * Gentle opacity animation from 1 to 0
 */
export function FadeOut({
  children,
  duration: customDuration,
  delay = 0,
  from = 1,
  to = 0,
  onAnimationComplete,
}: FadeProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: from }}
      animate={{ opacity: to }}
      transition={{
        duration: shouldReduce ? 0 : (customDuration ?? duration.normal) / 1000,
        delay: shouldReduce ? 0 : delay / 1000,
        ease: easing.calm,
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideIn Component
 * Directional entrance animation
 */
export function SlideIn({
  children,
  direction = 'up',
  distance = 20,
  duration: customDuration,
  delay = 0,
  onAnimationComplete,
}: SlideProps) {
  const shouldReduce = useReducedMotion();

  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  const initial = directions[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...initial }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: shouldReduce ? 0 : (customDuration ?? duration.normal) / 1000,
        delay: shouldReduce ? 0 : delay / 1000,
        ease: easing.gentle,
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideOut Component
 * Directional exit animation
 */
export function SlideOut({
  children,
  direction = 'down',
  distance = 20,
  duration: customDuration,
  delay = 0,
  onAnimationComplete,
}: SlideProps) {
  const shouldReduce = useReducedMotion();

  const directions = {
    up: { y: -distance },
    down: { y: distance },
    left: { x: -distance },
    right: { x: distance },
  };

  const final = directions[direction];

  return (
    <motion.div
      initial={{ opacity: 1, x: 0, y: 0 }}
      animate={{ opacity: 0, ...final }}
      transition={{
        duration: shouldReduce ? 0 : (customDuration ?? duration.normal) / 1000,
        delay: shouldReduce ? 0 : delay / 1000,
        ease: easing.gentle,
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScaleIn Component
 * Subtle grow animation
 */
export function ScaleIn({
  children,
  from = 0.95,
  to = 1,
  duration: customDuration,
  delay = 0,
  onAnimationComplete,
}: ScaleProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: from }}
      animate={{ opacity: 1, scale: to }}
      transition={{
        duration: shouldReduce ? 0 : (customDuration ?? duration.fast) / 1000,
        delay: shouldReduce ? 0 : delay / 1000,
        ease: easing.calm,
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScaleOut Component
 * Subtle shrink animation
 */
export function ScaleOut({
  children,
  from = 1,
  to = 0.95,
  duration: customDuration,
  delay = 0,
  onAnimationComplete,
}: ScaleProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 1, scale: from }}
      animate={{ opacity: 0, scale: to }}
      transition={{
        duration: shouldReduce ? 0 : (customDuration ?? duration.fast) / 1000,
        delay: shouldReduce ? 0 : delay / 1000,
        ease: easing.calm,
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  );
}

/**
 * Collapse Component
 * Height animation for showing/hiding content
 */
export function Collapse({
  children,
  isOpen,
  duration: customDuration,
  delay = 0,
  onAnimationComplete,
}: CollapseProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={false}
      animate={{
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{
        duration: shouldReduce ? 0 : (customDuration ?? duration.slow) / 1000,
        delay: shouldReduce ? 0 : delay / 1000,
        ease: easing.gentle,
      }}
      style={{ overflow: 'hidden' }}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedPresence Component
 * Handles enter/exit animations for conditionally rendered content
 */
export function AnimatedPresence({ children }: AnimatedPresenceProps) {
  return <FramerAnimatePresence mode="wait">{children}</FramerAnimatePresence>;
}
