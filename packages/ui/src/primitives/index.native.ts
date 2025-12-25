/**
 * Primitives Index (React Native version)
 *
 * This file exports React Native-specific components.
 * Metro bundler will use this file instead of index.ts when running on React Native.
 */

// Export types from base files
export type { TextProps, TextVariant } from './Text';
export { getTextBaseStyles } from './Text';
export type { TouchableProps, HapticType } from './Touchable';
export type { SurfaceProps, SurfaceElevation, SurfaceVariant } from './Surface';
export type { StackProps, StackDirection, StackSpacing, StackAlign, StackJustify } from './Stack';
export type { SpacerProps, SpacerSize, SpacerDirection } from './Spacer';
export type { TextFieldProps } from './TextField';
export type { ModalProps } from './Modal';
export type { ToggleProps } from './Toggle';

// Export React Native components
export { Text } from './Text.native';
export { Touchable } from './Touchable.native';
export { Surface } from './Surface.native';
export { Stack } from './Stack.native';
export { Spacer } from './Spacer.native';
export { TextField } from './TextField.native';
export { Modal } from './Modal.native';
export { Toggle } from './Toggle.native';
