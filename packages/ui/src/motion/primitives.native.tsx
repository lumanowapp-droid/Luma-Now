/**
 * Motion Primitives - Native Implementation (React Native Reanimated)
 * Calm, purposeful animations that respect AccessibilityInfo.isReduceMotionEnabled
 */

import { useEffect } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { duration, easing } from '../tokens/motion';
import { useReducedMotion } from './hooks';
import type {
  FadeProps,
  SlideProps,
  ScaleProps,
  CollapseProps,
  AnimatedPresenceProps,
} from './primitives';

/**
 * Convert easing array to Reanimated Easing
 */
const getEasing = (easingArray: readonly number[]) => {
  return Easing.bezier(easingArray[0], easingArray[1], easingArray[2], easingArray[3]);
};

/**
 * FadeIn Component
 * Gentle opacity animation from 0 to 1
 */
export function FadeIn({
  children,
  duration: customDuration,
  delay = 0,
  from = 0,
  to = 1,
  onAnimationComplete,
}: FadeProps) {
  const shouldReduce = useReducedMotion();
  const opacity = useSharedValue(from);

  useEffect(() => {
    const animationDuration = shouldReduce ? 0 : (customDuration ?? duration.normal);
    const animationDelay = shouldReduce ? 0 : delay;

    opacity.value = withDelay(
      animationDelay,
      withTiming(to, {
        duration: animationDuration,
        easing: getEasing(easing.calm),
      }, () => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      })
    );
  }, [from, to, customDuration, delay, shouldReduce]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * FadeOut Component
 * Gentle opacity animation from 1 to 0
 */
export function FadeOut({
  children,
  duration: customDuration,
  delay = 0,
  from = 1,
  to = 0,
  onAnimationComplete,
}: FadeProps) {
  const shouldReduce = useReducedMotion();
  const opacity = useSharedValue(from);

  useEffect(() => {
    const animationDuration = shouldReduce ? 0 : (customDuration ?? duration.normal);
    const animationDelay = shouldReduce ? 0 : delay;

    opacity.value = withDelay(
      animationDelay,
      withTiming(to, {
        duration: animationDuration,
        easing: getEasing(easing.calm),
      }, () => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      })
    );
  }, [from, to, customDuration, delay, shouldReduce]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * SlideIn Component
 * Directional entrance animation
 */
export function SlideIn({
  children,
  direction = 'up',
  distance = 20,
  duration: customDuration,
  delay = 0,
  onAnimationComplete,
}: SlideProps) {
  const shouldReduce = useReducedMotion();
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(direction === 'left' ? distance : direction === 'right' ? -distance : 0);
  const translateY = useSharedValue(direction === 'up' ? distance : direction === 'down' ? -distance : 0);

  useEffect(() => {
    const animationDuration = shouldReduce ? 0 : (customDuration ?? duration.normal);
    const animationDelay = shouldReduce ? 0 : delay;

    opacity.value = withDelay(
      animationDelay,
      withTiming(1, {
        duration: animationDuration,
        easing: getEasing(easing.gentle),
      })
    );

    translateX.value = withDelay(
      animationDelay,
      withTiming(0, {
        duration: animationDuration,
        easing: getEasing(easing.gentle),
      })
    );

    translateY.value = withDelay(
      animationDelay,
      withTiming(0, {
        duration: animationDuration,
        easing: getEasing(easing.gentle),
      }, () => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      })
    );
  }, [direction, distance, customDuration, delay, shouldReduce]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * SlideOut Component
 * Directional exit animation
 */
export function SlideOut({
  children,
  direction = 'down',
  distance = 20,
  duration: customDuration,
  delay = 0,
  onAnimationComplete,
}: SlideProps) {
  const shouldReduce = useReducedMotion();
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const animationDuration = shouldReduce ? 0 : (customDuration ?? duration.normal);
    const animationDelay = shouldReduce ? 0 : delay;

    opacity.value = withDelay(
      animationDelay,
      withTiming(0, {
        duration: animationDuration,
        easing: getEasing(easing.gentle),
      })
    );

    const finalX = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
    const finalY = direction === 'up' ? -distance : direction === 'down' ? distance : 0;

    translateX.value = withDelay(
      animationDelay,
      withTiming(finalX, {
        duration: animationDuration,
        easing: getEasing(easing.gentle),
      })
    );

    translateY.value = withDelay(
      animationDelay,
      withTiming(finalY, {
        duration: animationDuration,
        easing: getEasing(easing.gentle),
      }, () => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      })
    );
  }, [direction, distance, customDuration, delay, shouldReduce]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * ScaleIn Component
 * Subtle grow animation
 */
export function ScaleIn({
  children,
  from = 0.95,
  to = 1,
  duration: customDuration,
  delay = 0,
  onAnimationComplete,
}: ScaleProps) {
  const shouldReduce = useReducedMotion();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(from);

  useEffect(() => {
    const animationDuration = shouldReduce ? 0 : (customDuration ?? duration.fast);
    const animationDelay = shouldReduce ? 0 : delay;

    opacity.value = withDelay(
      animationDelay,
      withTiming(1, {
        duration: animationDuration,
        easing: getEasing(easing.calm),
      })
    );

    scale.value = withDelay(
      animationDelay,
      withTiming(to, {
        duration: animationDuration,
        easing: getEasing(easing.calm),
      }, () => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      })
    );
  }, [from, to, customDuration, delay, shouldReduce]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * ScaleOut Component
 * Subtle shrink animation
 */
export function ScaleOut({
  children,
  from = 1,
  to = 0.95,
  duration: customDuration,
  delay = 0,
  onAnimationComplete,
}: ScaleProps) {
  const shouldReduce = useReducedMotion();
  const opacity = useSharedValue(1);
  const scale = useSharedValue(from);

  useEffect(() => {
    const animationDuration = shouldReduce ? 0 : (customDuration ?? duration.fast);
    const animationDelay = shouldReduce ? 0 : delay;

    opacity.value = withDelay(
      animationDelay,
      withTiming(0, {
        duration: animationDuration,
        easing: getEasing(easing.calm),
      })
    );

    scale.value = withDelay(
      animationDelay,
      withTiming(to, {
        duration: animationDuration,
        easing: getEasing(easing.calm),
      }, () => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      })
    );
  }, [from, to, customDuration, delay, shouldReduce]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * Collapse Component
 * Height animation for showing/hiding content
 */
export function Collapse({
  children,
  isOpen,
  duration: customDuration,
  delay = 0,
  onAnimationComplete,
}: CollapseProps) {
  const shouldReduce = useReducedMotion();
  const opacity = useSharedValue(isOpen ? 1 : 0);
  const height = useSharedValue(isOpen ? 1 : 0);

  useEffect(() => {
    const animationDuration = shouldReduce ? 0 : (customDuration ?? duration.slow);
    const animationDelay = shouldReduce ? 0 : delay;

    opacity.value = withDelay(
      animationDelay,
      withTiming(isOpen ? 1 : 0, {
        duration: animationDuration,
        easing: getEasing(easing.gentle),
      })
    );

    height.value = withDelay(
      animationDelay,
      withTiming(isOpen ? 1 : 0, {
        duration: animationDuration,
        easing: getEasing(easing.gentle),
      }, () => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      })
    );
  }, [isOpen, customDuration, delay, shouldReduce]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    height: height.value === 0 ? 0 : 'auto',
    overflow: 'hidden',
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * AnimatedPresence Component
 * Simple wrapper for native - Reanimated handles presence automatically
 */
export function AnimatedPresence({ children }: AnimatedPresenceProps) {
  return <>{children}</>;
}
