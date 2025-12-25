/**
 * Primitives Index (Web version)
 *
 * This file exports web-specific components.
 * For React Native, there should be an index.native.tsx file that exports .native components.
 */

// Export web-specific components and their utilities
export { Text, getTextBaseStyles, getVariantStyles } from './Text.web';
export { Touchable } from './Touchable.web';
export { Surface } from './Surface.web';
export { Stack } from './Stack.web';
export { Spacer } from './Spacer.web';
export { TextField } from './TextField.web';
export { Modal } from './Modal.web';
export { Toggle } from './Toggle.web';

// Types (from base files)
export type { TextProps, TextVariant } from './Text';
export type { TouchableProps, HapticType } from './Touchable';
export type { SurfaceProps, SurfaceElevation, SurfaceVariant } from './Surface';
export type { StackProps, StackDirection, StackSpacing, StackAlign, StackJustify } from './Stack';
export type { SpacerProps, SpacerSize, SpacerDirection } from './Spacer';
export type { TextFieldProps } from './TextField';
export type { ModalProps } from './Modal';
export type { ToggleProps } from './Toggle';
