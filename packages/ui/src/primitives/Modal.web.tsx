/**
 * Modal Primitive - Web Implementation
 * Uses portal and fixed positioning
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ModalProps } from '.';
import { borderRadius } from '../tokens/spacing';
import { duration, easing } from '../tokens/motion';

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  dismissible = true,
  testID,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!visible || !dismissible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [visible, dismissible, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [visible]);

  // Focus trap
  useEffect(() => {
    if (visible && contentRef.current) {
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [visible]);

  if (!visible) return null;

  // No styling for basic pages
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 16,
    animation: `fadeIn ${duration.normal}ms ${easing.calm.join(',')}`,
  };

  const contentStyle: React.CSSProperties = {
    borderRadius: borderRadius.lg,
    padding: 24,
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    animation: `scaleIn ${duration.normal}ms ${easing.calm.join(',')}`,
  };

  const modal = (
    <div
      style={overlayStyle}
      onClick={dismissible ? onClose : undefined}
      data-testid={testID}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={contentRef}
        style={contentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  // Add CSS animations
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    if (!document.head.querySelector('style[data-modal-animations]')) {
      style.setAttribute('data-modal-animations', 'true');
      document.head.appendChild(style);
    }
  }

  return createPortal(modal, document.body);
};
