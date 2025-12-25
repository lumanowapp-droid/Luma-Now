/**
 * Modal Primitive Component
 * Simple overlay with dim background
 *
 * Features:
 * - No backdrop blur (per ADHD-friendly brief)
 * - Dim background only
 * - Swipe-to-dismiss (mobile)
 * - Escape key to dismiss (web)
 * - Focus trap for accessibility
 */

import React from 'react';
import { baseColors } from '../tokens/colors';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  dismissible?: boolean;
  testID?: string;
}

/**
 * Get modal overlay styles
 */
export const getModalOverlayStyles = () => {
  return {
    backgroundColor: baseColors.overlay,
  };
};

/**
 * Get modal content styles
 */
export const getModalContentStyles = () => {
  return {
    backgroundColor: baseColors.surface,
    maxWidth: 600,
    width: '90%',
  };
};

// Platform detection
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

// Import platform-specific implementations
let WebModal: React.ComponentType<ModalProps>;

if (isWeb) {
  WebModal = require('./Modal.web').Modal;
}

/**
 * Cross-platform Modal component
 */
export const Modal: React.FC<ModalProps> = (props) => {
  return <WebModal {...props} />;
};
