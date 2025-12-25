/**
 * Web Swipeable Implementation
 *
 * Graceful degradation for web - no swipe gestures.
 * On web, users will use click/tap actions instead.
 */

import React from 'react';
import type { SwipeableProps } from './Swipeable';

/**
 * Web version - no swipe gestures
 * Just renders children as-is
 */
export const Swipeable: React.FC<SwipeableProps> = ({ children }) => {
  return <>{children}</>;
};
