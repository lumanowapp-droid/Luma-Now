/**
 * Text Primitive - Web Implementation
 * Uses standard HTML and CSS for web platform
 */

import React from 'react';
import { TextProps, getTextBaseStyles, getVariantStyles } from './Text';

// Re-export utility functions for web builds
export { getTextBaseStyles, getVariantStyles };

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  children,
  style,
  numberOfLines,
  selectable = true,
  testID,
}) => {
  // No styling for basic pages
  const webStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    userSelect: selectable ? 'text' : 'none',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    ...(numberOfLines && {
      display: '-webkit-box',
      WebkitLineClamp: numberOfLines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
    ...style,
  };

  // Use semantic HTML elements based on variant
  const Component = variant === 'display' || variant === 'heading' ? 'h1' : 'p';

  return (
    <Component style={webStyle} data-testid={testID}>
      {children}
    </Component>
  );
};
