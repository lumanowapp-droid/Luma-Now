/**
 * Button Component - React Native Implementation
 * Uses Pressable with haptic feedback
 */

import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { ButtonProps, getButtonStyles } from './Button';

// Haptic feedback placeholder - will be implemented in Epic 8
const triggerHaptic = async (type: string) => {
  // TODO: Implement in Epic 8 with expo-haptics
  console.log(`Haptic feedback: ${type}`);
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  hapticFeedback = true,
  accessibilityLabel,
  testID,
  style,
}) => {
  const baseStyles = getButtonStyles(variant, size, disabled || loading, fullWidth);

  const handlePress = () => {
    if (hapticFeedback && !disabled && !loading) {
      triggerHaptic('medium');
    }
    onPress?.();
  };

  const buttonStyle = StyleSheet.flatten([
    {
      paddingVertical: baseStyles.paddingVertical,
      paddingHorizontal: baseStyles.paddingHorizontal,
      backgroundColor: baseStyles.backgroundColor,
      borderRadius: baseStyles.borderRadius,
      borderWidth: baseStyles.borderWidth || 0,
      borderColor: baseStyles.borderColor,
      minHeight: baseStyles.minHeight,
      width: fullWidth ? '100%' : 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      opacity: baseStyles.opacity,
    },
    style,
  ]);

  const textStyle = {
    color: baseStyles.color,
    fontSize: baseStyles.fontSize,
    fontWeight: baseStyles.fontWeight,
    fontFamily: baseStyles.fontFamily,
    textAlign: 'center' as const,
  };

  const content = loading ? (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ActivityIndicator
        size="small"
        color={baseStyles.color}
        style={{ marginRight: 8 }}
      />
      <Text style={textStyle}>{children}</Text>
    </View>
  ) : (
    <Text style={textStyle}>{children}</Text>
  );

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyle,
        pressed && !disabled && !loading && { opacity: 0.7 },
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID}
    >
      {content}
    </Pressable>
  );
};
