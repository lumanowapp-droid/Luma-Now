/**
 * Typography Tokens for Luma Now
 * Premium type system inspired by Tiimo and TickTick
 * Balanced readability with refined visual hierarchy
 */
/**
 * Platform-specific Font Families
 * ClickUp-style: Sans-serif stack with Inter/Axiforma for brand, system fonts for UI
 */
declare const fonts: {
    readonly ios: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    readonly android: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    readonly web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    readonly brand: "Inter, Axiforma, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
};
/**
 * Font Sizes with ClickUp Visual Hierarchy
 * Professional typography system matching ClickUp design
 * Optimized for productivity and clarity
 */
declare const fontSizes: {
    readonly labels: {
        readonly fontSize: 11;
        readonly lineHeight: 11;
        readonly fontWeight: "600";
        readonly letterSpacing: 0;
    };
    readonly bodySmall: {
        readonly fontSize: 12;
        readonly lineHeight: 16.8;
        readonly fontWeight: "400";
        readonly letterSpacing: 0;
    };
    readonly body: {
        readonly fontSize: 14;
        readonly lineHeight: 21;
        readonly fontWeight: "400";
        readonly letterSpacing: 0;
    };
    readonly h2: {
        readonly fontSize: 22;
        readonly lineHeight: 28.6;
        readonly fontWeight: "600";
        readonly letterSpacing: 0;
    };
    readonly h1: {
        readonly fontSize: 28;
        readonly lineHeight: 33.6;
        readonly fontWeight: "700";
        readonly letterSpacing: 0;
    };
    readonly caption: {
        readonly fontSize: 12;
        readonly lineHeight: 16.8;
        readonly fontWeight: "400";
        readonly letterSpacing: 0;
    };
    readonly small: {
        readonly fontSize: 14;
        readonly lineHeight: 21;
        readonly fontWeight: "400";
        readonly letterSpacing: 0;
    };
    readonly label: {
        readonly fontSize: 11;
        readonly lineHeight: 11;
        readonly fontWeight: "600";
        readonly letterSpacing: 0;
    };
    readonly large: {
        readonly fontSize: 18;
        readonly lineHeight: 27;
        readonly fontWeight: "400";
        readonly letterSpacing: 0;
    };
    readonly subheading: {
        readonly fontSize: 20;
        readonly lineHeight: 26;
        readonly fontWeight: "600";
        readonly letterSpacing: 0;
    };
    readonly heading: {
        readonly fontSize: 28;
        readonly lineHeight: 33.6;
        readonly fontWeight: "700";
        readonly letterSpacing: 0;
    };
    readonly display: {
        readonly fontSize: 32;
        readonly lineHeight: 38.4;
        readonly fontWeight: "700";
        readonly letterSpacing: 0;
    };
};
/**
 * Font Weights
 * Limited set to maintain consistency and premium feel
 */
declare const fontWeights: {
    readonly light: "300";
    readonly normal: "400";
    readonly regular: "400";
    readonly medium: "500";
    readonly semibold: "600";
    readonly bold: "700";
};
/**
 * Letter Spacing
 * Premium touch through refined spacing
 * Negative spacing for headings creates tighter, more elegant feel
 */
declare const letterSpacing: {
    readonly tight: -1;
    readonly snug: -0.5;
    readonly normal: 0;
    readonly wide: 0.3;
    readonly wider: 0.5;
};
/**
 * Platform Font Detection
 * Returns appropriate font family based on platform
 * ClickUp-style: System fonts for UI, Inter/Axiforma for brand elements
 */
declare const getPlatformFont: () => string;
/**
 * Font Stack for Web
 * ClickUp-style: Professional sans-serif stack
 */
declare const fontStack: {
    readonly sans: "\"Inter\", \"Axiforma\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
    readonly mono: "\"SF Mono\", \"Monaco\", \"Inconsolata\", \"Fira Code\", \"Dank Mono\", monospace";
};
/**
 * Type Exports
 */
type FontSize = keyof typeof fontSizes;
type FontWeight = keyof typeof fontWeights;
type Platform = keyof typeof fonts;

/**
 * Spacing Tokens for Luma Now
 * 4px base unit for consistent rhythm and predictable patterns
 * ADHD-friendly: Generous whitespace reduces visual clutter
 */
/**
 * Spacing Scale
 * Based on 4px increments for mathematical consistency
 */
declare const spacing: {
    readonly xs: 4;
    readonly sm: 8;
    readonly md: 12;
    readonly base: 16;
    readonly lg: 24;
    readonly xl: 32;
    readonly xxl: 48;
    readonly xxxl: 64;
};
/**
 * Spacing Array
 * Useful for iteration or programmatic access
 */
declare const spacingScale: readonly [4, 8, 12, 16, 24, 32, 48, 64];
/**
 * Component-Specific Spacing
 * Pre-calculated spacing for common patterns
 */
declare const componentSpacing: {
    readonly tapTarget: 44;
    readonly tapTargetSmall: 36;
    readonly inputPadding: 16;
    readonly inputHeight: 48;
    readonly cardPadding: 24;
    readonly cardGap: 16;
    readonly screenPadding: 24;
    readonly sectionGap: 48;
    readonly listItemGap: 12;
    readonly headerHeight: 64;
    readonly tabBarHeight: 56;
};
/**
 * Border Radius
 * ClickUp-style: 4px to 6px radius for professional buttons
 */
declare const borderRadius: {
    readonly sm: 4;
    readonly md: 6;
    readonly lg: 8;
    readonly xl: 12;
    readonly full: 9999;
};
/**
 * Type Exports
 */
type SpacingKey = keyof typeof spacing;
type BorderRadiusKey = keyof typeof borderRadius;

/**
 * Color Tokens for Luma Now
 * Professional SaaS design system
 * All colors tested for WCAG AAA accessibility (7:1 contrast ratio)
 * Refined for modern, professional aesthetic
 */
/**
 * Professional Category Colors
 * Subtle, sophisticated palette for enterprise SaaS
 * These colors provide clarity and professionalism
 * Designed for productivity and focus
 */
declare const categoryColors: {
    readonly work: "#2563EB";
    readonly personal: "#059669";
    readonly care: "#7C3AED";
    readonly urgent: "#D97706";
};
/**
 * Subtle Background Tints
 * Professional background colors for clean interfaces
 * Used for card backgrounds and section highlights
 * Minimal tints for modern SaaS design
 */
declare const backgroundTints: {
    readonly workBlue: "hsl(217, 91%, 97%)";
    readonly personalGreen: "hsl(160, 84%, 96%)";
    readonly carePurple: "hsl(262, 83%, 96%)";
    readonly urgencyAmber: "hsl(43, 96%, 96%)";
    readonly neutral: "hsl(210, 40%, 98%)";
};
/**
 * Professional Accent Colors
 * Sophisticated colors for interactive states and feedback
 * Inspired by leading SaaS platforms
 */
declare const accentColors: {
    readonly completed: "hsl(142, 71%, 45%)";
    readonly focused: "hsl(217, 91%, 60%)";
    readonly hover: "hsl(210, 40%, 96%)";
    readonly empty: "hsl(215, 16%, 47%)";
    readonly highlight: "hsl(45, 93%, 85%)";
    readonly success: "hsl(142, 71%, 45%)";
    readonly warning: "hsl(43, 96%, 56%)";
    readonly error: "hsl(0, 84%, 60%)";
};
/**
 * Base Colors
 * Foundation colors for backgrounds and text
 * Using HSL format for better theme transitions
 */
declare const baseColors: {
    readonly bgLight: "#F8F9FB";
    readonly bgDark: "#0F172A";
    readonly textPrimary: "#292d34";
    readonly textPrimaryLight: "#292d34";
    readonly textPrimaryDark: "#ffffff";
    readonly textMuted: "#7c828d";
    readonly surface: "#ffffff";
    readonly surfaceElevated: "#F8F9FB";
    readonly surfaceDisabled: "#F3F3F3";
    readonly surfaceHover: "#F7F8F9";
    readonly border: "#E9EBEE";
    readonly overlay: "rgba(15, 23, 42, 0.5)";
};
/**
 * Professional Semantic Color System
 * Sophisticated colors for enterprise applications
 * Each color conveys trust and reliability
 */
declare const semanticColors: {
    readonly primary: "#7b68ee";
    readonly primaryForeground: "#ffffff";
    readonly primaryHover: "#6a5acd";
    readonly primaryLight: "#8a7ce6";
    readonly secondary: "hsl(210, 40%, 96%)";
    readonly secondaryForeground: "hsl(222, 84%, 5%)";
    readonly secondaryHover: "hsl(210, 40%, 92%)";
    readonly muted: "hsl(210, 40%, 96%)";
    readonly mutedForeground: "hsl(215, 16%, 47%)";
    readonly accent: "hsl(262, 83%, 58%)";
    readonly accentForeground: "hsl(0, 0%, 100%)";
    readonly destructive: "hsl(0, 84%, 60%)";
    readonly destructiveForeground: "hsl(0, 0%, 100%)";
    readonly taskWork: "hsl(217, 91%, 60%)";
    readonly taskPersonal: "hsl(160, 84%, 39%)";
    readonly taskCare: "hsl(262, 83%, 58%)";
    readonly taskUrgent: "hsl(43, 96%, 56%)";
    readonly success: "#2ecc71";
    readonly error: "#e74c3c";
    readonly warning: "#ff9800";
    readonly info: "#0091FF";
};
/**
 * Professional Chart Colors
 * Sophisticated colors for data visualization
 * Clean palette for enterprise dashboards
 */
declare const chartColors: {
    readonly chart1: "hsl(217, 91%, 60%)";
    readonly chart2: "hsl(160, 84%, 39%)";
    readonly chart3: "hsl(262, 83%, 58%)";
    readonly chart4: "hsl(43, 96%, 56%)";
    readonly chart5: "hsl(215, 16%, 47%)";
    readonly chart6: "hsl(271, 81%, 56%)";
    readonly chart7: "hsl(187, 85%, 43%)";
    readonly chart8: "hsl(25, 95%, 53%)";
};
/**
 * Color Type Exports
 */
type CategoryColor = keyof typeof categoryColors;
type BaseColor = keyof typeof baseColors;
type SemanticColor = keyof typeof semanticColors;
type ChartColor = keyof typeof chartColors;

/**
 * Motion Tokens for Luma Now
 * Calm, purposeful animations in the 200-400ms range
 * ADHD-friendly: No aggressive motion, always respects prefers-reduced-motion
 */
/**
 * Duration Tokens
 * Calm range: 200-400ms (per brief)
 * All values in milliseconds
 */
declare const duration: {
    readonly instant: 0;
    readonly fast: 150;
    readonly normal: 250;
    readonly slow: 400;
    readonly verySlow: 600;
};
/**
 * Easing Functions
 * No bounce or spring - calm, predictable motion only
 * Values are cubic-bezier control points [x1, y1, x2, y2]
 */
declare const easing: {
    readonly calm: readonly [0.25, 0.1, 0.25, 1];
    readonly gentle: readonly [0.4, 0, 0.2, 1];
    readonly linear: readonly [0, 0, 1, 1];
};
/**
 * CSS Easing Strings
 * Pre-formatted for CSS cubic-bezier()
 */
declare const easingCSS: {
    readonly calm: "cubic-bezier(0.25, 0.1, 0.25, 1.0)";
    readonly gentle: "cubic-bezier(0.4, 0.0, 0.2, 1.0)";
    readonly linear: "linear";
};
/**
 * Transition Presets
 * Common animation combinations
 */
declare const transitions: {
    readonly fade: {
        readonly duration: 250;
        readonly easing: readonly [0.25, 0.1, 0.25, 1];
        readonly properties: readonly ["opacity"];
    };
    readonly slide: {
        readonly duration: 400;
        readonly easing: readonly [0.4, 0, 0.2, 1];
        readonly properties: readonly ["transform"];
    };
    readonly scale: {
        readonly duration: 150;
        readonly easing: readonly [0.25, 0.1, 0.25, 1];
        readonly properties: readonly ["transform"];
    };
    readonly color: {
        readonly duration: 250;
        readonly easing: readonly [0.25, 0.1, 0.25, 1];
        readonly properties: readonly ["color", "background-color", "border-color"];
    };
};
/**
 * CSS Transition Strings
 * Ready-to-use CSS transition values
 */
declare const transitionsCSS: {
    readonly fade: "opacity 250ms cubic-bezier(0.25, 0.1, 0.25, 1.0)";
    readonly slide: "transform 400ms cubic-bezier(0.4, 0.0, 0.2, 1.0)";
    readonly scale: "transform 150ms cubic-bezier(0.25, 0.1, 0.25, 1.0)";
    readonly color: "color 250ms cubic-bezier(0.25, 0.1, 0.25, 1.0), background-color 250ms cubic-bezier(0.25, 0.1, 0.25, 1.0), border-color 250ms cubic-bezier(0.25, 0.1, 0.25, 1.0)";
    readonly all: "all 250ms cubic-bezier(0.25, 0.1, 0.25, 1.0)";
};
/**
 * Animation Variants for Framer Motion (Web)
 */
declare const motionVariants: {
    readonly fadeIn: {
        readonly initial: {
            readonly opacity: 0;
        };
        readonly animate: {
            readonly opacity: 1;
        };
        readonly exit: {
            readonly opacity: 0;
        };
        readonly transition: {
            readonly duration: number;
            readonly ease: readonly [0.25, 0.1, 0.25, 1];
        };
    };
    readonly slideUp: {
        readonly initial: {
            readonly opacity: 0;
            readonly y: 20;
        };
        readonly animate: {
            readonly opacity: 1;
            readonly y: 0;
        };
        readonly exit: {
            readonly opacity: 0;
            readonly y: 20;
        };
        readonly transition: {
            readonly duration: number;
            readonly ease: readonly [0.4, 0, 0.2, 1];
        };
    };
    readonly scaleIn: {
        readonly initial: {
            readonly opacity: 0;
            readonly scale: 0.95;
        };
        readonly animate: {
            readonly opacity: 1;
            readonly scale: 1;
        };
        readonly exit: {
            readonly opacity: 0;
            readonly scale: 0.95;
        };
        readonly transition: {
            readonly duration: number;
            readonly ease: readonly [0.25, 0.1, 0.25, 1];
        };
    };
};
/**
 * Processing Dots Animation
 * For loading states (3 dots, not spinner per brief)
 */
declare const processingDotsConfig: {
    readonly dotCount: 3;
    readonly duration: 200;
    readonly totalDuration: 600;
    readonly staggerDelay: 200;
};
/**
 * Interaction Presets
 * Premium micro-interactions inspired by Tiimo and TickTick
 * Provides immediate, satisfying feedback
 */
declare const interactionPresets: {
    readonly tapFeedback: {
        readonly duration: 150;
        readonly scale: 0.98;
        readonly opacity: 0.7;
    };
    readonly hoverFeedback: {
        readonly duration: 150;
        readonly scale: 1.02;
        readonly brightness: 1.05;
    };
    readonly taskCompletion: {
        readonly duration: 400;
        readonly fadeOut: 0.5;
        readonly slideOut: 20;
        readonly scale: 0.95;
    };
    readonly swipeComplete: {
        readonly duration: 250;
        readonly threshold: 100;
        readonly checkmarkScale: {
            readonly from: 0;
            readonly to: 1;
        };
    };
    readonly listReorder: {
        readonly duration: 250;
        readonly stagger: 50;
    };
    readonly modal: {
        readonly duration: 400;
        readonly backdropOpacity: 0.5;
        readonly slideDistance: 20;
    };
    readonly buttonPress: {
        readonly duration: 100;
        readonly scale: 0.96;
    };
};
/**
 * Reduced Motion Detection
 * Utility function to check user preference
 */
declare const shouldReduceMotion: () => boolean;
/**
 * Type Exports
 */
type Duration = keyof typeof duration;
type Easing = keyof typeof easing;
type Transition = keyof typeof transitions;

/**
 * Shadow Tokens for Luma Now
 * Premium elevation system inspired by Tiimo and TickTick
 * Subtle, soft shadows that create depth without harshness
 * ADHD-friendly: Gentle visual hierarchy
 */
/**
 * React Native Shadow Objects
 * Platform-specific shadow configuration
 * Refined for premium feel with soft blur and low opacity
 */
declare const shadows: {
    readonly none: {
        readonly shadowColor: "#000";
        readonly shadowOffset: {
            readonly width: 0;
            readonly height: 0;
        };
        readonly shadowOpacity: 0;
        readonly shadowRadius: 0;
        readonly elevation: 0;
    };
    readonly sm: {
        readonly shadowColor: "#000";
        readonly shadowOffset: {
            readonly width: 0;
            readonly height: 1;
        };
        readonly shadowOpacity: 0.05;
        readonly shadowRadius: 2;
        readonly elevation: 1;
    };
    readonly md: {
        readonly shadowColor: "#000";
        readonly shadowOffset: {
            readonly width: 0;
            readonly height: 2;
        };
        readonly shadowOpacity: 0.06;
        readonly shadowRadius: 8;
        readonly elevation: 2;
    };
    readonly lg: {
        readonly shadowColor: "#000";
        readonly shadowOffset: {
            readonly width: 0;
            readonly height: 4;
        };
        readonly shadowOpacity: 0.08;
        readonly shadowRadius: 12;
        readonly elevation: 3;
    };
    readonly 0: {
        readonly shadowColor: "#000";
        readonly shadowOffset: {
            readonly width: 0;
            readonly height: 0;
        };
        readonly shadowOpacity: 0;
        readonly shadowRadius: 0;
        readonly elevation: 0;
    };
    readonly 1: {
        readonly shadowColor: "#000";
        readonly shadowOffset: {
            readonly width: 0;
            readonly height: 1;
        };
        readonly shadowOpacity: 0.04;
        readonly shadowRadius: 3;
        readonly elevation: 1;
    };
    readonly 2: {
        readonly shadowColor: "#000";
        readonly shadowOffset: {
            readonly width: 0;
            readonly height: 2;
        };
        readonly shadowOpacity: 0.06;
        readonly shadowRadius: 8;
        readonly elevation: 2;
    };
};
/**
 * CSS Box Shadow Strings
 * Pre-formatted for web usage
 * Soft, premium shadows
 */
declare const shadowsCSS: {
    readonly none: "none";
    readonly sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)";
    readonly md: "0 2px 8px 0 rgb(0 0 0 / 0.06)";
    readonly lg: "0 4px 12px 0 rgb(0 0 0 / 0.08)";
    readonly xl: "0 8px 24px -4px rgb(0 0 0 / 0.1)";
    readonly 0: "none";
    readonly 1: "0 1px 3px 0 rgb(0 0 0 / 0.04)";
    readonly 2: "0 2px 8px 0 rgb(0 0 0 / 0.06)";
};
/**
 * Focus Ring Shadows
 * Premium, accessible focus indicators
 * Meets WCAG requirements with clear visibility
 */
declare const focusRing: {
    readonly default: {
        readonly boxShadow: "0 0 0 2px hsl(var(--primary) / 0.4), 0 0 0 4px hsl(var(--primary) / 0.1)";
        readonly outline: "none";
    };
    readonly highContrast: {
        readonly boxShadow: "0 0 0 3px hsl(var(--primary)), 0 0 0 6px hsl(var(--background))";
        readonly outline: "none";
    };
    readonly subtle: {
        readonly boxShadow: "0 0 0 2px hsl(var(--primary) / 0.2)";
        readonly outline: "none";
    };
};
/**
 * CSS Focus Ring Strings
 * Pre-formatted for direct CSS usage
 */
declare const focusRingCSS = "0 0 0 2px hsl(213 85% 45% / 0.4), 0 0 0 4px hsl(213 85% 45% / 0.1)";
declare const focusRingCSSVariants: {
    readonly default: "0 0 0 2px hsl(213 85% 45% / 0.4), 0 0 0 4px hsl(213 85% 45% / 0.1)";
    readonly highContrast: "0 0 0 3px hsl(213 85% 45%), 0 0 0 6px white";
    readonly subtle: "0 0 0 2px hsl(213 85% 45% / 0.2)";
};
/**
 * Inner Shadows (for inputs)
 * Subtle inset shadow for depth perception
 */
declare const innerShadows: {
    readonly input: "inset 0 1px 2px 0 rgb(0 0 0 / 0.05)";
    readonly well: "inset 0 2px 4px 0 rgb(0 0 0 / 0.06)";
};
/**
 * Type Exports
 */
type ShadowKey = keyof typeof shadows;
type ShadowCSSKey = keyof typeof shadowsCSS;

/**
 * Design Tokens for Luma Now
 * Unified export for all design system tokens
 *
 * Usage:
 *   import { tokens } from '@multi-platform-app/ui/tokens';
 *   import { categoryColors, spacing } from '@multi-platform-app/ui/tokens';
 */

/**
 * Unified Tokens Object
 * Single import for all design tokens
 *
 * @example
 * ```typescript
 * import { tokens } from '@multi-platform-app/ui/tokens';
 *
 * const backgroundColor = tokens.colors.category.workBlue;
 * const fontSize = tokens.typography.sizes.body.fontSize;
 * const padding = tokens.spacing.scale.lg;
 * ```
 */
declare const tokens: {
    readonly colors: {
        readonly category: {
            readonly work: "#2563EB";
            readonly personal: "#059669";
            readonly care: "#7C3AED";
            readonly urgent: "#D97706";
        };
        readonly base: {
            readonly bgLight: "#F8F9FB";
            readonly bgDark: "#0F172A";
            readonly textPrimary: "#292d34";
            readonly textPrimaryLight: "#292d34";
            readonly textPrimaryDark: "#ffffff";
            readonly textMuted: "#7c828d";
            readonly surface: "#ffffff";
            readonly surfaceElevated: "#F8F9FB";
            readonly surfaceDisabled: "#F3F3F3";
            readonly surfaceHover: "#F7F8F9";
            readonly border: "#E9EBEE";
            readonly overlay: "rgba(15, 23, 42, 0.5)";
        };
        readonly semantic: {
            readonly primary: "#7b68ee";
            readonly primaryForeground: "#ffffff";
            readonly primaryHover: "#6a5acd";
            readonly primaryLight: "#8a7ce6";
            readonly secondary: "hsl(210, 40%, 96%)";
            readonly secondaryForeground: "hsl(222, 84%, 5%)";
            readonly secondaryHover: "hsl(210, 40%, 92%)";
            readonly muted: "hsl(210, 40%, 96%)";
            readonly mutedForeground: "hsl(215, 16%, 47%)";
            readonly accent: "hsl(262, 83%, 58%)";
            readonly accentForeground: "hsl(0, 0%, 100%)";
            readonly destructive: "hsl(0, 84%, 60%)";
            readonly destructiveForeground: "hsl(0, 0%, 100%)";
            readonly taskWork: "hsl(217, 91%, 60%)";
            readonly taskPersonal: "hsl(160, 84%, 39%)";
            readonly taskCare: "hsl(262, 83%, 58%)";
            readonly taskUrgent: "hsl(43, 96%, 56%)";
            readonly success: "#2ecc71";
            readonly error: "#e74c3c";
            readonly warning: "#ff9800";
            readonly info: "#0091FF";
        };
        readonly chart: {
            readonly chart1: "hsl(217, 91%, 60%)";
            readonly chart2: "hsl(160, 84%, 39%)";
            readonly chart3: "hsl(262, 83%, 58%)";
            readonly chart4: "hsl(43, 96%, 56%)";
            readonly chart5: "hsl(215, 16%, 47%)";
            readonly chart6: "hsl(271, 81%, 56%)";
            readonly chart7: "hsl(187, 85%, 43%)";
            readonly chart8: "hsl(25, 95%, 53%)";
        };
    };
    readonly typography: {
        readonly fonts: {
            readonly ios: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
            readonly android: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
            readonly web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
            readonly brand: "Inter, Axiforma, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        };
        readonly sizes: {
            readonly labels: {
                readonly fontSize: 11;
                readonly lineHeight: 11;
                readonly fontWeight: "600";
                readonly letterSpacing: 0;
            };
            readonly bodySmall: {
                readonly fontSize: 12;
                readonly lineHeight: 16.8;
                readonly fontWeight: "400";
                readonly letterSpacing: 0;
            };
            readonly body: {
                readonly fontSize: 14;
                readonly lineHeight: 21;
                readonly fontWeight: "400";
                readonly letterSpacing: 0;
            };
            readonly h2: {
                readonly fontSize: 22;
                readonly lineHeight: 28.6;
                readonly fontWeight: "600";
                readonly letterSpacing: 0;
            };
            readonly h1: {
                readonly fontSize: 28;
                readonly lineHeight: 33.6;
                readonly fontWeight: "700";
                readonly letterSpacing: 0;
            };
            readonly caption: {
                readonly fontSize: 12;
                readonly lineHeight: 16.8;
                readonly fontWeight: "400";
                readonly letterSpacing: 0;
            };
            readonly small: {
                readonly fontSize: 14;
                readonly lineHeight: 21;
                readonly fontWeight: "400";
                readonly letterSpacing: 0;
            };
            readonly label: {
                readonly fontSize: 11;
                readonly lineHeight: 11;
                readonly fontWeight: "600";
                readonly letterSpacing: 0;
            };
            readonly large: {
                readonly fontSize: 18;
                readonly lineHeight: 27;
                readonly fontWeight: "400";
                readonly letterSpacing: 0;
            };
            readonly subheading: {
                readonly fontSize: 20;
                readonly lineHeight: 26;
                readonly fontWeight: "600";
                readonly letterSpacing: 0;
            };
            readonly heading: {
                readonly fontSize: 28;
                readonly lineHeight: 33.6;
                readonly fontWeight: "700";
                readonly letterSpacing: 0;
            };
            readonly display: {
                readonly fontSize: 32;
                readonly lineHeight: 38.4;
                readonly fontWeight: "700";
                readonly letterSpacing: 0;
            };
        };
        readonly weights: {
            readonly light: "300";
            readonly normal: "400";
            readonly regular: "400";
            readonly medium: "500";
            readonly semibold: "600";
            readonly bold: "700";
        };
        readonly stack: {
            readonly sans: "\"Inter\", \"Axiforma\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
            readonly mono: "\"SF Mono\", \"Monaco\", \"Inconsolata\", \"Fira Code\", \"Dank Mono\", monospace";
        };
        readonly getPlatformFont: () => string;
    };
    readonly spacing: {
        readonly scale: {
            readonly xs: 4;
            readonly sm: 8;
            readonly md: 12;
            readonly base: 16;
            readonly lg: 24;
            readonly xl: 32;
            readonly xxl: 48;
            readonly xxxl: 64;
        };
        readonly array: readonly [4, 8, 12, 16, 24, 32, 48, 64];
        readonly component: {
            readonly tapTarget: 44;
            readonly tapTargetSmall: 36;
            readonly inputPadding: 16;
            readonly inputHeight: 48;
            readonly cardPadding: 24;
            readonly cardGap: 16;
            readonly screenPadding: 24;
            readonly sectionGap: 48;
            readonly listItemGap: 12;
            readonly headerHeight: 64;
            readonly tabBarHeight: 56;
        };
        readonly radius: {
            readonly sm: 4;
            readonly md: 6;
            readonly lg: 8;
            readonly xl: 12;
            readonly full: 9999;
        };
    };
    readonly motion: {
        readonly duration: {
            readonly instant: 0;
            readonly fast: 150;
            readonly normal: 250;
            readonly slow: 400;
            readonly verySlow: 600;
        };
        readonly easing: {
            readonly calm: readonly [0.25, 0.1, 0.25, 1];
            readonly gentle: readonly [0.4, 0, 0.2, 1];
            readonly linear: readonly [0, 0, 1, 1];
        };
        readonly easingCSS: {
            readonly calm: "cubic-bezier(0.25, 0.1, 0.25, 1.0)";
            readonly gentle: "cubic-bezier(0.4, 0.0, 0.2, 1.0)";
            readonly linear: "linear";
        };
        readonly transitions: {
            readonly fade: {
                readonly duration: 250;
                readonly easing: readonly [0.25, 0.1, 0.25, 1];
                readonly properties: readonly ["opacity"];
            };
            readonly slide: {
                readonly duration: 400;
                readonly easing: readonly [0.4, 0, 0.2, 1];
                readonly properties: readonly ["transform"];
            };
            readonly scale: {
                readonly duration: 150;
                readonly easing: readonly [0.25, 0.1, 0.25, 1];
                readonly properties: readonly ["transform"];
            };
            readonly color: {
                readonly duration: 250;
                readonly easing: readonly [0.25, 0.1, 0.25, 1];
                readonly properties: readonly ["color", "background-color", "border-color"];
            };
        };
        readonly transitionsCSS: {
            readonly fade: "opacity 250ms cubic-bezier(0.25, 0.1, 0.25, 1.0)";
            readonly slide: "transform 400ms cubic-bezier(0.4, 0.0, 0.2, 1.0)";
            readonly scale: "transform 150ms cubic-bezier(0.25, 0.1, 0.25, 1.0)";
            readonly color: "color 250ms cubic-bezier(0.25, 0.1, 0.25, 1.0), background-color 250ms cubic-bezier(0.25, 0.1, 0.25, 1.0), border-color 250ms cubic-bezier(0.25, 0.1, 0.25, 1.0)";
            readonly all: "all 250ms cubic-bezier(0.25, 0.1, 0.25, 1.0)";
        };
        readonly variants: {
            readonly fadeIn: {
                readonly initial: {
                    readonly opacity: 0;
                };
                readonly animate: {
                    readonly opacity: 1;
                };
                readonly exit: {
                    readonly opacity: 0;
                };
                readonly transition: {
                    readonly duration: number;
                    readonly ease: readonly [0.25, 0.1, 0.25, 1];
                };
            };
            readonly slideUp: {
                readonly initial: {
                    readonly opacity: 0;
                    readonly y: 20;
                };
                readonly animate: {
                    readonly opacity: 1;
                    readonly y: 0;
                };
                readonly exit: {
                    readonly opacity: 0;
                    readonly y: 20;
                };
                readonly transition: {
                    readonly duration: number;
                    readonly ease: readonly [0.4, 0, 0.2, 1];
                };
            };
            readonly scaleIn: {
                readonly initial: {
                    readonly opacity: 0;
                    readonly scale: 0.95;
                };
                readonly animate: {
                    readonly opacity: 1;
                    readonly scale: 1;
                };
                readonly exit: {
                    readonly opacity: 0;
                    readonly scale: 0.95;
                };
                readonly transition: {
                    readonly duration: number;
                    readonly ease: readonly [0.25, 0.1, 0.25, 1];
                };
            };
        };
        readonly processingDots: {
            readonly dotCount: 3;
            readonly duration: 200;
            readonly totalDuration: 600;
            readonly staggerDelay: 200;
        };
        readonly shouldReduceMotion: () => boolean;
    };
    readonly shadows: {
        readonly native: {
            readonly none: {
                readonly shadowColor: "#000";
                readonly shadowOffset: {
                    readonly width: 0;
                    readonly height: 0;
                };
                readonly shadowOpacity: 0;
                readonly shadowRadius: 0;
                readonly elevation: 0;
            };
            readonly sm: {
                readonly shadowColor: "#000";
                readonly shadowOffset: {
                    readonly width: 0;
                    readonly height: 1;
                };
                readonly shadowOpacity: 0.05;
                readonly shadowRadius: 2;
                readonly elevation: 1;
            };
            readonly md: {
                readonly shadowColor: "#000";
                readonly shadowOffset: {
                    readonly width: 0;
                    readonly height: 2;
                };
                readonly shadowOpacity: 0.06;
                readonly shadowRadius: 8;
                readonly elevation: 2;
            };
            readonly lg: {
                readonly shadowColor: "#000";
                readonly shadowOffset: {
                    readonly width: 0;
                    readonly height: 4;
                };
                readonly shadowOpacity: 0.08;
                readonly shadowRadius: 12;
                readonly elevation: 3;
            };
            readonly 0: {
                readonly shadowColor: "#000";
                readonly shadowOffset: {
                    readonly width: 0;
                    readonly height: 0;
                };
                readonly shadowOpacity: 0;
                readonly shadowRadius: 0;
                readonly elevation: 0;
            };
            readonly 1: {
                readonly shadowColor: "#000";
                readonly shadowOffset: {
                    readonly width: 0;
                    readonly height: 1;
                };
                readonly shadowOpacity: 0.04;
                readonly shadowRadius: 3;
                readonly elevation: 1;
            };
            readonly 2: {
                readonly shadowColor: "#000";
                readonly shadowOffset: {
                    readonly width: 0;
                    readonly height: 2;
                };
                readonly shadowOpacity: 0.06;
                readonly shadowRadius: 8;
                readonly elevation: 2;
            };
        };
        readonly css: {
            readonly none: "none";
            readonly sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)";
            readonly md: "0 2px 8px 0 rgb(0 0 0 / 0.06)";
            readonly lg: "0 4px 12px 0 rgb(0 0 0 / 0.08)";
            readonly xl: "0 8px 24px -4px rgb(0 0 0 / 0.1)";
            readonly 0: "none";
            readonly 1: "0 1px 3px 0 rgb(0 0 0 / 0.04)";
            readonly 2: "0 2px 8px 0 rgb(0 0 0 / 0.06)";
        };
        readonly focus: {
            readonly default: {
                readonly boxShadow: "0 0 0 2px hsl(var(--primary) / 0.4), 0 0 0 4px hsl(var(--primary) / 0.1)";
                readonly outline: "none";
            };
            readonly highContrast: {
                readonly boxShadow: "0 0 0 3px hsl(var(--primary)), 0 0 0 6px hsl(var(--background))";
                readonly outline: "none";
            };
            readonly subtle: {
                readonly boxShadow: "0 0 0 2px hsl(var(--primary) / 0.2)";
                readonly outline: "none";
            };
        };
        readonly focusCSS: "0 0 0 2px hsl(213 85% 45% / 0.4), 0 0 0 4px hsl(213 85% 45% / 0.1)";
        readonly inner: {
            readonly input: "inset 0 1px 2px 0 rgb(0 0 0 / 0.05)";
            readonly well: "inset 0 2px 4px 0 rgb(0 0 0 / 0.06)";
        };
    };
};
/**
 * Type Export for Tokens
 * Useful for type-safe token access
 */
type Tokens = typeof tokens;

export { type BaseColor, type BorderRadiusKey, type CategoryColor, type ChartColor, type Duration, type Easing, type FontSize, type FontWeight, type Platform, type SemanticColor, type ShadowCSSKey, type ShadowKey, type SpacingKey, type Tokens, type Transition, accentColors, backgroundTints, baseColors, borderRadius, categoryColors, chartColors, componentSpacing, duration, easing, easingCSS, focusRing, focusRingCSS, focusRingCSSVariants, fontSizes, fontStack, fontWeights, fonts, getPlatformFont, innerShadows, interactionPresets, letterSpacing, motionVariants, processingDotsConfig, semanticColors, shadows, shadowsCSS, shouldReduceMotion, spacing, spacingScale, tokens, transitions, transitionsCSS };
