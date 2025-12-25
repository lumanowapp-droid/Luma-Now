/**
 * TextField Primitive - React Native Implementation
 * Uses TextInput with multiline support
 */

import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { TextFieldProps, getTextFieldStyles } from './TextField';
import { Text } from './Text';
import { baseColors } from '../tokens/colors';
import { fontSizes } from '../tokens/typography';

export const TextField: React.FC<TextFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  multiline = true,
  autoGrow = true,
  maxLength,
  showCharacterCount = false,
  disabled = false,
  error,
  label,
  autoFocus = false,
  testID,
  style,
}) => {
  const hasError = !!error;
  const baseStyles = getTextFieldStyles(disabled, hasError);

  const nativeStyle = StyleSheet.flatten([
    baseStyles,
    {
      textAlignVertical: 'top' as const,
      includeFontPadding: false,
    },
    style,
  ]);

  const characterCount = showCharacterCount && maxLength ? (
    <Text
      variant="caption"
      color={baseColors.textMuted}
      style={{ textAlign: 'right', marginTop: 4 }}
    >
      {value.length}/{maxLength}
    </Text>
  ) : null;

  return (
    <View style={{ width: '100%' }}>
      {label && (
        <Text
          variant="label"
          color={baseColors.textPrimary}
          style={{ marginBottom: 8 }}
        >
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={baseColors.textMuted}
        multiline={multiline}
        maxLength={maxLength}
        editable={!disabled}
        autoFocus={autoFocus}
        testID={testID}
        style={nativeStyle}
        scrollEnabled={!autoGrow}
        returnKeyType="default"
        blurOnSubmit={false}
        underlineColorAndroid="transparent"
      />
      {error && (
        <Text
          variant="caption"
          color={baseColors.textMuted}
          style={{ marginTop: 4 }}
        >
          {error}
        </Text>
      )}
      {characterCount}
    </View>
  );
};
