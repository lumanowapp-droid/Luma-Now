/**
 * Spacer Primitive Component
 * Explicit whitespace (better than margin)
 *
 * Features:
 * - Consistent spacing from design tokens
 * - Responsive sizing
 * - Direction-aware (horizontal or vertical)
 */

import React from 'react';
import { getSpacerStyles, SpacerSize, SpacerDirection } from './Spacer/styles';

export { getSpacerStyles } from './Spacer/styles';
export type { SpacerSize, SpacerDirection } from './Spacer/styles';

export interface SpacerProps {
  size?: SpacerSize;
  direction?: SpacerDirection;
  testID?: string;
}

// Platform detection
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

// Import platform-specific implementations
let WebSpacer: React.ComponentType<SpacerProps>;

if (isWeb) {
  WebSpacer = require('./Spacer.web').Spacer;
}

/**
 * Cross-platform Spacer component
 */
export const Spacer: React.FC<SpacerProps> = (props) => {
  return <WebSpacer {...props} />;
};
