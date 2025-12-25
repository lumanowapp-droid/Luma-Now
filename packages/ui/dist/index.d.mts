import React, { ReactNode } from 'react';
import { fontWeights, borderRadius, spacing } from './tokens/index.mjs';
export { BaseColor, BorderRadiusKey, CategoryColor, ChartColor, Duration, Easing, FontSize, FontWeight, Platform, SemanticColor, ShadowCSSKey, ShadowKey, SpacingKey, Tokens, Transition, accentColors, backgroundTints, baseColors, categoryColors, chartColors, componentSpacing, duration, easing, easingCSS, focusRing, focusRingCSS, focusRingCSSVariants, fontSizes, fontStack, fonts, getPlatformFont, innerShadows, interactionPresets, letterSpacing, motionVariants, processingDotsConfig, semanticColors, shadows, shadowsCSS, shouldReduceMotion, spacingScale, tokens, transitions, transitionsCSS } from './tokens/index.mjs';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { Task } from '@multi-platform-app/types';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button Component - Enhanced
 * Aligned with ADHD-friendly design principles
 *
 * Features:
 * - Variants: Primary, Secondary, Ghost
 * - Loading state with haptic feedback
 * - Disabled state (clear but not harsh)
 * - Minimal tap target (44pt)
 * - Calm press states
 */

interface ButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    hapticFeedback?: boolean;
    accessibilityLabel?: string;
    testID?: string;
    style?: any;
}
/**
 * Cross-platform Button component
 */
declare const Button: React.FC<ButtonProps>;

/**
 * Text Primitive Component
 * Semantic typography with platform-aware font loading
 *
 * Features:
 * - Semantic variants: Display, Heading, Body, Label, Caption
 * - Automatic color inheritance
 * - Platform-aware font loading
 * - ADHD-friendly readability
 */

type TextVariant = 'h1' | 'h2' | 'body' | 'bodySmall' | 'labels' | 'display' | 'heading' | 'label' | 'caption';
interface TextProps {
    variant?: TextVariant;
    children: React.ReactNode;
    color?: string;
    weight?: keyof typeof fontWeights;
    align?: 'left' | 'center' | 'right';
    style?: any;
    numberOfLines?: number;
    selectable?: boolean;
    testID?: string;
}
/**
 * Get variant-specific styles
 */
declare const getVariantStyles: (variant: TextVariant) => {
    fontSize: 28;
    lineHeight: 33.6;
    fontWeight: "700";
    letterSpacing: number;
} | {
    fontSize: 22;
    lineHeight: 28.6;
    fontWeight: "600";
    letterSpacing: number;
} | {
    fontSize: 14;
    lineHeight: 21;
    fontWeight: "400";
    letterSpacing: number;
} | {
    fontSize: 12;
    lineHeight: 16.8;
    fontWeight: "400";
    letterSpacing: number;
} | {
    fontSize: 11;
    lineHeight: 11;
    fontWeight: "600";
    letterSpacing: number;
} | {
    fontSize: 32;
    lineHeight: 38.4;
    fontWeight: "300";
    letterSpacing: number;
} | {
    fontSize: 28;
    lineHeight: 33.6;
    fontWeight: "700";
    letterSpacing: number;
} | {
    fontSize: 11;
    lineHeight: 11;
    fontWeight: "600";
    letterSpacing: number;
} | {
    fontSize: 12;
    lineHeight: 16.8;
    fontWeight: "400";
    letterSpacing: number;
};
/**
 * Base Text component with shared logic
 * Platform-specific implementations are in Text.web.tsx and Text.native.tsx
 */
declare const getTextBaseStyles: (variant?: TextVariant, color?: string, weight?: keyof typeof fontWeights, align?: "left" | "center" | "right") => {
    color: string;
    fontWeight: "600" | "400" | "700" | "300" | "500";
    textAlign: "left" | "center" | "right";
    fontFamily: string;
    fontSize: 28;
    lineHeight: 33.6;
    letterSpacing: number;
} | {
    color: string;
    fontWeight: "600" | "400" | "700" | "300" | "500";
    textAlign: "left" | "center" | "right";
    fontFamily: string;
    fontSize: 22;
    lineHeight: 28.6;
    letterSpacing: number;
} | {
    color: string;
    fontWeight: "600" | "400" | "700" | "300" | "500";
    textAlign: "left" | "center" | "right";
    fontFamily: string;
    fontSize: 14;
    lineHeight: 21;
    letterSpacing: number;
} | {
    color: string;
    fontWeight: "600" | "400" | "700" | "300" | "500";
    textAlign: "left" | "center" | "right";
    fontFamily: string;
    fontSize: 12;
    lineHeight: 16.8;
    letterSpacing: number;
} | {
    color: string;
    fontWeight: "600" | "400" | "700" | "300" | "500";
    textAlign: "left" | "center" | "right";
    fontFamily: string;
    fontSize: 11;
    lineHeight: 11;
    letterSpacing: number;
} | {
    color: string;
    fontWeight: "600" | "400" | "700" | "300" | "500";
    textAlign: "left" | "center" | "right";
    fontFamily: string;
    fontSize: 32;
    lineHeight: 38.4;
    letterSpacing: number;
} | {
    color: string;
    fontWeight: "600" | "400" | "700" | "300" | "500";
    textAlign: "left" | "center" | "right";
    fontFamily: string;
    fontSize: 28;
    lineHeight: 33.6;
    letterSpacing: number;
} | {
    color: string;
    fontWeight: "600" | "400" | "700" | "300" | "500";
    textAlign: "left" | "center" | "right";
    fontFamily: string;
    fontSize: 11;
    lineHeight: 11;
    letterSpacing: number;
} | {
    color: string;
    fontWeight: "600" | "400" | "700" | "300" | "500";
    textAlign: "left" | "center" | "right";
    fontFamily: string;
    fontSize: 12;
    lineHeight: 16.8;
    letterSpacing: number;
};
/**
 * Cross-platform Text component
 */
declare const Text: React.FC<TextProps>;

/**
 * Touchable Primitive Component
 * Universal pressable with haptic feedback
 *
 * Features:
 * - 44pt minimum tap target (iOS HIG)
 * - Press states (subtle opacity change)
 * - Accessibility labels
 * - Optional haptic feedback
 * - Platform-aware interactions
 */

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error';
interface TouchableProps {
    children: React.ReactNode;
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    onLongPress?: () => void;
    disabled?: boolean;
    hapticFeedback?: HapticType | false;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    accessibilityRole?: 'button' | 'link' | 'checkbox' | 'radio';
    style?: any;
    testID?: string;
    activeOpacity?: number;
}

/**
 * Surface Primitive Component
 * Container with elevation and background
 *
 * Features:
 * - Rounded corners (8-16px range per brief)
 * - Subtle elevation (0-2 levels only per brief)
 * - Background color variants
 * - Minimal shadows (calm design)
 */

type SurfaceElevation = 0 | 1 | 2;
type SurfaceVariant = 'default' | 'elevated' | 'transparent';
interface SurfaceProps {
    children: React.ReactNode;
    elevation?: SurfaceElevation;
    variant?: SurfaceVariant;
    backgroundColor?: string;
    padding?: number | string;
    radius?: keyof typeof borderRadius;
    style?: any;
    testID?: string;
}

/**
 * Stack Primitive Component
 * Vertical/horizontal layout with consistent spacing
 *
 * Features:
 * - Consistent spacing from design tokens
 * - No manual margin management
 * - Flexbox-based layout
 * - Alignment control
 */

type StackDirection = 'vertical' | 'horizontal';
type StackSpacing = keyof typeof spacing;
type StackAlign = 'start' | 'center' | 'end' | 'stretch';
type StackJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
interface StackProps {
    children: React.ReactNode;
    direction?: StackDirection;
    spacing?: StackSpacing;
    align?: StackAlign;
    justify?: StackJustify;
    wrap?: boolean;
    style?: any;
    testID?: string;
}

type SpacerSize = keyof typeof spacing;
type SpacerDirection = 'horizontal' | 'vertical';

/**
 * Spacer Primitive Component
 * Explicit whitespace (better than margin)
 *
 * Features:
 * - Consistent spacing from design tokens
 * - Responsive sizing
 * - Direction-aware (horizontal or vertical)
 */

interface SpacerProps {
    size?: SpacerSize;
    direction?: SpacerDirection;
    testID?: string;
}

/**
 * TextField Primitive Component
 * Auto-growing multiline input with calm focus states
 *
 * Features:
 * - Auto-growing multiline input
 * - Calm focus states (no aggressive borders)
 * - Optional character count (neutral tone)
 * - Platform-aware keyboard
 * - ADHD-friendly design (clear, minimal stress)
 */

interface TextFieldProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;
    autoGrow?: boolean;
    maxLength?: number;
    showCharacterCount?: boolean;
    disabled?: boolean;
    error?: string;
    label?: string;
    autoFocus?: boolean;
    testID?: string;
    style?: any;
}

/**
 * Modal Primitive Component
 * Simple overlay with dim background
 *
 * Features:
 * - No backdrop blur (per ADHD-friendly brief)
 * - Dim background only
 * - Swipe-to-dismiss (mobile)
 * - Escape key to dismiss (web)
 * - Focus trap for accessibility
 */

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    dismissible?: boolean;
    testID?: string;
}

/**
 * Toggle Primitive Component
 * Switch component with haptic feedback
 *
 * Features:
 * - Haptic feedback on toggle (mobile)
 * - Accessibility support
 * - Smooth animation
 * - Platform-specific styling
 */

interface ToggleProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
    label?: string;
    hapticFeedback?: boolean;
    testID?: string;
}

/**
 * Touchable Primitive - Web Implementation
 * Uses button element with accessibility best practices
 */

declare const Touchable: React.FC<TouchableProps>;

/**
 * Surface Primitive - Web Implementation
 * Uses div with CSS box-shadow
 */

declare const Surface: React.FC<SurfaceProps>;

/**
 * Stack Primitive - Web Implementation
 * Uses div with flexbox and gap
 */

declare const Stack: React.FC<StackProps>;

/**
 * Spacer Primitive - Web Implementation
 * Uses div with specified dimensions
 */

declare const Spacer: React.FC<SpacerProps>;

/**
 * TextField Primitive - Web Implementation
 * Uses textarea with auto-growing capability
 */

declare const TextField: React.FC<TextFieldProps>;

/**
 * Modal Primitive - Web Implementation
 * Uses portal and fixed positioning
 */

declare const Modal: React.FC<ModalProps>;

/**
 * Toggle Primitive - Web Implementation
 * Uses checkbox input with custom styling
 */

declare const Toggle: React.FC<ToggleProps>;

/**
 * Motion Primitives - Platform-agnostic interface
 * Implementation provided by .web.tsx and .native.tsx files
 */

/**
 * Base animation props shared by all motion primitives
 */
interface BaseAnimationProps {
    /** Child elements to animate */
    children: ReactNode;
    /** Animation duration in milliseconds (overrides preset) */
    duration?: number;
    /** Animation delay in milliseconds */
    delay?: number;
    /** Callback when animation completes */
    onAnimationComplete?: () => void;
}
/**
 * FadeIn/FadeOut Props
 */
interface FadeProps extends BaseAnimationProps {
    /** Initial opacity (default: 0 for FadeIn, 1 for FadeOut) */
    from?: number;
    /** Final opacity (default: 1 for FadeIn, 0 for FadeOut) */
    to?: number;
}
/**
 * Slide Props
 */
interface SlideProps extends BaseAnimationProps {
    /** Direction of slide */
    direction?: 'up' | 'down' | 'left' | 'right';
    /** Distance to slide in pixels (default: 20) */
    distance?: number;
}
/**
 * Scale Props
 */
interface ScaleProps extends BaseAnimationProps {
    /** Initial scale (default: 0.95) */
    from?: number;
    /** Final scale (default: 1) */
    to?: number;
}
/**
 * Collapse Props
 */
interface CollapseProps extends BaseAnimationProps {
    /** Whether the content is visible */
    isOpen: boolean;
}
/**
 * FadeIn Component
 * Gentle opacity animation from 0 to 1
 */
declare function FadeIn(props: FadeProps): JSX.Element;
/**
 * FadeOut Component
 * Gentle opacity animation from 1 to 0
 */
declare function FadeOut(props: FadeProps): JSX.Element;
/**
 * SlideIn Component
 * Directional entrance animation
 */
declare function SlideIn(props: SlideProps): JSX.Element;
/**
 * SlideOut Component
 * Directional exit animation
 */
declare function SlideOut(props: SlideProps): JSX.Element;
/**
 * ScaleIn Component
 * Subtle grow animation
 */
declare function ScaleIn(props: ScaleProps): JSX.Element;
/**
 * ScaleOut Component
 * Subtle shrink animation
 */
declare function ScaleOut(props: ScaleProps): JSX.Element;
/**
 * Collapse Component
 * Height animation for showing/hiding content
 */
declare function Collapse(props: CollapseProps): JSX.Element;
/**
 * AnimatedPresence Component
 * Handles enter/exit animations for conditionally rendered content
 */
interface AnimatedPresenceProps {
    children: ReactNode;
}
declare function AnimatedPresence(props: AnimatedPresenceProps): JSX.Element;

/**
 * Motion Hooks
 * Platform-agnostic animation utilities
 */
/**
 * Hook to detect user's reduced motion preference
 * Respects prefers-reduced-motion system setting
 *
 * @returns boolean - true if animations should be reduced/disabled
 */
declare function useReducedMotion(): boolean;
/**
 * Hook to get animation configuration with reduced motion support
 * Returns instant duration if reduced motion is preferred
 *
 * @param duration - Animation duration in milliseconds
 * @returns Adjusted duration (0 if reduced motion, original otherwise)
 */
declare function useAnimationDuration(duration: number): number;
/**
 * Hook to determine if an animation should play
 * Useful for enabling/disabling entire animation components
 *
 * @returns boolean - true if animations should play
 */
declare function useShouldAnimate(): boolean;
/**
 * Hook for managing animation state
 * Provides enter/exit state management
 */
declare function useAnimationState(isVisible: boolean): "entering" | "entered" | "exiting" | "exited";

/**
 * Motion Presets
 * Common animation patterns ready to use
 */
/**
 * Playful Motion Presets
 * Delightful animations inspired by modern apps
 * Each animation adds personality and joy
 */
declare const motionPresets: {
    /**
     * Gentle fade in with slight upward motion
     * Default animation for content appearing
     */
    readonly fadeIn: {
        readonly duration: 250;
        readonly y: readonly [10, 0];
        readonly opacity: readonly [0, 1];
    };
    /**
     * Gentle fade out with slight downward motion
     * Default animation for content disappearing
     */
    readonly fadeOut: {
        readonly duration: 250;
        readonly y: readonly [0, 10];
        readonly opacity: readonly [1, 0];
    };
    /**
     * Playful bounce in from bottom
     * Good for modals and sheets
     */
    readonly slideInUp: {
        readonly direction: "up";
        readonly distance: 20;
        readonly duration: 250;
        readonly bounce: 0.2;
    };
    /**
     * Slide in from top with bounce
     * Good for notifications
     */
    readonly slideInDown: {
        readonly direction: "down";
        readonly distance: 20;
        readonly duration: 250;
        readonly bounce: 0.1;
    };
    /**
     * Slide in from left with playful curve
     * Good for side panels
     */
    readonly slideInLeft: {
        readonly direction: "right";
        readonly distance: 24;
        readonly duration: 400;
        readonly curve: "easeOut";
    };
    /**
     * Slide in from right with playful curve
     * Good for side panels
     */
    readonly slideInRight: {
        readonly direction: "left";
        readonly distance: 24;
        readonly duration: 400;
        readonly curve: "easeOut";
    };
    /**
     * Delightful scale in with bounce
     * Good for buttons and small elements
     */
    readonly scaleIn: {
        readonly from: 0.9;
        readonly to: 1;
        readonly duration: 150;
        readonly bounce: 0.1;
    };
    /**
     * Quick scale out
     * Good for buttons and small elements
     */
    readonly scaleOut: {
        readonly from: 1;
        readonly to: 0.9;
        readonly duration: 150;
    };
    /**
     * Springy collapse
     * Good for accordions and expandable sections
     */
    readonly collapse: {
        readonly isOpen: false;
        readonly duration: 400;
        readonly spring: true;
    };
    /**
     * Springy expand
     * Good for accordions and expandable sections
     */
    readonly expand: {
        readonly isOpen: true;
        readonly duration: 400;
        readonly spring: true;
    };
    /**
     * Playful shimmer effect
     * Good for loading states
     */
    readonly shimmer: {
        readonly duration: 1.5;
        readonly repeat: number;
        readonly ease: "easeInOut";
    };
    /**
     * Gentle pulse animation
     * Good for attention-grabbing elements
     */
    readonly pulse: {
        readonly scale: readonly [1, 1.05, 1];
        readonly duration: 2;
        readonly repeat: number;
    };
    /**
     * Happy wiggle
     * Good for celebratory moments
     */
    readonly wiggle: {
        readonly rotate: readonly [-2, 2, -2, 2, 0];
        readonly duration: 0.5;
    };
    /**
     * Floating animation
     * Good for decorative elements
     */
    readonly float: {
        readonly y: readonly [-5, 5, -5];
        readonly duration: 3;
        readonly repeat: number;
        readonly ease: "easeInOut";
    };
};
/**
 * Stagger configuration for list animations
 * When animating multiple items in a list
 */
declare const staggerPresets: {
    /**
     * Fast stagger - 50ms between items
     * Good for small lists
     */
    readonly fast: {
        readonly staggerChildren: 0.05;
        readonly delayChildren: 0;
    };
    /**
     * Normal stagger - 100ms between items
     * Default for most lists
     */
    readonly normal: {
        readonly staggerChildren: 0.1;
        readonly delayChildren: 0;
    };
    /**
     * Slow stagger - 150ms between items
     * Good for hero animations
     */
    readonly slow: {
        readonly staggerChildren: 0.15;
        readonly delayChildren: 0.1;
    };
};
/**
 * Helper to create a staggered list animation
 */
declare const createStaggeredAnimation: (preset?: keyof typeof staggerPresets) => {
    container: {
        initial: string;
        animate: string;
        exit: string;
        variants: {
            hidden: {
                opacity: number;
            };
            show: {
                opacity: number;
                transition: {
                    readonly staggerChildren: 0.05;
                    readonly delayChildren: 0;
                } | {
                    readonly staggerChildren: 0.1;
                    readonly delayChildren: 0;
                } | {
                    readonly staggerChildren: 0.15;
                    readonly delayChildren: 0.1;
                };
            };
        };
    };
    item: {
        variants: {
            hidden: {
                opacity: number;
                y: number;
            };
            show: {
                opacity: number;
                y: number;
            };
        };
    };
};

/**
 * BrainDump Screen
 * Platform-agnostic export - automatically selects web or native implementation
 */
declare let BrainDumpProps: any;
declare const BrainDump: any;

/**
 * CapacityModal - Shared types and interface
 * Helps users set their daily capacity (Light/Medium/Full)
 */

type CapacityLevel$1 = 'light' | 'medium' | 'full';
interface CapacityModalProps {
    /** Whether the modal is visible */
    isOpen: boolean;
    /** Current selected capacity */
    currentCapacity?: CapacityLevel$1;
    /** Close modal handler */
    onClose: () => void;
    /** Capacity selection handler */
    onSelectCapacity: (capacity: CapacityLevel$1) => void;
    /** Custom className for styling */
    className?: string;
}
/**
 * Cross-platform CapacityModal component
 */
declare const CapacityModal: React.FC<CapacityModalProps>;

/**
 * CapacityModal
 * Platform-agnostic export - automatically selects web or native implementation
 */
type CapacityLevel = 'light' | 'medium' | 'full';

declare const Timeline: React.FC;

declare const FocusMode: React.FC;

declare const Settings: React.FC;

interface WelcomeProps {
    onComplete: () => void;
}
declare const Welcome: React.FC<WelcomeProps>;

/**
 * ProcessingDots component
 * ADHD-friendly loading indicator - 3 animated dots, not a spinner
 * Respects prefers-reduced-motion
 */
interface ProcessingDotsProps {
    /** Custom className for styling */
    className?: string;
    /** Color of the dots (default: currentColor) */
    color?: string;
    /** Size of each dot in pixels (default: 8) */
    size?: number;
    /** Spacing between dots in pixels (default: 4) */
    spacing?: number;
}
/**
 * ProcessingDots Component
 * Shows 3 dots that fade in/out in sequence
 * When reduced motion is preferred, shows static dots
 */
declare function ProcessingDots({ className, color, size, spacing, }: ProcessingDotsProps): react_jsx_runtime.JSX.Element;
/**
 * ProcessingText Component
 * Text with animated dots suffix (e.g., "Loading...")
 */
interface ProcessingTextProps {
    /** The text to display */
    text: string;
    /** Color of the dots (default: currentColor) */
    color?: string;
    /** Custom className for styling */
    className?: string;
}
declare function ProcessingText({ text, color, className, }: ProcessingTextProps): react_jsx_runtime.JSX.Element;

/**
 * Voice Input Component
 *
 * Hold-to-record voice input button with visual feedback.
 * Platform-specific implementations for web and native.
 *
 * ADHD-Critical: Voice removes typing friction at moments of overwhelm.
 * Speak thoughts faster than typing them.
 */

interface VoiceInputProps {
    onTranscription: (text: string) => void;
    onError?: (error: {
        code: string;
        message: string;
    }) => void;
    disabled?: boolean;
    className?: string;
    style?: any;
}
/**
 * Voice input button component
 * Platform-specific implementation loaded automatically
 *
 * @example
 * ```typescript
 * <VoiceInput
 *   onTranscription={(text) => setBrainDumpText(prev => prev + ' ' + text)}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
declare const VoiceInput: React.FC<VoiceInputProps>;

interface TaskCardProps {
    task: Task;
    onToggle: () => void;
    onFocus: () => void;
    onDelete: () => void;
}
declare const TaskCard: React.FC<TaskCardProps>;

interface TimerProps {
    elapsed: number;
}
declare const Timer: React.FC<TimerProps>;

interface EmptyStateProps {
    message: string;
    icon?: string;
    subMessage?: string;
}
declare const EmptyState: React.FC<EmptyStateProps>;

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

interface SwipeableProps {
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
declare const Swipeable: React.FC<SwipeableProps>;

export { AnimatedPresence, type AnimatedPresenceProps, type BaseAnimationProps, BrainDump, BrainDumpProps, Button, type CapacityLevel, CapacityModal, type CapacityModalProps, Collapse, type CollapseProps, EmptyState, FadeIn, FadeOut, type FadeProps, FocusMode, type HapticType, Modal, type ModalProps, ProcessingDots, type ProcessingDotsProps, ProcessingText, type ProcessingTextProps, ScaleIn, ScaleOut, type ScaleProps, Settings, SlideIn, SlideOut, type SlideProps, Spacer, type SpacerDirection, type SpacerProps, type SpacerSize, Stack, type StackAlign, type StackDirection, type StackJustify, type StackProps, type StackSpacing, Surface, type SurfaceElevation, type SurfaceProps, type SurfaceVariant, Swipeable, type SwipeableProps, TaskCard, Text, TextField, type TextFieldProps, type TextProps, type TextVariant, Timeline, Timer, Toggle, type ToggleProps, Touchable, type TouchableProps, VoiceInput, type VoiceInputProps, Welcome, borderRadius, createStaggeredAnimation, fontWeights, getTextBaseStyles, getVariantStyles, motionPresets, spacing, staggerPresets, useAnimationDuration, useAnimationState, useReducedMotion, useShouldAnimate };
