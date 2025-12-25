/**
 * Voice Input System
 *
 * Platform-agnostic voice recording and transcription service.
 * Uses native device microphone for recording and AI transcription.
 *
 * ADHD-Critical: Voice removes typing friction at moments of overwhelm.
 * Speak thoughts faster than typing them.
 */

export type VoiceState = 'idle' | 'recording' | 'processing' | 'error';

export interface VoiceRecording {
  uri: string;
  duration: number;
  mimeType: string;
}

export interface TranscriptionResult {
  text: string;
  confidence?: number;
  language?: string;
}

export interface VoiceError {
  code: 'PERMISSION_DENIED' | 'RECORDING_FAILED' | 'TRANSCRIPTION_FAILED' | 'UNKNOWN';
  message: string;
}

/**
 * Voice input service interface
 * Platform-specific implementations loaded automatically
 */
export interface VoiceService {
  /**
   * Request microphone permissions
   * @returns Promise that resolves to true if granted
   */
  requestPermissions(): Promise<boolean>;

  /**
   * Start recording audio
   * @returns Promise that resolves when recording starts
   */
  startRecording(): Promise<void>;

  /**
   * Stop recording audio
   * @returns Promise that resolves with recording info
   */
  stopRecording(): Promise<VoiceRecording>;

  /**
   * Transcribe audio to text
   * @param recording - Recording to transcribe
   * @returns Promise that resolves with transcription
   */
  transcribe(recording: VoiceRecording): Promise<TranscriptionResult>;

  /**
   * Check if microphone is available
   * @returns true if microphone is available
   */
  isAvailable(): boolean;

  /**
   * Check if voice input is enabled in settings
   * @returns true if enabled
   */
  isEnabled(): boolean | Promise<boolean>;
}

/**
 * Hold-to-record voice input hook
 * Manages recording state and lifecycle
 *
 * @example
 * ```typescript
 * function VoiceButton() {
 *   const { state, startRecording, stopRecording, text, error } = useVoiceInput();
 *
 *   return (
 *     <Pressable
 *       onPressIn={startRecording}
 *       onPressOut={stopRecording}
 *     >
 *       <Icon name={state === 'recording' ? 'mic.fill' : 'mic'} />
 *     </Pressable>
 *   );
 * }
 * ```
 */
export function useVoiceInput() {
  const [state, setState] = React.useState<VoiceState>('idle');
  const [text, setText] = React.useState<string>('');
  const [error, setError] = React.useState<VoiceError | null>(null);
  const recordingRef = React.useRef<VoiceRecording | null>(null);

  const startRecording = React.useCallback(async () => {
    try {
      setState('recording');
      setError(null);

      const { VoiceServiceImpl } = await import('./platformVoice');
      const service = new VoiceServiceImpl();

      if (!service.isAvailable()) {
        throw new Error('Microphone not available');
      }

      const hasPermission = await service.requestPermissions();
      if (!hasPermission) {
        throw { code: 'PERMISSION_DENIED', message: 'Microphone permission denied' };
      }

      await service.startRecording();
    } catch (err: any) {
      setState('error');
      setError(err.code ? err : { code: 'RECORDING_FAILED', message: err.message });
    }
  }, []);

  const stopRecording = React.useCallback(async () => {
    try {
      if (state !== 'recording') return;

      setState('processing');

      const { VoiceServiceImpl } = await import('./platformVoice');
      const service = new VoiceServiceImpl();

      const recording = await service.stopRecording();
      recordingRef.current = recording;

      const result = await service.transcribe(recording);
      setText(result.text);
      setState('idle');
    } catch (err: any) {
      setState('error');
      setError(
        err.code
          ? err
          : { code: 'TRANSCRIPTION_FAILED', message: err.message }
      );
    }
  }, [state]);

  const reset = React.useCallback(() => {
    setState('idle');
    setText('');
    setError(null);
    recordingRef.current = null;
  }, []);

  return {
    state,
    text,
    error,
    startRecording,
    stopRecording,
    reset,
  };
}

// React import for the hook (will be injected by platform)
declare const React: {
  useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void];
  useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  useRef<T>(initial: T): { current: T };
};
