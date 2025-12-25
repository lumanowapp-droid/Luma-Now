/**
 * CapacityModal - Native Implementation
 * Modal for selecting daily capacity on mobile
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import type { CapacityModalProps, CapacityLevel } from './CapacityModal';
import { CAPACITY_OPTIONS } from './CapacityModal';

export { type CapacityModalProps, type CapacityLevel } from './CapacityModal';

export function CapacityModal({
  isOpen,
  currentCapacity = 'medium',
  onClose,
  onSelectCapacity,
}: CapacityModalProps) {
  const [selectedCapacity, setSelectedCapacity] = React.useState<CapacityLevel>(currentCapacity);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedCapacity(currentCapacity);
    }
  }, [isOpen, currentCapacity]);

  const handleConfirm = () => {
    onSelectCapacity(selectedCapacity);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.modal}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Set Your Capacity</Text>
          <Text style={styles.subtitle}>How much energy do you have today?</Text>
        </View>

        {/* Capacity Options */}
        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
          {CAPACITY_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setSelectedCapacity(option.value)}
              style={[
                styles.option,
                selectedCapacity === option.value && styles.optionSelected,
              ]}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionTextContainer}>
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionTasks}>{option.tasks} tasks</Text>
                  </View>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                {selectedCapacity === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable onPress={handleConfirm} style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Set Capacity</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 16,
    maxWidth: 448,
    width: '100%',
    maxHeight: '80%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    color: '#18181B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717A',
  },
  optionsContainer: {
    marginBottom: 32,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E4E4E7',
    marginBottom: 12,
  },
  optionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#18181B',
  },
  optionTasks: {
    fontSize: 14,
    color: '#71717A',
  },
  optionDescription: {
    fontSize: 14,
    color: '#52525B',
  },
  checkmark: {
    fontSize: 18,
    color: '#3B82F6',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#3F3F46',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
