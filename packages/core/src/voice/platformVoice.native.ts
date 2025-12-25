/**
 * React Native Voice Implementation
 *
 * Uses expo-av for audio recording and OpenAI Whisper for transcription.
 */

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import type {
  VoiceService,
  VoiceRecording,
  TranscriptionResult,
} from './index';

// Dynamic import to avoid requiring store in web environment
let getSettings: (() => { voiceInput: boolean }) | null = null;

async function loadSettings() {
  if (!getSettings) {
    try {
      const { useAppStore } = await import('@multi-platform-app/store');
      getSettings = () => useAppStore.getState().settings;
    } catch {
      // Store not available, default to enabled
      getSettings = () => ({ voiceInput: true });
    }
  }
  return getSettings();
}

export class VoiceServiceImpl implements VoiceService {
  private recording: Audio.Recording | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      return granted;
    } catch {
      return false;
    }
  }

  async startRecording(): Promise<void> {
    try {
      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create and start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
    } catch (error) {
      throw new Error(`Failed to start recording: ${error}`);
    }
  }

  async stopRecording(): Promise<VoiceRecording> {
    if (!this.recording) {
      throw new Error('No active recording');
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      const status = await this.recording.getStatusAsync();

      if (!uri) {
        throw new Error('Recording URI not available');
      }

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const result: VoiceRecording = {
        uri,
        duration: status.durationMillis || 0,
        mimeType: 'audio/m4a',
      };

      this.recording = null;
      return result;
    } catch (error) {
      throw new Error(`Failed to stop recording: ${error}`);
    }
  }

  async transcribe(recording: VoiceRecording): Promise<TranscriptionResult> {
    try {
      // Read the audio file as base64
      const audioBase64 = await FileSystem.readAsStringAsync(recording.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Call transcription API endpoint
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: audioBase64,
          mimeType: recording.mimeType,
          duration: recording.duration,
        }),
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const result = await response.json();
      return {
        text: result.text,
        confidence: result.confidence,
        language: result.language,
      };
    } catch (error) {
      throw new Error(`Transcription failed: ${error}`);
    }
  }

  isAvailable(): boolean {
    // Audio is always available on React Native
    return true;
  }

  async isEnabled(): Promise<boolean> {
    const settings = await loadSettings();
    return settings.voiceInput ?? true; // Default to enabled
  }
}
