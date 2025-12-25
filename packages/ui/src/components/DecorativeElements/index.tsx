/**
 * Decorative Elements
 * Playful graphics and illustrations to add personality to the app
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Floating orbs for background decoration
export const FloatingOrb: React.FC<{
  size?: number;
  color?: string;
  opacity?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}> = ({ 
  size = 100, 
  color = '#36C5F0', 
  opacity = 0.1,
  top,
  left,
  right,
  bottom 
}) => {
  return (
    <View
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          backgroundColor: color,
          opacity,
          top,
          left,
          right,
          bottom,
        },
      ]}
    />
  );
};

// Geometric shapes for modern aesthetic
export const GeometricShape: React.FC<{
  size?: number;
  color?: string;
  type?: 'circle' | 'square' | 'triangle';
  rotation?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}> = ({ 
  size = 50, 
  color = '#2EB67D', 
  type = 'circle',
  rotation = 0,
  top,
  left,
  right,
  bottom 
}) => {
  const getShapeStyle = () => {
    switch (type) {
      case 'square':
        return { borderRadius: 8 };
      case 'triangle':
        return {
          width: 0,
          height: 0,
          borderLeft: size / 2,
          borderRight: size / 2,
          borderBottom: size,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        };
      default:
        return { borderRadius: size / 2 };
    }
  };

  return (
    <View
      style={[
        styles.shape,
        {
          ...getShapeStyle(),
          backgroundColor: type === 'triangle' ? undefined : color,
          transform: [{ rotate: `${rotation}deg` }],
          top,
          left,
          right,
          bottom,
        },
      ]}
    />
  );
};

// Gradient blob for organic feel
export const GradientBlob: React.FC<{
  size?: number;
  colors?: string[];
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}> = ({ 
  size = 200, 
  colors = ['#36C5F0', '#2EB67D', '#ECB22E'],
  top,
  left,
  right,
  bottom 
}) => {
  // For simplicity, we'll use a solid color approximation
  // In a real implementation, you'd use gradients
  const primaryColor = colors[0];
  
  return (
    <View
      style={[
        styles.blob,
        {
          width: size,
          height: size,
          backgroundColor: primaryColor,
          opacity: 0.1,
          borderRadius: size * 0.6,
          top,
          left,
          right,
          bottom,
        },
      ]}
    />
  );
};

// Progress dots for visual feedback
export const ProgressDots: React.FC<{
  count: number;
  activeIndex: number;
  color?: string;
}> = ({ count, activeIndex, color = '#36C5F0' }) => {
  return (
    <View style={styles.progressDots}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressDot,
            {
              backgroundColor: index === activeIndex ? color : '#E5E7EB',
              width: index === activeIndex ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
};

// Celebration confetti
export const Confetti: React.FC<{
  count?: number;
  colors?: string[];
}> = ({ count = 20, colors = ['#36C5F0', '#2EB67D', '#ECB22E', '#E01E5A'] }) => {
  const confettiPieces = Array.from({ length: count }).map((_, index) => {
    const color = colors[index % colors.length];
    const size = Math.random() * 8 + 4;
    const left = Math.random() * 100;
    const rotation = Math.random() * 360;
    
    return (
      <View
        key={index}
        style={[
          styles.confetti,
          {
            backgroundColor: color,
            width: size,
            height: size * 0.6,
            left: `${left}%`,
            top: `${Math.random() * 100}%`,
            transform: [{ rotate: `${rotation}deg` }],
          },
        ]}
      />
    );
  });

  return <View style={styles.confettiContainer}>{confettiPieces}</View>;
};

// Emoji-style reactions
export const EmojiReaction: React.FC<{
  emoji: string;
  size?: number;
  onPress?: () => void;
}> = ({ emoji, size = 32, onPress }) => {
  return (
    <View
      style={[
        styles.emojiReaction,
        {
          width: size,
          height: size,
        },
      ]}
      onTouchEnd={onPress}
    >
      <Text style={{ fontSize: size * 0.6 }}>{emoji}</Text>
    </View>
  );
};

// Playful borders and frames
export const PlayfulFrame: React.FC<{
  children: React.ReactNode;
  color?: string;
  thickness?: number;
  cornerRadius?: number;
  padding?: number;
}> = ({ 
  children, 
  color = '#36C5F0', 
  thickness = 3,
  cornerRadius = 16,
  padding = 16
}) => {
  return (
    <View
      style={[
        styles.frame,
        {
          borderColor: color,
          borderWidth: thickness,
          borderRadius: cornerRadius,
          padding,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 1000,
  },
  shape: {
    position: 'absolute',
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s ease',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
  emojiReaction: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  frame: {
    backgroundColor: '#FFFFFF',
  },
});