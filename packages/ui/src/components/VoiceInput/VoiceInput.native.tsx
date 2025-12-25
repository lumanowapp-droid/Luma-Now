/**
 * VoiceInput - Native Implementation
 *
 * Hold-to-record voice input with visual feedback and haptic feedback.
 * Uses voice service from core package for recording and transcription.
 *
 * ADHD-Critical: Hold-to-record pattern is intentional - requires deliberate
 * action, preventing accidental recordings while keeping friction low.
 */

import React, { useState, useCallback } from 'react';
import { View, Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useVoiceInput } from '@multi-platform-app/core/src/voice';
import { haptic } from '@multi-platform-app/core/src/haptics';
import type { VoiceInputProps, VoiceInputState } from './index';

export { type VoiceInputProps } from './index';

export function VoiceInput({
  onTranscription,
  onError,
  disabled = false,
  style,
}: VoiceInputProps) {
  const { state, text, error, startRecording, stopRecording, reset } = useVoiceInput();

  // Handle text transcription
  React.useEffect(() => {
    if (text && state === 'idle') {
      onTranscription(text);
      reset();
    }
  }, [text, state, onTranscription, reset]);

  // Handle errors
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handlePressIn = useCallback(async () => {
    if (disabled || state !== 'idle') return;

    await haptic('light'); // Light haptic on press
    await startRecording();
  }, [disabled, state, startRecording]);

  const handlePressOut = useCallback(async () => {
    if (disabled || state !== 'recording') return;

    await haptic('medium'); // Medium haptic on release
    await stopRecording();
  }, [disabled, state, stopRecording]);

  const getButtonLabel = () => {
    switch (state) {
      case 'recording':
        return 'Recording...';
      case 'processing':
        return 'Processing...';
      case 'error':
        return 'Try again';
      default:
        return 'Hold to speak';
    }
  };

  const isRecording = state === 'recording';
  const isProcessing = state === 'processing';
  const hasError = state === 'error';

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isProcessing}
      style={[
        styles.button,
        isRecording && styles.buttonRecording,
        hasError && styles.buttonError,
        (disabled || isProcessing) && styles.buttonDisabled,
        style,
      ]}
    >
      <View style={styles.iconContainer}>
        {isProcessing ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.icon}>
            {isRecording ? '🎤' : hasError ? '⚠️' : '🎙️'}
          </Text>
        )}
      </View>
      <Text
        style={[
          styles.label,
          (isRecording || isProcessing) && styles.labelRecording,
        ]}
      >
        {getButtonLabel()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    backgroundColor: '#FFFFFF',
    minHeight: 44, // iOS HIG minimum tap target
  },
  buttonRecording: {
    backgroundColor: '#6B85A6', // workBlue from design tokens
    borderColor: '#6B85A6',
  },
  buttonError: {
    backgroundColor: '#C89B5C', // urgencyAmber from design tokens
    borderColor: '#C89B5C',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 16,
    color: '#1A1A1A', // textPrimaryLight from design tokens
    fontWeight: '500',
  },
  labelRecording: {
    color: '#FFFFFF',
  },
});
