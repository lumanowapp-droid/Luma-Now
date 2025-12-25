/**
 * React Native Swipeable Implementation
 *
 * Uses react-native-gesture-handler for smooth, native gesture handling
 * with haptic feedback on swipe actions.
 *
 * ADHD-Critical: Swipe gestures create muscle memory patterns,
 * reducing cognitive load compared to visual search for buttons.
 */

import React, { useRef } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { haptic } from '@multi-platform-app/core/src/haptics';
import type { SwipeableProps } from './Swipeable';

const DEFAULT_SWIPE_THRESHOLD = 100;

export const Swipeable: React.FC<SwipeableProps> = ({
  onSwipeRight,
  onSwipeLeft,
  children,
  swipeThreshold = DEFAULT_SWIPE_THRESHOLD,
  enabled = true,
  rightActionColor = '#7A9B8E',
  leftActionColor = '#C89B5C',
  rightActionLabel = 'Complete',
  leftActionLabel = 'Delete',
}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const handleSwipeRight = async () => {
    await haptic('success');
    onSwipeRight?.();
  };

  const handleSwipeLeft = async () => {
    await haptic('warning');
    onSwipeLeft?.();
  };

  const panGesture = Gesture.Pan()
    .enabled(enabled)
    .onUpdate(event => {
      // Only allow swipe in direction that has a handler
      if (event.translationX > 0 && onSwipeRight) {
        translateX.setValue(event.translationX);
      } else if (event.translationX < 0 && onSwipeLeft) {
        translateX.setValue(event.translationX);
      }
    })
    .onEnd(event => {
      // Check if swipe threshold met
      if (event.translationX > swipeThreshold && onSwipeRight) {
        runOnJS(handleSwipeRight)();
      } else if (event.translationX < -swipeThreshold && onSwipeLeft) {
        runOnJS(handleSwipeLeft)();
      }

      // Animate back to center
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6, // Calm bounce, not aggressive
      }).start();
    });

  // Calculate opacity based on swipe distance
  const rightActionOpacity = translateX.interpolate({
    inputRange: [0, swipeThreshold],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const leftActionOpacity = translateX.interpolate({
    inputRange: [-swipeThreshold, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Right action background (swipe right to reveal) */}
      {onSwipeRight && (
        <Animated.View
          style={[
            styles.actionBackground,
            styles.rightAction,
            { backgroundColor: rightActionColor, opacity: rightActionOpacity },
          ]}
        >
          <Text style={styles.actionLabel}>{rightActionLabel}</Text>
        </Animated.View>
      )}

      {/* Left action background (swipe left to reveal) */}
      {onSwipeLeft && (
        <Animated.View
          style={[
            styles.actionBackground,
            styles.leftAction,
            { backgroundColor: leftActionColor, opacity: leftActionOpacity },
          ]}
        >
          <Text style={styles.actionLabel}>{leftActionLabel}</Text>
        </Animated.View>
      )}

      {/* Main content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={{
            transform: [{ translateX }],
          }}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  actionBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  rightAction: {
    left: 0,
    alignItems: 'flex-start',
  },
  leftAction: {
    right: 0,
    alignItems: 'flex-end',
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
