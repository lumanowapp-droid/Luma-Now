/**
 * BrainDump - Web Implementation
 * Uses standard textarea with auto-grow functionality
 */

import React, { useRef, useCallback, useEffect } from 'react';
import type { BrainDumpProps } from './BrainDump';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  const updateTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 200), 600);
    textarea.style.height = `${newHeight}px`;
  }, []);

  // Update height when text changes
  useEffect(() => {
    updateTextareaHeight();
  }, [text, updateTextareaHeight]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
    requestAnimationFrame(updateTextareaHeight);
  };

  const handleCompress = async () => {
    if (!text.trim() || isProcessing) return;
    await onCompress(text);
  };

  const isDisabled = !text.trim() || isProcessing;

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Brain dump textarea with premium styling */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder={placeholder}
          disabled={isProcessing}
          style={{
            boxShadow: '0 2px 8px 0 rgb(0 0 0 / 0.06)',
          }}
          className="w-full resize-none rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-base text-[hsl(var(--card-foreground))] placeholder:text-[hsl(var(--muted-foreground))] p-6 pr-16 transition-all duration-[250ms] focus:outline-none focus:shadow-[0_0_0_2px_hsl(var(--primary)_/_0.4),_0_0_0_4px_hsl(var(--primary)_/_0.1)] focus:border-transparent h-[200px] min-h-[200px] max-h-[600px] hover:border-[hsl(var(--border))] hover:shadow-[0_4px_12px_0_rgb(0_0_0_/_0.08)] disabled:opacity-60 disabled:cursor-not-allowed [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[hsl(var(--muted-foreground)_/_0.3)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-[hsl(var(--muted-foreground)_/_0.5)]"
        />

        {/* Character count - refined styling */}
        <div className="absolute bottom-4 right-4 text-sm font-medium text-[hsl(var(--muted-foreground))] tracking-wide">
          {text.length.toLocaleString()}
        </div>
      </div>

      {/* Error message - premium styling */}
      {error && (
        <div className="mt-4 p-4 text-sm font-medium text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)_/_0.1)] rounded-xl border border-[hsl(var(--destructive)_/_0.3)] shadow-sm">
          {error}
        </div>
      )}

      {/* Compress button - stunning premium design */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleCompress}
          disabled={isDisabled}
          style={{
            boxShadow: isDisabled ? 'none' : '0 4px 12px 0 rgb(0 0 0 / 0.1)',
          }}
          className="group px-8 py-4 text-base font-semibold rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-[hsl(var(--primary-foreground))] transition-all duration-[250ms] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:shadow-[0_0_0_2px_hsl(var(--primary)_/_0.4),_0_0_0_4px_hsl(var(--primary)_/_0.1)] hover:scale-[1.02] hover:shadow-[0_8px_24px_-4px_rgb(0_0_0_/_0.15)] active:scale-[0.98] tracking-wide"
        >
          {isProcessing ? (
            <span className="flex items-center gap-3">
              <ProcessingDots className="text-[hsl(var(--primary-foreground))]" />
              <span>Compressing...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Compress with AI</span>
              <svg className="w-5 h-5 transition-transform duration-250 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
