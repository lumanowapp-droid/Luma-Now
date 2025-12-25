/**
 * BrainDump - Native Implementation
 * Uses TextInput with voice button for mobile
 */

import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable } from 'react-native';
import type { BrainDumpProps } from './BrainDump';
import { VoiceInput } from '../../components/VoiceInput';
import { ProcessingDots } from '../../components/ProcessingDots';

export { type BrainDumpProps } from './BrainDump';

export function BrainDump({
  text,
  onTextChange,
  onCompress,
  isProcessing = false,
  error = null,
  className = '',
  placeholder = "Brain dump everything on your mind... e.g., 'I need to finish the proposal, walk the dog, call mom, review budget'",
}: BrainDumpProps) {
  const inputRef = useRef<TextInput>(null);

  const handleCompress = async () => {
    if (!text.trim() || isProcessing) return;
    await onCompress(text);
  };

  const handleVoiceTranscript = (transcript: string) => {
    // Append voice transcript to existing text
    const newText = text ? `${text}\n${transcript}` : transcript;
    onTextChange(newText);
  };

  const isDisabled = !text.trim() || isProcessing;

  return (
    <View style={styles.container}>
      {/* Text Input */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={onTextChange}
          placeholder={placeholder}
          placeholderTextColor="#A1A1AA"
          multiline
          editable={!isProcessing}
          style={[styles.textInput, isProcessing && styles.textInputDisabled]}
          textAlignVertical="top"
        />

        {/* Character count */}
        <View style={styles.characterCount}>
          <Text style={styles.characterCountText}>{text.length} characters</Text>
        </View>
      </View>

      {/* Voice Input */}
      <View style={styles.voiceContainer}>
        <VoiceInput
          onTranscript={handleVoiceTranscript}
          disabled={isProcessing}
        />
      </View>

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Compress button */}
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleCompress}
          disabled={isDisabled}
          style={[styles.button, isDisabled && styles.buttonDisabled]}
        >
          {isProcessing ? (
            <View style={styles.buttonContent}>
              <ProcessingDots />
              <Text style={styles.buttonText}>Compressing</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Compress with AI</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 896, // 4xl equivalent
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  textInput: {
    minHeight: 200,
    maxHeight: 600,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    lineHeight: 28,
    color: '#18181B',
    padding: 24,
    paddingRight: 64,
  },
  textInputDisabled: {
    opacity: 0.5,
  },
  characterCount: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  characterCountText: {
    fontSize: 14,
    color: '#71717A',
  },
  voiceContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
