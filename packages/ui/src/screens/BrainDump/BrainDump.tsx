/**
 * BrainDump - Shared types and interface
 * Core brain dump functionality shared across platforms
 */

import React, { useState, useCallback } from 'react';

export interface BrainDumpProps {
  /** Current text value */
  text: string;
  /** Text change handler */
  onTextChange: (text: string) => void;
  /** Compress button handler */
  onCompress: (text: string) => Promise<void>;
  /** Whether compression is in progress */
  isProcessing?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Custom className for styling */
  className?: string;
  /** Placeholder text */
  placeholder?: string;
}

// Platform-specific implementations will override this
export const BrainDump: React.FC<BrainDumpProps> = () => {
  throw new Error('BrainDump must be imported from a platform-specific file');
};
