/**
 * Primitives Index
 * Exports all primitive components with platform-specific implementations
 *
 * Note: For web builds, we export the .web implementations directly.
 * React Native projects will need to configure their bundler to resolve
 * .native extensions over .web extensions.
 */

// Export types and functions from base files
export type { TextProps, TextVariant } from './Text';
export { getTextBaseStyles, getVariantStyles } from './Text';
export type { TouchableProps, HapticType } from './Touchable';
export type { SurfaceProps, SurfaceElevation, SurfaceVariant } from './Surface';
export type { StackProps, StackDirection, StackSpacing, StackAlign, StackJustify } from './Stack';
export type { SpacerProps, SpacerSize, SpacerDirection } from './Spacer';
export type { TextFieldProps } from './TextField';
export type { ModalProps } from './Modal';
export type { ToggleProps } from './Toggle';

// Export components - main implementations with platform detection
export { Text } from './Text';
export { Touchable } from './Touchable.web';
export { Surface } from './Surface.web';
export { Stack } from './Stack.web';
export { Spacer } from './Spacer.web';
export { TextField } from './TextField.web';
export { Modal } from './Modal.web';
export { Toggle } from './Toggle.web';
