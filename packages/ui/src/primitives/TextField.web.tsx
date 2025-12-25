/**
 * TextField Primitive - Web Implementation
 * Uses textarea with auto-growing capability
 */

import React, { useRef, useEffect } from 'react';
import { TextFieldProps, getTextFieldStyles } from './TextField';
import { baseColors } from '../tokens/colors';
import { fontSizes } from '../tokens/typography';
import { focusRingCSS } from '../tokens/shadows';

export const TextField: React.FC<TextFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  multiline = true,
  autoGrow = true,
  maxLength,
  showCharacterCount = false,
  disabled = false,
  error,
  label,
  autoFocus = false,
  testID,
  style,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasError = !!error;

  // Auto-grow functionality
  useEffect(() => {
    if (autoGrow && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value, autoGrow]);

  // No styling for basic pages
  const textareaStyle: React.CSSProperties = {
    width: '100%',
    resize: autoGrow ? 'none' : 'vertical',
    outline: 'none',
    transition: 'border-color 200ms ease-out, box-shadow 200ms ease-out',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    ...style,
  };

  const characterCount = showCharacterCount && maxLength ? (
    <div
      style={{
        fontSize: fontSizes.caption.fontSize,
        color: baseColors.textMuted,
        textAlign: 'right',
        marginTop: 4,
      }}
    >
      {value.length}/{maxLength}
    </div>
  ) : null;

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: fontSizes.label.fontSize,
            color: baseColors.textPrimary,
            marginBottom: 8,
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoFocus={autoFocus}
        data-testid={testID}
        style={textareaStyle}
        onFocus={(e) => {
          if (!disabled && !hasError) {
            e.target.style.boxShadow = focusRingCSS;
            e.target.style.borderColor = baseColors.border;
          }
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = 'none';
        }}
      />
      {error && (
        <div
          style={{
            fontSize: fontSizes.caption.fontSize,
            color: baseColors.textMuted,
            marginTop: 4,
          }}
        >
          {error}
        </div>
      )}
      {characterCount}
    </div>
  );
};
