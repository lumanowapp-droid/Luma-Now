/**
 * ProcessingDots component
 * ADHD-friendly loading indicator - 3 animated dots, not a spinner
 * Respects prefers-reduced-motion
 */

'use client';

import React, { useEffect, useState } from 'react';
import { processingDotsConfig } from '../../tokens/motion';
import { useReducedMotion } from '../../motion/hooks';

export interface ProcessingDotsProps {
  /** Custom className for styling */
  className?: string;
  /** Color of the dots (default: currentColor) */
  color?: string;
  /** Size of each dot in pixels (default: 8) */
  size?: number;
  /** Spacing between dots in pixels (default: 4) */
  spacing?: number;
}

/**
 * ProcessingDots Component
 * Shows 3 dots that fade in/out in sequence
 * When reduced motion is preferred, shows static dots
 */
export function ProcessingDots({
  className = '',
  color = 'currentColor',
  size = 8,
  spacing = 4,
}: ProcessingDotsProps) {
  const shouldReduce = useReducedMotion();
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    if (shouldReduce) return;

    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % processingDotsConfig.dotCount);
    }, processingDotsConfig.duration);

    return () => clearInterval(interval);
  }, [shouldReduce]);

  const dots = Array.from({ length: processingDotsConfig.dotCount });

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ gap: spacing }}
      role="status"
      aria-label="Processing"
    >
      {dots.map((_, index) => (
        <div
          key={index}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: shouldReduce ? 0.6 : activeDot === index ? 1 : 0.3,
            transition: shouldReduce
              ? 'none'
              : `opacity ${processingDotsConfig.duration}ms ease-in-out`,
          }}
        />
      ))}
      <span className="sr-only">Processing...</span>
    </div>
  );
}

/**
 * ProcessingText Component
 * Text with animated dots suffix (e.g., "Loading...")
 */
export interface ProcessingTextProps {
  /** The text to display */
  text: string;
  /** Color of the dots (default: currentColor) */
  color?: string;
  /** Custom className for styling */
  className?: string;
}

export function ProcessingText({
  text,
  color,
  className = '',
}: ProcessingTextProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span>{text}</span>
      <ProcessingDots color={color} size={4} spacing={4} />
    </div>
  );
}
