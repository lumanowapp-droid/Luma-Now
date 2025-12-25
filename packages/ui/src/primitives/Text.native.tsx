/**
 * Text Primitive - React Native Implementation
 * Uses React Native Text component
 */

import React from 'react';
import { Text as RNText, StyleSheet, Platform } from 'react-native';
import type { TextProps } from './Text';
import { getTextBaseStyles } from './Text';

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  children,
  color,
  weight,
  align,
  style,
  numberOfLines,
  selectable = true,
  testID,
}) => {
  const baseStyles = getTextBaseStyles(variant, color, weight, align);

  const nativeStyle = StyleSheet.flatten([
    baseStyles,
    {
      includeFontPadding: false, // Android: remove extra padding
      textAlignVertical: 'center', // Android: vertical alignment
    },
    style,
  ]);

  return (
    <RNText
      style={nativeStyle}
      numberOfLines={numberOfLines}
      selectable={selectable}
      testID={testID}
      allowFontScaling={true}
      maxFontSizeMultiplier={1.3}
    >
      {children}
    </RNText>
  );
};
