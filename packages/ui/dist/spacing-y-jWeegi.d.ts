/**
 * Typography Tokens for Luma Now
 * ADHD-friendly type system with generous sizing and line heights
 */
/**
 * Platform-specific Font Families
 * Uses rounded fonts for softer, more approachable feel
 */
declare const fonts: {
    readonly ios: "SF Pro Rounded";
    readonly android: "Inter Rounded";
    readonly web: "Inter Rounded";
};
/**
 * Font Sizes with ADHD-Friendly Scale
 * Larger defaults for better readability
 * All sizes include generous line heights (1.5-1.6x)
 */
declare const fontSizes: {
    readonly caption: {
        readonly fontSize: 12;
        readonly lineHeight: 18;
        readonly fontWeight: "400";
    };
    readonly small: {
        readonly fontSize: 15;
        readonly lineHeight: 22;
        readonly fontWeight: "400";
    };
    readonly label: {
        readonly fontSize: 16;
        readonly lineHeight: 24;
        readonly fontWeight: "500";
    };
    readonly body: {
        readonly fontSize: 18;
        readonly lineHeight: 28;
        readonly fontWeight: "400";
    };
    readonly large: {
        readonly fontSize: 21;
        readonly lineHeight: 32;
        readonly fontWeight: "400";
    };
    readonly heading: {
        readonly fontSize: 34;
        readonly lineHeight: 40;
        readonly fontWeight: "300";
    };
    readonly display: {
        readonly fontSize: 48;
        readonly lineHeight: 56;
        readonly fontWeight: "200";
    };
};
/**
 * Font Weights
 * Limited set to maintain consistency
 */
declare const fontWeights: {
    readonly light: "300";
    readonly normal: "400";
    readonly regular: "400";
    readonly medium: "500";
    readonly semibold: "600";
};
/**
 * Platform Font Detection
 * Returns appropriate font family based on platform
 * For web, falls back to system fonts if Inter Rounded not available
 */
declare const getPlatformFont: () => string;
/**
 * Font Stack for Web
 * Includes fallbacks for better compatibility
 */
declare const fontStack: {
    readonly rounded: "\"Inter Rounded\", \"SF Pro Rounded\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
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
 * Soft, rounded corners for calm aesthetic
 */
declare const borderRadius: {
    readonly sm: 4;
    readonly md: 8;
    readonly lg: 12;
    readonly xl: 16;
    readonly full: 9999;
};
/**
 * Type Exports
 */
type SpacingKey = keyof typeof spacing;
type BorderRadiusKey = keyof typeof borderRadius;

export { type BorderRadiusKey as B, type FontSize as F, type Platform as P, type SpacingKey as S, fonts as a, borderRadius as b, fontSizes as c, fontStack as d, type FontWeight as e, fontWeights as f, getPlatformFont as g, spacingScale as h, componentSpacing as i, spacing as s };
