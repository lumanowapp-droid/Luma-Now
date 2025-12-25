import React from 'react';
import { useLumaStore } from '@luma/store';
import type { Task } from '@multi-platform-app/types';
import { TaskCard } from '../../components/TaskCard';
import { EmptyState } from '../../components/EmptyState';

export const Timeline: React.FC = () => {
  const tasks = useLumaStore((state) => state.tasks);
  const toggleTask = useLumaStore((state) => state.toggleTask);
  const removeTask = useLumaStore((state) => state.removeTask);
  const setCurrentView = useLumaStore((state) => state.setCurrentView);

  const handleFocus = (taskId: string) => {
    // Navigate to focus mode with this task
    useLumaStore.getState().startFocus(taskId);
    setCurrentView('focus');
  };

  const handleToggle = (taskId: string) => {
    toggleTask(taskId);
  };

  const handleDelete = (taskId: string) => {
    removeTask(taskId);
  };

  if (tasks.length === 0) {
    return (
      <EmptyState
        message="Your timeline is clear. Take a breath."
        icon="checkmark.circle"
      />
    );
  }

  const completedTasks = tasks.filter((t: Task) => t.completed);
  const incompleteTasks = tasks.filter((t: Task) => !t.completed);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-4">
        {incompleteTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={() => handleToggle(task.id)}
            onFocus={() => handleFocus(task.id)}
            onDelete={() => handleDelete(task.id)}
          />
        ))}

        {completedTasks.length > 0 && (
          <>
            <div className="h-8" />
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => handleToggle(task.id)}
                onFocus={() => handleFocus(task.id)}
                onDelete={() => handleDelete(task.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};