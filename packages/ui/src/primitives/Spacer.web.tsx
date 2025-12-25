/**
 * Spacer Primitive - Web Implementation
 * Uses div with specified dimensions
 */

import React from 'react';
import type { SpacerProps } from './Spacer';
import { getSpacerStyles } from './Spacer/styles';

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  testID,
}) => {
  const baseStyles = getSpacerStyles(size, direction);

  const webStyle: React.CSSProperties = {
    ...baseStyles,
    pointerEvents: 'none',
  };

  return <div style={webStyle} data-testid={testID} aria-hidden="true" />;
};