/**
 * Voice Input Component
 *
 * Hold-to-record voice input button with visual feedback.
 * Platform-specific implementations for web and native.
 *
 * ADHD-Critical: Voice removes typing friction at moments of overwhelm.
 * Speak thoughts faster than typing them.
 */

import React from 'react';

export type VoiceInputState = 'idle' | 'recording' | 'processing' | 'error';

export interface VoiceInputProps {
  onTranscription: (text: string) => void;
  onError?: (error: { code: string; message: string }) => void;
  disabled?: boolean;
  className?: string;
  style?: any;
}

/**
 * Voice input button component
 * Platform-specific implementation loaded automatically
 *
 * @example
 * ```typescript
 * <VoiceInput
 *   onTranscription={(text) => setBrainDumpText(prev => prev + ' ' + text)}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
export const VoiceInput: React.FC<VoiceInputProps> = () => {
  // Base implementation - will be overridden by platform-specific files
  throw new Error('VoiceInput must be imported from a platform-specific file');
};
