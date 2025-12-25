/**
 * Toggle Primitive - Web Implementation
 * Uses checkbox input with custom styling
 */

import React from 'react';
import { ToggleProps, getToggleTrackStyles, getToggleThumbStyles } from './Toggle';
import { duration, easing } from '../tokens/motion';
import { Text } from './Text.web';
import { Stack } from './Stack.web';

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  disabled = false,
  label,
  testID,
}) => {
  // No styling for basic pages
  const trackStyle: React.CSSProperties = {
    position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `background-color ${duration.normal}ms ${easing.calm.join(',')}`,
    padding: 2,
    display: 'flex',
    alignItems: 'center',
  };

  const thumbStyle: React.CSSProperties = {
    transform: value ? 'translateX(20px)' : 'translateX(0)',
    transition: `transform ${duration.normal}ms ${easing.calm.join(',')}`,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const content = (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
      }}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onValueChange(e.target.checked)}
        disabled={disabled}
        data-testid={testID}
        style={{ display: 'none' }}
        aria-label={label}
      />
      <div style={trackStyle}>
        <div style={thumbStyle} />
      </div>
    </label>
  );

  if (label) {
    return (
      <Stack direction="horizontal" spacing="sm" align="center">
        {content}
        <Text variant="body">{label}</Text>
      </Stack>
    );
  }

  return content;
};
