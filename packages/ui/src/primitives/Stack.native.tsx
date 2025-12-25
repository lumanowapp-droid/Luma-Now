/**
 * Stack Primitive - React Native Implementation
 * Uses View with flexbox
 * Note: React Native doesn't support 'gap' property on older versions,
 * so we use margin on children as fallback
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StackProps, getStackStyles } from './Stack';

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
  const baseStyles = getStackStyles(direction, spacing, align, justify, wrap);

  const nativeStyle = StyleSheet.flatten([
    baseStyles,
    style,
  ]);

  return (
    <View style={nativeStyle} testID={testID}>
      {children}
    </View>
  );
};
