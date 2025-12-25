/**
 * Touchable Primitive - Web Implementation
 * Uses button element with accessibility best practices
 */

import React, { useState } from 'react';
import { TouchableProps } from './Touchable';

export const Touchable: React.FC<TouchableProps> = (props) => {
  const {
    children,
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
    style,
    activeOpacity = 0.7,
    disabled = false,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole,
    testID,
  } = props;

  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPressed(true);
    onPressIn?.();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsPressed(false);
    onPressOut?.();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      onPress?.();
    }
  };

  const webStyle: React.CSSProperties = {
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    minWidth: 44,
    minHeight: 44,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isPressed ? activeOpacity : 1,
    transition: 'opacity 150ms ease-out',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    ...(style as React.CSSProperties),
  };

  return (
    <button
      type="button"
      style={webStyle}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled}
      aria-label={accessibilityLabel}
      aria-describedby={accessibilityHint}
      role={accessibilityRole}
      data-testid={testID}
    >
      {children}
    </button>
  );
};
