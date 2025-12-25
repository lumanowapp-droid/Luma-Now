import { AITask } from '../compression';

export type NudgeType =
  | 'timeline_full'
  | 'focus_duration'
  | 'task_completion'
  | 'capacity_warning'
  | 'break_reminder'
  | 'end_of_day';

export interface Nudge {
  type: NudgeType;
  message: string;
  tone: 'supportive' | 'celebratory' | 'gentle-warning';
  showInApp: boolean;
  dismissible: boolean;
}

/**
 * Generates a gentle nudge when timeline is getting full
 *
 * @param currentTaskCount - Number of tasks in timeline
 * @param capacity - User's selected capacity
 * @returns Nudge message
 */
export function createTimelineFullNudge(
  currentTaskCount: number,
  capacity: 'light' | 'medium' | 'full'
): Nudge | null {
  const maxTasks = { light: 3, medium: 5, full: 7 }[capacity];

  // Only nudge when approaching capacity
  if (currentTaskCount < maxTasks - 1) {
    return null;
  }

  if (currentTaskCount === maxTasks - 1) {
    return {
      type: 'timeline_full',
      message: "Your timeline is almost at capacity. Remember to pace yourself.",
      tone: 'gentle-warning',
      showInApp: true,
      dismissible: true,
    };
  }

  if (currentTaskCount >= maxTasks) {
    return {
      type: 'timeline_full',
      message: "Your timeline is full. You've reached your capacity for today. Be kind to yourself.",
      tone: 'gentle-warning',
      showInApp: true,
      dismissible: true,
    };
  }

  return null;
}

/**
 * Generates a nudge for extended focus mode sessions
 *
 * @param elapsedMinutes - Time spent in focus mode
 * @returns Nudge message
 */
export function createFocusDurationNudge(elapsedMinutes: number): Nudge | null {
  // Nudge after 90 minutes (ultradian rhythm)
  if (elapsedMinutes >= 90 && elapsedMinutes < 95) {
    return {
      type: 'focus_duration',
      message: "You've been in focus mode for 90 minutes. Time for a break?",
      tone: 'supportive',
      showInApp: true,
      dismissible: true,
    };
  }

  // Stronger nudge after 2 hours
  if (elapsedMinutes >= 120 && elapsedMinutes < 125) {
    return {
      type: 'focus_duration',
      message: "You've been at this for 2 hours. Your brain needs rest. Take a real break.",
      tone: 'gentle-warning',
      showInApp: true,
      dismissible: false,
    };
  }

  return null;
}

/**
 * Generates a celebratory nudge for task completion
 *
 * @param completedCount - Number of tasks completed today
 * @param totalCount - Total tasks for the day
 * @returns Nudge message
 */
export function createTaskCompletionNudge(
  completedCount: number,
  totalCount: number
): Nudge | null {
  // Celebrate first task
  if (completedCount === 1) {
    return {
      type: 'task_completion',
      message: "You started. That's the hardest part. Well done.",
      tone: 'celebratory',
      showInApp: true,
      dismissible: true,
    };
  }

  // Celebrate halfway point
  if (completedCount === Math.floor(totalCount / 2) && totalCount > 2) {
    return {
      type: 'task_completion',
      message: "You're halfway there. That's real progress.",
      tone: 'celebratory',
      showInApp: true,
      dismissible: true,
    };
  }

  // Celebrate completion
  if (completedCount === totalCount && totalCount > 0) {
    return {
      type: 'task_completion',
      message: "Everything's done. You did it. Take a moment to recognize that.",
      tone: 'celebratory',
      showInApp: true,
      dismissible: true,
    };
  }

  // Celebrate any completion (generic)
  if (completedCount > 0 && completedCount % 3 === 0) {
    return {
      type: 'task_completion',
      message: `${completedCount} tasks completed. That's meaningful progress.`,
      tone: 'celebratory',
      showInApp: true,
      dismissible: true,
    };
  }

  return null;
}

/**
 * Generates a nudge when user tries to exceed capacity
 *
 * @param attemptedTaskCount - Number of tasks user is trying to add
 * @param capacity - User's selected capacity
 * @returns Nudge message
 */
export function createCapacityWarningNudge(
  attemptedTaskCount: number,
  capacity: 'light' | 'medium' | 'full'
): Nudge | null {
  const maxTasks = { light: 3, medium: 5, full: 7 }[capacity];

  if (attemptedTaskCount > maxTasks) {
    const excess = attemptedTaskCount - maxTasks;
    return {
      type: 'capacity_warning',
      message: `That's ${excess} more ${excess === 1 ? 'task' : 'tasks'} than your ${capacity} capacity. Remember: you chose ${capacity} energy for a reason.`,
      tone: 'gentle-warning',
      showInApp: true,
      dismissible: true,
    };
  }

  return null;
}

/**
 * Generates a break reminder nudge
 *
 * @param minutesSinceLastBreak - Time since last break or task completion
 * @returns Nudge message
 */
export function createBreakReminderNudge(minutesSinceLastBreak: number): Nudge | null {
  // Gentle reminder after 60 minutes
  if (minutesSinceLastBreak >= 60 && minutesSinceLastBreak < 65) {
    return {
      type: 'break_reminder',
      message: "You've been working for an hour. A 5-minute break helps more than pushing through.",
      tone: 'supportive',
      showInApp: true,
      dismissible: true,
    };
  }

  return null;
}

/**
 * Generates end-of-day reflection nudge
 *
 * @param tasks - Tasks from the day
 * @returns Nudge message
 */
export function createEndOfDayNudge(tasks: AITask[]): Nudge {
  const completedTasks = tasks.filter((t) => 'completed' in t && t.completed);
  const totalTasks = tasks.length;

  let message = "Today is ending. ";

  if (completedTasks.length === 0 && totalTasks > 0) {
    message += "You didn't check off tasks, but that doesn't mean you didn't do anything meaningful. Tomorrow is a new day.";
  } else if (completedTasks.length === totalTasks && totalTasks > 0) {
    message += `You completed everything. That's remarkable. Celebrate that.`;
  } else if (completedTasks.length > 0) {
    message += `You completed ${completedTasks.length} of ${totalTasks} tasks. That's real work. The rest can wait.`;
  } else {
    message += "How are you feeling about today? Tomorrow is a fresh start.";
  }

  return {
    type: 'end_of_day',
    message,
    tone: 'supportive',
    showInApp: true,
    dismissible: true,
  };
}

/**
 * Checks all nudge conditions and returns applicable nudges
 *
 * @param context - Current app context
 * @returns Array of applicable nudges
 */
export function checkNudges(context: {
  taskCount?: number;
  completedCount?: number;
  capacity?: 'light' | 'medium' | 'full';
  focusElapsedMinutes?: number;
  minutesSinceLastBreak?: number;
  isEndOfDay?: boolean;
  tasks?: AITask[];
}): Nudge[] {
  const nudges: Nudge[] = [];

  // Check timeline full
  if (context.taskCount !== undefined && context.capacity) {
    const timelineNudge = createTimelineFullNudge(context.taskCount, context.capacity);
    if (timelineNudge) nudges.push(timelineNudge);
  }

  // Check focus duration
  if (context.focusElapsedMinutes !== undefined) {
    const focusNudge = createFocusDurationNudge(context.focusElapsedMinutes);
    if (focusNudge) nudges.push(focusNudge);
  }

  // Check task completion
  if (context.completedCount !== undefined && context.taskCount !== undefined) {
    const completionNudge = createTaskCompletionNudge(
      context.completedCount,
      context.taskCount
    );
    if (completionNudge) nudges.push(completionNudge);
  }

  // Check capacity warning
  if (context.taskCount !== undefined && context.capacity) {
    const capacityNudge = createCapacityWarningNudge(context.taskCount, context.capacity);
    if (capacityNudge) nudges.push(capacityNudge);
  }

  // Check break reminder
  if (context.minutesSinceLastBreak !== undefined) {
    const breakNudge = createBreakReminderNudge(context.minutesSinceLastBreak);
    if (breakNudge) nudges.push(breakNudge);
  }

  // Check end of day
  if (context.isEndOfDay && context.tasks) {
    const endOfDayNudge = createEndOfDayNudge(context.tasks);
    nudges.push(endOfDayNudge);
  }

  return nudges;
}
