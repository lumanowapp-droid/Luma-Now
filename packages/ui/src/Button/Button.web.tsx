/**
 * Button Component - Web Implementation
 * Uses button element with calm interactions
 */

import React, { useState } from 'react';
import { ButtonProps, getButtonStyles } from '.';
import { duration, easing } from '../tokens/motion';
import { focusRingCSS } from '../tokens/shadows';

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  accessibilityLabel,
  testID,
  style,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const baseStyles = getButtonStyles(variant, size, disabled || loading, fullWidth);

  const buttonStyle: React.CSSProperties = {
    ...baseStyles,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: baseStyles.borderWidth && (baseStyles as any).borderColor
      ? `${baseStyles.borderWidth}px solid ${(baseStyles as any).borderColor}`
      : 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    outline: 'none',
    transition: `all ${duration.normal}ms ${easing.calm.join(',')}`,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    userSelect: 'none',
    opacity: isPressed && !disabled && !loading ? 0.7 : baseStyles.opacity,
    ...style,
  };

  const loadingSpinner = loading ? (
    <span
      style={{
        display: 'inline-block',
        width: 16,
        height: 16,
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
        marginRight: 8,
      }}
    />
  ) : null;

  // Add CSS animation for spinner
  if (typeof document !== 'undefined' && loading) {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    if (!document.head.querySelector('style[data-button-animations]')) {
      style.setAttribute('data-button-animations', 'true');
      document.head.appendChild(style);
    }
  }

  return (
    <button
      type="button"
      style={buttonStyle}
      onClick={onPress}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled || loading}
      aria-label={accessibilityLabel}
      data-testid={testID}
      onFocus={(e) => {
        if (!disabled && !loading) {
          e.target.style.boxShadow = focusRingCSS;
        }
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = 'none';
      }}
    >
      {loadingSpinner}
      {children}
    </button>
  );
};
