/**
 * Swipeable Gesture Component
 *
 * Universal swipe gesture handler with haptic feedback.
 * Platform-specific implementations for web and native.
 *
 * ADHD-Critical: Gestures reduce cognitive load - muscle memory
 * instead of visual search. Swipe-to-complete is faster than
 * finding and tapping a checkbox.
 */

import React from 'react';

export interface SwipeableProps {
  children: React.ReactNode;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  swipeThreshold?: number;
  enabled?: boolean;
  rightActionColor?: string;
  leftActionColor?: string;
  rightActionLabel?: string;
  leftActionLabel?: string;
}

/**
 * Swipeable wrapper component
 * Platform-specific implementation loaded automatically
 *
 * @example
 * ```typescript
 * <Swipeable
 *   onSwipeRight={() => completeTask(task.id)}
 *   onSwipeLeft={() => deleteTask(task.id)}
 *   rightActionLabel="Complete"
 *   leftActionLabel="Delete"
 * >
 *   <TaskCard task={task} />
 * </Swipeable>
 * ```
 */
export const Swipeable: React.FC<SwipeableProps> = ({ children }) => {
  // Base implementation - will be overridden by platform-specific files
  return <>{children}</>;
};
