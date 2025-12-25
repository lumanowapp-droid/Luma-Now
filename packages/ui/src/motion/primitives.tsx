/**
 * Motion Primitives - Platform-agnostic interface
 * Implementation provided by .web.tsx and .native.tsx files
 */

import { ReactNode } from 'react';

/**
 * Base animation props shared by all motion primitives
 */
export interface BaseAnimationProps {
  /** Child elements to animate */
  children: ReactNode;
  /** Animation duration in milliseconds (overrides preset) */
  duration?: number;
  /** Animation delay in milliseconds */
  delay?: number;
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
}

/**
 * FadeIn/FadeOut Props
 */
export interface FadeProps extends BaseAnimationProps {
  /** Initial opacity (default: 0 for FadeIn, 1 for FadeOut) */
  from?: number;
  /** Final opacity (default: 1 for FadeIn, 0 for FadeOut) */
  to?: number;
}

/**
 * Slide Props
 */
export interface SlideProps extends BaseAnimationProps {
  /** Direction of slide */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Distance to slide in pixels (default: 20) */
  distance?: number;
}

/**
 * Scale Props
 */
export interface ScaleProps extends BaseAnimationProps {
  /** Initial scale (default: 0.95) */
  from?: number;
  /** Final scale (default: 1) */
  to?: number;
}

/**
 * Collapse Props
 */
export interface CollapseProps extends BaseAnimationProps {
  /** Whether the content is visible */
  isOpen: boolean;
}

/**
 * FadeIn Component
 * Gentle opacity animation from 0 to 1
 */
export function FadeIn(props: FadeProps): JSX.Element {
  throw new Error('FadeIn must be implemented by platform-specific file');
}

/**
 * FadeOut Component
 * Gentle opacity animation from 1 to 0
 */
export function FadeOut(props: FadeProps): JSX.Element {
  throw new Error('FadeOut must be implemented by platform-specific file');
}

/**
 * SlideIn Component
 * Directional entrance animation
 */
export function SlideIn(props: SlideProps): JSX.Element {
  throw new Error('SlideIn must be implemented by platform-specific file');
}

/**
 * SlideOut Component
 * Directional exit animation
 */
export function SlideOut(props: SlideProps): JSX.Element {
  throw new Error('SlideOut must be implemented by platform-specific file');
}

/**
 * ScaleIn Component
 * Subtle grow animation
 */
export function ScaleIn(props: ScaleProps): JSX.Element {
  throw new Error('ScaleIn must be implemented by platform-specific file');
}

/**
 * ScaleOut Component
 * Subtle shrink animation
 */
export function ScaleOut(props: ScaleProps): JSX.Element {
  throw new Error('ScaleOut must be implemented by platform-specific file');
}

/**
 * Collapse Component
 * Height animation for showing/hiding content
 */
export function Collapse(props: CollapseProps): JSX.Element {
  throw new Error('Collapse must be implemented by platform-specific file');
}

/**
 * AnimatedPresence Component
 * Handles enter/exit animations for conditionally rendered content
 */
export interface AnimatedPresenceProps {
  children: ReactNode;
}

export function AnimatedPresence(props: AnimatedPresenceProps): JSX.Element {
  throw new Error('AnimatedPresence must be implemented by platform-specific file');
}
