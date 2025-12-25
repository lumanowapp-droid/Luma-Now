/**
 * Touchable Primitive - React Native Implementation
 * Uses Pressable with optional haptic feedback
 */

import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { TouchableProps, getTouchableBaseProps, MIN_TAP_TARGET } from './Touchable';

// Haptic feedback - will be implemented in Epic 8
// For now, this is a placeholder
const triggerHaptic = async (type: string) => {
  // TODO: Implement in Epic 8 with expo-haptics
  // import * as Haptics from 'expo-haptics';
  console.log(`Haptic feedback: ${type}`);
};

export const Touchable: React.FC<TouchableProps> = (props) => {
  const {
    children,
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
    style,
    hapticFeedback = 'medium',
  } = props;

  const baseProps = getTouchableBaseProps(props);

  const handlePress = () => {
    if (hapticFeedback && !baseProps.disabled) {
      triggerHaptic(hapticFeedback);
    }
    onPress?.();
  };

  const handlePressIn = () => {
    onPressIn?.();
  };

  const handlePressOut = () => {
    onPressOut?.();
  };

  const pressableStyle = StyleSheet.flatten([
    {
      minWidth: MIN_TAP_TARGET,
      minHeight: MIN_TAP_TARGET,
      alignItems: 'center',
      justifyContent: 'center',
    },
    style,
  ]);

  return (
    <Pressable
      style={({ pressed }) => [
        pressableStyle,
        pressed && { opacity: baseProps.activeOpacity },
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={onLongPress}
      disabled={baseProps.disabled}
      accessible={true}
      accessibilityLabel={baseProps.accessibilityLabel}
      accessibilityHint={baseProps.accessibilityHint}
      accessibilityRole={baseProps.accessibilityRole}
      testID={baseProps.testID}
    >
      {children}
    </Pressable>
  );
};
