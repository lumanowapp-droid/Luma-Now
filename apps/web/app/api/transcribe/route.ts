/**
 * Voice Transcription API Endpoint
 *
 * Accepts audio data and transcribes it to text using OpenAI Whisper API.
 * Supports both web (FormData) and native (base64) formats.
 *
 * ADHD-Critical: Fast transcription enables low-friction voice input,
 * removing typing barriers at moments of overwhelm.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let audioFile: File;

    if (contentType.includes('multipart/form-data')) {
      // Web format: FormData with audio blob
      const formData = await request.formData();
      const audio = formData.get('audio');

      if (!audio || !(audio instanceof File)) {
        return NextResponse.json(
          { error: 'No audio file provided' },
          { status: 400 }
        );
      }

      audioFile = audio;
    } else if (contentType.includes('application/json')) {
      // Native format: JSON with base64 audio
      const body = await request.json();
      const { audio: audioBase64, mimeType } = body;

      if (!audioBase64) {
        return NextResponse.json(
          { error: 'No audio data provided' },
          { status: 400 }
        );
      }

      // Convert base64 to File
      const audioBuffer = Buffer.from(audioBase64, 'base64');
      const blob = new Blob([audioBuffer], { type: mimeType || 'audio/m4a' });
      audioFile = new File([blob], 'recording.m4a', {
        type: mimeType || 'audio/m4a',
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Transcribe using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en', // Can be made configurable
      response_format: 'verbose_json',
    });

    return NextResponse.json({
      text: transcription.text,
      language: transcription.language,
      duration: transcription.duration,
      // Note: OpenAI Whisper doesn't return confidence scores
      // but we include this for future compatibility
      confidence: undefined,
    });
  } catch (error: any) {
    console.error('Transcription error:', error);

    // Handle specific OpenAI errors
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 500 }
      );
    }

    if (error.status === 413) {
      return NextResponse.json(
        { error: 'Audio file too large (max 25MB)' },
        { status: 413 }
      );
    }

    return NextResponse.json(
      {
        error: 'Transcription failed',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'transcription',
    model: 'whisper-1',
  });
}
