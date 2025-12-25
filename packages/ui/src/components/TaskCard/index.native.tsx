import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import type { Task } from '@multi-platform-app/types';
import { Text } from '../../primitives';

export interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onFocus: () => void;
  onDelete: () => void;
}

// Updated category colors to match our new playful palette
const categoryColors = {
  work: '#36C5F0',      // Slack-inspired vibrant blue
  personal: '#2EB67D',  // Vibrant green
  care: '#ECB22E',      // Warm yellow
  urgent: '#E01E5A',    // Playful pink-red
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onFocus,
  onDelete,
}) => {
  const borderColor = categoryColors[task.category as keyof typeof categoryColors] || categoryColors.personal;

  const handleToggle = () => {
    onToggle();
  };

  const handleFocus = () => {
    onFocus();
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <TouchableOpacity
      onPress={handleFocus}
      style={[
        styles.container,
        {
          borderLeftColor: borderColor,
          opacity: task.completed ? 0.6 : 1,
          transform: [{ scale: task.completed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.content}>
        {/* Completion Toggle */}
        <TouchableOpacity
          onPress={handleToggle}
          style={styles.checkbox}
        >
          {task.completed && (
            <View
              style={[
                styles.checkboxInner,
                { backgroundColor: borderColor },
              ]}
            />
          )}
        </TouchableOpacity>

        {/* Task Content */}
        <View style={styles.taskContent}>
          <Text
            variant="body"
            style={{
              textDecorationLine: task.completed ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </Text>

          {task.duration && (
            <Text
              variant="caption"
              style={styles.duration}
            >
              {task.duration} min
            </Text>
          )}
        </View>

        {/* Delete button */}
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteIcon}>×</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    minHeight: 56,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  taskContent: {
    flex: 1,
  },
  duration: {
    marginTop: 6,
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  deleteIcon: {
    color: '#EF4444',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
