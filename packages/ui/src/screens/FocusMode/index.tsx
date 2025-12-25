import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLumaStore } from '@luma/store';
import type { Task } from '@multi-platform-app/types';
import { Text } from '../../primitives';
import { Button } from '../../Button';
import { Timer } from '../../components/Timer';
import { HapticPatterns } from '@multi-platform-app/core';

export const FocusMode: React.FC = () => {
  const currentTask = useLumaStore((state) =>
    state.tasks.find((t: Task) => t.id === state.currentTaskId)
  );
  const elapsedTime = useLumaStore((state) => state.elapsedTime);
  const endFocus = useLumaStore((state) => state.endFocus);
  const toggleTask = useLumaStore((state) => state.toggleTask);
  const setCurrentView = useLumaStore((state) => state.setCurrentView);

  useEffect(() => {
    // Increment elapsed time every second
    const interval = setInterval(() => {
      useLumaStore.getState().updateElapsedTime(useLumaStore.getState().elapsedTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleComplete = async () => {
    if (!currentTask) return;

    await HapticPatterns.taskComplete();
    toggleTask(currentTask.id);
    handleExit();
  };

  const handleExit = () => {
    endFocus();
    setCurrentView('timeline');
  };

  if (!currentTask) {
    return (
      <View style={styles.container}>
        <Text variant="body">
          No task selected for focus mode
        </Text>
        <Button
          onPress={handleExit}
          variant="ghost"
          style={styles.button}
        >
          Go back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Task Title */}
      <View style={styles.titleContainer}>
        <Text variant="heading" style={styles.title}>
          {currentTask.title}
        </Text>
      </View>

      {/* Timer */}
      <Timer elapsed={elapsedTime} />

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          onPress={handleComplete}
          variant="primary"
        >
          Complete
        </Button>

        <Button
          onPress={handleExit}
          variant="ghost"
        >
          Exit focus mode
        </Button>
      </View>

      {/* Completion message placeholder */}
      {currentTask.completed && (
        <View style={styles.completionMessage}>
          <Text variant="body" style={styles.completionText}>
            Well done. Take a moment.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAF7',
    padding: 24,
  },
  titleContainer: {
    marginBottom: 48,
  },
  title: {
    textAlign: 'center',
    color: '#1A1A1A',
  },
  button: {
    marginTop: 16,
  },
  actions: {
    marginTop: 64,
    gap: 16,
    width: '100%',
    maxWidth: 300,
  },
  completionMessage: {
    marginTop: 32,
  },
  completionText: {
    textAlign: 'center',
    color: '#6B7280',
  },
});
