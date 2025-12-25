/**
 * Surface Primitive Component
 * Container with elevation and background
 *
 * Features:
 * - Rounded corners (8-16px range per brief)
 * - Subtle elevation (0-2 levels only per brief)
 * - Background color variants
 * - Minimal shadows (calm design)
 */

import React from 'react';
import { baseColors } from '../tokens/colors';
import { borderRadius } from '../tokens/spacing';
import { shadows } from '../tokens/shadows';

export type SurfaceElevation = 0 | 1 | 2;
export type SurfaceVariant = 'default' | 'elevated' | 'transparent';

export interface SurfaceProps {
  children: React.ReactNode;
  elevation?: SurfaceElevation;
  variant?: SurfaceVariant;
  backgroundColor?: string;
  padding?: number | string;
  radius?: keyof typeof borderRadius;
  style?: any;
  testID?: string;
}

/**
 * Get surface styles based on elevation and variant
 */
export const getSurfaceStyles = (
  elevation: SurfaceElevation = 0,
  variant: SurfaceVariant = 'default',
  backgroundColor?: string,
  radius: keyof typeof borderRadius = 'md'
) => {
  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;
    if (variant === 'transparent') return 'transparent';
    if (variant === 'elevated') return baseColors.surfaceElevated;
    return baseColors.surface;
  };

  return {
    backgroundColor: getBackgroundColor(),
    borderRadius: borderRadius[radius],
    overflow: 'hidden' as const,
  };
};

// Platform detection
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

// Import platform-specific implementations
let WebSurface: React.ComponentType<SurfaceProps>;

if (isWeb) {
  WebSurface = require('./Surface.web').Surface;
}

/**
 * Cross-platform Surface component
 */
export const Surface: React.FC<SurfaceProps> = (props) => {
  return <WebSurface {...props} />;
};
