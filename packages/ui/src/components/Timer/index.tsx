import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../primitives';

interface TimerProps {
  elapsed: number; // in seconds
}

export const Timer: React.FC<TimerProps> = ({ elapsed }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Circular background */}
      <View style={styles.circle}>
        {/* Time display */}
        <Text variant="heading" style={styles.time}>
          {formatTime(elapsed)}
        </Text>

        {/* Label */}
        <Text variant="caption" style={styles.label}>
          elapsed
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  time: {
    fontSize: 48,
    fontWeight: '300',
    color: '#1A1A1A',
  },
  label: {
    marginTop: 8,
    color: '#6B7280',
  },
});
