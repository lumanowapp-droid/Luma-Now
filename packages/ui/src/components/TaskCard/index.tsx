import React from 'react';
import type { Task } from '@multi-platform-app/types';
import { Text } from '../../primitives';

export interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onFocus: () => void;
  onDelete: () => void;
}

// Updated category colors to match our new playful palette
const categoryColors = {
  work: '#36C5F0',      // Slack-inspired vibrant blue
  personal: '#2EB67D',  // Vibrant green
  care: '#ECB22E',      // Warm yellow
  urgent: '#E01E5A',    // Playful pink-red
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onFocus,
  onDelete,
}) => {
  const borderColor = categoryColors[task.category as keyof typeof categoryColors] || categoryColors.personal;

  const handleToggle = () => {
    onToggle();
  };

  const handleFocus = () => {
    onFocus();
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div
      onClick={handleFocus}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        minHeight: '56px',
        borderLeftWidth: '6px',
        borderLeftColor: borderColor,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        cursor: 'pointer',
        marginBottom: '8px',
        opacity: task.completed ? 0.6 : 1,
        transform: task.completed ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.2s',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        gap: '16px',
      }}>
        {/* Completion Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '14px',
            border: '3px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          {task.completed && (
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '9px',
                backgroundColor: borderColor,
              }}
            />
          )}
        </button>

        {/* Task Content */}
        <div style={{ flex: 1 }}>
          <Text
            variant="body"
            style={{
              textDecoration: task.completed ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </Text>

          {task.duration && (
            <Text
              variant="caption"
              style={{
                marginTop: '6px',
                color: '#9CA3AF',
                fontSize: '13px',
                fontWeight: '500',
              }}
            >
              {task.duration} min
            </Text>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};