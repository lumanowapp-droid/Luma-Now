/**
 * Modal Primitive - React Native Implementation
 * Uses React Native Modal with swipe-to-dismiss
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import { ModalProps } from './Modal';
import { borderRadius } from '../tokens/spacing';
import { baseColors } from '../tokens/colors';

/**
 * Get modal overlay styles
 */
const getModalOverlayStyles = () => {
  return {
    backgroundColor: baseColors.overlay,
  };
};

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  dismissible = true,
  testID,
}) => {
  const overlayStyles = getModalOverlayStyles();

  const styles = StyleSheet.create({
    overlay: {
      ...overlayStyles,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    content: {
      backgroundColor: baseColors.surface,
      borderRadius: borderRadius.lg,
      padding: 24,
      maxHeight: '90%',
      width: '90%',
    },
  });

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={dismissible ? onClose : undefined}
      testID={testID}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={dismissible ? onClose : undefined}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <SafeAreaView style={styles.content}>
              {children}
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};
