/**
 * CapacityModal - Shared types and interface
 * Helps users set their daily capacity (Light/Medium/Full)
 */

import React from 'react';

export type CapacityLevel = 'light' | 'medium' | 'full';

export interface CapacityOption {
  value: CapacityLevel;
  tasks: number;
  label: string;
  icon: string;
  description: string;
}

export const CAPACITY_OPTIONS: CapacityOption[] = [
  {
    value: 'light',
    tasks: 3,
    label: 'Light Day',
    icon: '🔋',
    description: 'Low energy, keep it simple',
  },
  {
    value: 'medium',
    tasks: 5,
    label: 'Medium Day',
    icon: '🔋🔋',
    description: 'Moderate capacity, steady pace',
  },
  {
    value: 'full',
    tasks: 7,
    label: 'Full Day',
    icon: '🔋🔋🔋',
    description: 'High energy, ready for more',
  },
];

export interface CapacityModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Current selected capacity */
  currentCapacity?: CapacityLevel;
  /** Close modal handler */
  onClose: () => void;
  /** Capacity selection handler */
  onSelectCapacity: (capacity: CapacityLevel) => void;
  /** Custom className for styling */
  className?: string;
}

// Platform detection
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

// Import platform-specific implementations
let PlatformCapacityModal: React.ComponentType<CapacityModalProps>;

if (isWeb) {
  PlatformCapacityModal = require('./CapacityModal.web').CapacityModal;
}

/**
 * Cross-platform CapacityModal component
 */
export const CapacityModal: React.FC<CapacityModalProps> = (props) => {
  return <PlatformCapacityModal {...props} />;
};
