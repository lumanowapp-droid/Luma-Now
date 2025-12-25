/**
 * Stack Primitive - Web Implementation
 * Uses div with flexbox and gap
 */

import React from 'react';
import { StackProps } from './Stack';

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  style,
  testID,
}) => {
  // No styling for basic pages
  const webStyle: React.CSSProperties = {
    ...style,
  };

  return (
    <div style={webStyle} data-testid={testID}>
      {children}
    </div>
  );
};
