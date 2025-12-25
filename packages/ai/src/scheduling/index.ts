import { AITask } from '../compression';

export interface TaskWithHistory {
  title: string;
  category: string;
  historicalDurations?: number[];
  energyImpact?: 'draining' | 'neutral' | 'energizing';
}

export interface SchedulingPreferences {
  preferredStartTime?: string;
  breakDuration?: number;
  maxConsecutiveTasks?: number;
  alternateHardEasy?: boolean;
}

/**
 * Suggests task duration based on historical data
 *
 * @param task - Task with historical duration data
 * @returns Suggested duration in minutes
 */
export function suggestDuration(task: TaskWithHistory): number {
  if (!task.historicalDurations || task.historicalDurations.length === 0) {
    // Default durations by category
    const defaultDurations = {
      work: 60,
      personal: 30,
      care: 45,
      routine: 15,
    };

    return defaultDurations[task.category as keyof typeof defaultDurations] || 30;
  }

  // Calculate average from historical data
  const average =
    task.historicalDurations.reduce((sum, duration) => sum + duration, 0) /
    task.historicalDurations.length;

  // Add 25% buffer for ADHD time blindness
  return Math.round(average * 1.25);
}

/**
 * Identifies whether a task is energy-draining or energizing
 *
 * @param task - Task to analyze
 * @returns Energy impact classification
 */
export function classifyEnergyImpact(
  task: AITask
): 'draining' | 'neutral' | 'energizing' {
  // Tasks marked as purple (self-care) are energizing
  if (task.color === 'purple' || task.color === 'green') {
    return 'energizing';
  }

  // Time-sensitive or work tasks are typically draining
  if (task.color === 'orange' || task.color === 'blue') {
    return 'draining';
  }

  return 'neutral';
}

/**
 * Orders tasks to alternate between hard and easy
 *
 * @param tasks - Array of tasks to order
 * @returns Reordered tasks
 */
export function optimizeTaskOrder(tasks: AITask[]): AITask[] {
  // Classify tasks by energy impact
  const classified = tasks.map((task) => ({
    task,
    energy: classifyEnergyImpact(task),
  }));

  // Separate into categories
  const draining = classified.filter((t) => t.energy === 'draining');
  const energizing = classified.filter((t) => t.energy === 'energizing');
  const neutral = classified.filter((t) => t.energy === 'neutral');

  // Alternate: draining → energizing/neutral → draining → energizing/neutral
  const ordered: AITask[] = [];
  const recovery = [...energizing, ...neutral];

  let drainingIndex = 0;
  let recoveryIndex = 0;

  while (drainingIndex < draining.length || recoveryIndex < recovery.length) {
    // Add a draining task
    if (drainingIndex < draining.length) {
      ordered.push(draining[drainingIndex].task);
      drainingIndex++;
    }

    // Add a recovery task
    if (recoveryIndex < recovery.length) {
      ordered.push(recovery[recoveryIndex].task);
      recoveryIndex++;
    }
  }

  return ordered;
}

/**
 * Recommends break intervals based on task schedule
 *
 * @param tasks - Array of tasks
 * @param preferences - User scheduling preferences
 * @returns Array of break recommendations
 */
export function recommendBreaks(
  tasks: AITask[],
  preferences: SchedulingPreferences = {}
): { afterTaskIndex: number; duration: number; reason: string }[] {
  const {
    breakDuration = 15,
    maxConsecutiveTasks = 3,
  } = preferences;

  const breaks: { afterTaskIndex: number; duration: number; reason: string }[] = [];
  let consecutiveCount = 0;
  let totalDuration = 0;

  tasks.forEach((task, index) => {
    consecutiveCount++;
    totalDuration += task.duration_minutes;

    // Recommend break after max consecutive tasks
    if (consecutiveCount >= maxConsecutiveTasks && index < tasks.length - 1) {
      breaks.push({
        afterTaskIndex: index,
        duration: breakDuration,
        reason: 'Prevent burnout - time to reset',
      });
      consecutiveCount = 0;
      totalDuration = 0;
    }

    // Recommend break after 90 minutes of work (ultradian rhythm)
    if (totalDuration >= 90 && index < tasks.length - 1) {
      breaks.push({
        afterTaskIndex: index,
        duration: breakDuration,
        reason: 'Natural energy cycle - recharge time',
      });
      totalDuration = 0;
    }

    // Recommend break after draining tasks
    if (classifyEnergyImpact(task) === 'draining' && index < tasks.length - 1) {
      const nextTask = tasks[index + 1];
      if (nextTask && classifyEnergyImpact(nextTask) === 'draining') {
        breaks.push({
          afterTaskIndex: index,
          duration: breakDuration,
          reason: 'Two challenging tasks - breathe between them',
        });
      }
    }
  });

  return breaks;
}

/**
 * Calculates estimated completion time for task list
 *
 * @param tasks - Array of tasks
 * @param preferences - User scheduling preferences
 * @returns Total estimated duration in minutes
 */
export function estimateCompletionTime(
  tasks: AITask[],
  preferences: SchedulingPreferences = {}
): number {
  const taskDuration = tasks.reduce((sum, task) => sum + task.duration_minutes, 0);
  const breaks = recommendBreaks(tasks, preferences);
  const breakDuration = breaks.reduce((sum, b) => sum + b.duration, 0);

  // Add 10-minute transitions between tasks (ADHD task switching cost)
  const transitionTime = Math.max(0, tasks.length - 1) * 10;

  return taskDuration + breakDuration + transitionTime;
}
