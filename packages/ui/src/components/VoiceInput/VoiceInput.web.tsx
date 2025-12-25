/**
 * VoiceInput - Web Implementation
 * No-op for web (voice input is mobile-only feature)
 */

import React from 'react';
import type { VoiceInputProps } from './index';

export { type VoiceInputProps } from './index';

export function VoiceInput({ className = '' }: VoiceInputProps) {
  // Voice input is mobile-only, return null on web
  return null;
}
