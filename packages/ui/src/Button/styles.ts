import { baseColors, semanticColors, categoryColors, backgroundTints } from '../tokens/colors';
import { fontSizes, fontWeights, getPlatformFont } from '../tokens/typography';
import { spacing, borderRadius } from '../tokens/spacing';
import { shadows } from '../tokens/shadows';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Get button base styles based on variant and size
 */
export const getButtonStyles = (
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'medium',
  disabled: boolean = false,
  fullWidth: boolean = false
) => {
  // Size configurations
  const sizeConfig = {
    small: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      fontSize: fontSizes.label.fontSize,
      minHeight: 40,
    },
    medium: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      fontSize: fontSizes.body.fontSize,
      minHeight: 44,
    },
    large: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      fontSize: fontSizes.body.fontSize,
      minHeight: 52,
    },
  };

  // Variant configurations
  const variantConfig = {
    primary: {
      backgroundColor: disabled
        ? baseColors.surfaceDisabled
        : categoryColors.work,
      color: baseColors.surface,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: disabled
        ? baseColors.surfaceDisabled
        : baseColors.surfaceElevated,
      color: disabled ? baseColors.textMuted : baseColors.textPrimary,
      borderWidth: 1,
      borderColor: baseColors.border,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: disabled ? baseColors.textMuted : baseColors.textPrimary,
      borderWidth: 0,
    },
  };

  const config = sizeConfig[size];
  const variantStyles = variantConfig[variant];

  return {
    ...config,
    ...variantStyles,
    borderRadius: borderRadius.md,
    fontFamily: getPlatformFont(),
    fontWeight: fontWeights.medium,
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
  };
};