/**
 * CapacityModal - Web Implementation
 * Simple modal for selecting daily capacity
 */

import React from 'react';
import type { CapacityModalProps, CapacityLevel } from '.';
import { CAPACITY_OPTIONS } from '.';
import { Modal } from '../../primitives/Modal';
import { Button } from '../../Button';

export { type CapacityModalProps, type CapacityLevel } from '.';

export function CapacityModal({
  isOpen,
  currentCapacity = 'medium',
  onClose,
  onSelectCapacity,
  className = '',
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

  return (
    <Modal visible={isOpen} onClose={onClose}>
      <div className={`bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full mx-4 ${className}`}>
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-light text-zinc-900 dark:text-zinc-100 mb-2">
            Set Your Capacity
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            How much energy do you have today?
          </p>
        </div>

        {/* Capacity Options */}
        <div className="space-y-3 mb-8">
          {CAPACITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedCapacity(option.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedCapacity === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {option.label}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {option.tasks} tasks
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {option.description}
                  </p>
                </div>
                {selectedCapacity === option.value && (
                  <div className="text-blue-500">✓</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200"
          >
            Cancel
          </button>
          <Button
            onPress={handleConfirm}
          >
            Set Capacity
          </Button>
        </div>
      </div>
    </Modal>
  );
}
