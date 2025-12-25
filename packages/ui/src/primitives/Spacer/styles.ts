import { spacing } from '../../tokens/spacing';

export type SpacerSize = keyof typeof spacing;
export type SpacerDirection = 'horizontal' | 'vertical';

/**
 * Get spacer styles based on size and direction
 */
export const getSpacerStyles = (
  size: SpacerSize = 'md',
  direction: SpacerDirection = 'vertical'
) => {
  const space = spacing[size];

  return {
    width: direction === 'horizontal' ? space : 1,
    height: direction === 'vertical' ? space : 1,
    flexShrink: 0, // Prevent spacer from shrinking
  };
};