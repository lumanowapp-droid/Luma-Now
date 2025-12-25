import React from 'react';
import { Text } from '../../primitives';

export interface EmptyStateProps {
  message: string;
  icon?: string;
  subMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon,
  subMessage,
}) => {
  return (
    <div style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      backgroundColor: 'transparent',
    }}>
      {/* Icon placeholder - would use actual icon library in production */}
      {icon && (
        <div style={{
          width: '80px',
          height: '80px',
          marginBottom: '32px',
          borderRadius: '40px',
          backgroundColor: '#E0F2FE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px 0 rgb(0 0 0 / 0.2)',
        }}>
          <Text variant="heading" style={{
            color: '#36C5F0',
            fontSize: '32px',
          }}>
            ✓
          </Text>
        </div>
      )}

      {/* Main message */}
      <Text variant="body" style={{
        color: '#374151',
        textAlign: 'center',
        marginBottom: '12px',
        fontSize: '18px',
        lineHeight: '28px',
      }}>
        {message}
      </Text>

      {/* Optional sub-message */}
      {subMessage && (
        <Text variant="caption" style={{
          color: '#9CA3AF',
          textAlign: 'center',
          fontSize: '16px',
          lineHeight: '24px',
        }}>
          {subMessage}
        </Text>
      )}
    </div>
  );
};