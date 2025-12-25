/**
 * Surface Primitive - React Native Implementation
 * Uses View with shadow props
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SurfaceProps, getSurfaceStyles } from './Surface';
import { shadows } from '../tokens/shadows';

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
  const baseStyles = getSurfaceStyles(elevation, variant, backgroundColor, radius);

  const nativeStyle = StyleSheet.flatten([
    baseStyles,
    elevation > 0 && shadows[elevation],
    padding !== undefined && { padding: typeof padding === 'number' ? padding : 0 },
    style,
  ]);

  return (
    <View style={nativeStyle} testID={testID}>
      {children}
    </View>
  );
};
