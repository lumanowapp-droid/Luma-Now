/**
 * CapacityModal
 * Platform-agnostic export - automatically selects web or native implementation
 */

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

export { CapacityModal } from './CapacityModal';
export type { CapacityModalProps } from './CapacityModal';
