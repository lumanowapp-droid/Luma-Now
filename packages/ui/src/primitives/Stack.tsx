/**
 * Stack Primitive Component
 * Vertical/horizontal layout with consistent spacing
 *
 * Features:
 * - Consistent spacing from design tokens
 * - No manual margin management
 * - Flexbox-based layout
 * - Alignment control
 */

import React from 'react';
import { spacing } from '../tokens/spacing';

export type StackDirection = 'vertical' | 'horizontal';
export type StackSpacing = keyof typeof spacing;
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';

export interface StackProps {
  children: React.ReactNode;
  direction?: StackDirection;
  spacing?: StackSpacing;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  style?: any;
  testID?: string;
}

/**
 * Get stack base styles
 */
export const getStackStyles = (
  direction: StackDirection = 'vertical',
  spacingKey: StackSpacing = 'md',
  align: StackAlign = 'stretch',
  justify: StackJustify = 'start',
  wrap: boolean = false
) => {
  const isVertical = direction === 'vertical';
  const gap = spacing[spacingKey];

  // Map alignment to flexbox values
  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  };

  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    'space-between': 'space-between',
    'space-around': 'space-around',
    'space-evenly': 'space-evenly',
  };

  return {
    display: 'flex' as const,
    flexDirection: isVertical ? ('column' as const) : ('row' as const),
    gap,
    alignItems: alignMap[align],
    justifyContent: justifyMap[justify],
    flexWrap: wrap ? ('wrap' as const) : ('nowrap' as const),
  };
};

// Platform detection
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

// Import platform-specific implementations
let WebStack: React.ComponentType<StackProps>;

if (isWeb) {
  WebStack = require('./Stack.web').Stack;
}

/**
 * Cross-platform Stack component
 */
export const Stack: React.FC<StackProps> = (props) => {
  return <WebStack {...props} />;
};
