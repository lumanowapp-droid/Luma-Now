/**
 * Web Voice Implementation
 *
 * Uses Web Audio API for recording and OpenAI Whisper for transcription.
 * Note: Requires HTTPS for microphone access.
 */

import type {
  VoiceService,
  VoiceRecording,
  TranscriptionResult,
} from './index';

export class VoiceServiceImpl implements VoiceService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  }

  async startRecording(): Promise<void> {
    this.audioChunks = [];

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'audio/webm',
    });

    this.mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  async stopRecording(): Promise<VoiceRecording> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const uri = URL.createObjectURL(audioBlob);

        // Stop all tracks
        this.stream?.getTracks().forEach(track => track.stop());

        resolve({
          uri,
          duration: 0, // Duration not easily available in web
          mimeType: 'audio/webm',
        });
      };

      this.mediaRecorder.stop();
    });
  }

  async transcribe(recording: VoiceRecording): Promise<TranscriptionResult> {
    // Fetch the blob from the object URL
    const response = await fetch(recording.uri);
    const audioBlob = await response.blob();

    // Create FormData for API request
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    // Call transcription API endpoint
    const apiResponse = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!apiResponse.ok) {
      throw new Error('Transcription failed');
    }

    const result = await apiResponse.json();
    return {
      text: result.text,
      confidence: result.confidence,
      language: result.language,
    };
  }

  isAvailable(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  isEnabled(): boolean {
    // Voice input always enabled on web if available
    return true;
  }
}
