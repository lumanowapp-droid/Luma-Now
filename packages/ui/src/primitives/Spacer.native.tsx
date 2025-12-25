/**
 * Spacer Primitive - React Native Implementation
 * Uses View with specified dimensions
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SpacerProps, getSpacerStyles } from './Spacer';

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  testID,
}) => {
  const baseStyles = getSpacerStyles(size, direction);

  const nativeStyle = StyleSheet.flatten([baseStyles]);

  return (
    <View
      style={nativeStyle}
      testID={testID}
      accessible={false}
      pointerEvents="none"
    />
  );
};
