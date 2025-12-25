/**
 * Toggle Primitive - React Native Implementation
 * Uses React Native Switch component
 */

import React from 'react';
import { Switch, View, StyleSheet } from 'react-native';
import { ToggleProps, getToggleTrackStyles } from './Toggle';
import { semanticColors, baseColors } from '../tokens/colors';
import { Text } from './Text';
import { Stack } from './Stack';

// Haptic feedback - placeholder for Epic 8
const triggerHaptic = async (type: string) => {
  // TODO: Implement in Epic 8 with expo-haptics
  console.log(`Haptic feedback: ${type}`);
};

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  disabled = false,
  label,
  hapticFeedback = true,
  testID,
}) => {
  const trackStyles = getToggleTrackStyles(value, disabled);

  const handleValueChange = (newValue: boolean) => {
    if (hapticFeedback && !disabled) {
      triggerHaptic('light');
    }
    onValueChange(newValue);
  };

  const switchComponent = (
    <Switch
      value={value}
      onValueChange={handleValueChange}
      disabled={disabled}
      testID={testID}
      trackColor={{
        false: baseColors.border,
        true: semanticColors.success,
      }}
      thumbColor={baseColors.surface}
      ios_backgroundColor={baseColors.border}
    />
  );

  if (label) {
    return (
      <Stack direction="horizontal" spacing="sm" align="center">
        {switchComponent}
        <Text variant="body">{label}</Text>
      </Stack>
    );
  }

  return switchComponent;
};
