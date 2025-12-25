/**
 * Surface Primitive - Web Implementation
 * Uses div with CSS box-shadow
 */

import React from 'react';
import { SurfaceProps } from './Surface';
import { shadowsCSS } from '../tokens/shadows';

export const Surface: React.FC<SurfaceProps> = ({
  children,
  elevation = 0,
  variant = 'default',
  backgroundColor,
  padding,
  radius = 'md',
  style,
  testID,
}) => {
  // No styling for basic pages
  const webStyle: React.CSSProperties = {
    boxShadow: elevation > 0 ? shadowsCSS[elevation] : 'none',
    ...(padding !== undefined && {
      padding: typeof padding === 'number' ? `${padding}px` : padding,
    }),
    ...style,
  };

  return (
    <div style={webStyle} data-testid={testID}>
      {children}
    </div>
  );
};
