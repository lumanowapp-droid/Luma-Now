import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../primitives';

interface EmptyStateProps {
  message: string;
  icon?: string;
  subMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon,
  subMessage,
}) => {
  return (
    <View style={styles.container}>
      {/* Icon placeholder - would use actual icon library in production */}
      {icon && (
        <View style={styles.iconContainer}>
          <Text variant="heading" style={styles.icon}>
            ✓
          </Text>
        </View>
      )}

      {/* Main message */}
      <Text variant="body" style={styles.message}>
        {message}
      </Text>

      {/* Optional sub-message */}
      {subMessage && (
        <Text variant="caption" style={styles.subMessage}>
          {subMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 80,
    height: 80,
    marginBottom: 32,
    borderRadius: 40,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#36C5F0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    color: '#36C5F0',
    fontSize: 32,
  },
  message: {
    color: '#374151',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 18,
    lineHeight: 28,
  },
  subMessage: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
});
