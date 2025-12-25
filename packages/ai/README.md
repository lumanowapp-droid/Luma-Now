# @multi-platform-app/ai

AI Integration package for Luma Now - Enhanced intelligence that feels like a supportive friend.

## Overview

This package implements Epic 9: AI Integration with capacity-aware compression, intelligent scheduling, and gentle nudges. The AI serves as cognitive support for ADHD users, handling prioritization and scheduling while respecting user energy levels.

## Features

### 1. Capacity-Aware Compression

Compresses brain dump text into structured, prioritized tasks based on user's self-assessed capacity.

```typescript
import { compressBrainDump, CAPACITY_AWARE_PROMPT } from '@multi-platform-app/ai';

const result = await compressBrainDump({
  text: 'Need to finish report, call mom, exercise, grocery shopping...',
  capacity: 'light', // 'light' | 'medium' | 'full'
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Returns exactly 3 tasks for 'light', 5 for 'medium', 7 for 'full'
```

**Capacity Levels:**
- **Light**: 3 tasks max - For low-energy days
- **Medium**: 5 tasks max - Balanced workload
- **Full**: 7 tasks max - Good energy, but still needs balance

### 2. Intelligent Scheduling

Optimizes task order and recommends breaks based on energy impact and duration.

```typescript
import { optimizeTaskOrder, recommendBreaks, estimateCompletionTime } from '@multi-platform-app/ai';

// Alternate between draining and energizing tasks
const optimizedTasks = optimizeTaskOrder(tasks);

// Recommend breaks based on ultradian rhythm (90-min cycles)
const breaks = recommendBreaks(optimizedTasks, {
  breakDuration: 15,
  maxConsecutiveTasks: 3,
});

// Estimate total time including breaks and transitions
const totalMinutes = estimateCompletionTime(optimizedTasks);
```

**Energy Classification:**
- **Draining**: Work tasks, time-sensitive items (blue, orange)
- **Energizing**: Self-care, routine activities (purple, green)
- **Neutral**: Personal errands (coral)

### 3. Gentle Nudges

In-app messages that support without demanding. No aggressive notifications.

```typescript
import { checkNudges, createTaskCompletionNudge } from '@multi-platform-app/ai';

// Check all nudge conditions
const nudges = checkNudges({
  taskCount: 5,
  completedCount: 2,
  capacity: 'medium',
  focusElapsedMinutes: 95,
});

// Example nudge messages:
// "You started. That's the hardest part. Well done."
// "You've been in focus mode for 90 minutes. Time for a break?"
// "Everything's done. You did it. Take a moment to recognize that."
```

**Nudge Types:**
- **timeline_full**: Warn when approaching capacity
- **focus_duration**: Suggest breaks after 90/120 minutes
- **task_completion**: Celebrate progress
- **capacity_warning**: Gentle reminder about self-assessed limits
- **break_reminder**: Encourage breaks after 60 minutes
- **end_of_day**: Compassionate reflection

### 4. Enhanced Prompts

ADHD-aware prompts that respect neurodivergent needs.

```typescript
import {
  CAPACITY_AWARE_PROMPT,
  REFLECTION_PROMPT,
  DURATION_ESTIMATION_PROMPT,
  COMPRESSION_ERROR_MESSAGE,
} from '@multi-platform-app/ai';

// Capacity-aware system prompt
const prompt = CAPACITY_AWARE_PROMPT('light');

// Gentle error message
console.log(COMPRESSION_ERROR_MESSAGE);
// "That's a lot! Let's break it down together. Could you try describing your day in a bit less detail?"
```

## API Routes

### POST /api/compress

Compresses brain dump into structured tasks.

**Request:**
```json
{
  "text": "Brain dump text...",
  "userId": "user-123",
  "capacity": "medium",
  "stream": false
}
```

**Response:**
```json
{
  "success": true,
  "tasks": [
    {
      "title": "Finish quarterly report",
      "duration_minutes": 90,
      "color": "blue",
      "reasoning": "Time-sensitive work deadline"
    }
  ]
}
```

### POST /api/schedule

Optimizes task order and recommends breaks.

**Request:**
```json
{
  "tasks": [...],
  "userId": "user-123",
  "preferences": {
    "breakDuration": 15,
    "maxConsecutiveTasks": 3
  }
}
```

**Response:**
```json
{
  "success": true,
  "optimizedTasks": [...],
  "breaks": [
    {
      "afterTaskIndex": 2,
      "duration": 15,
      "reason": "Prevent burnout - time to reset"
    }
  ],
  "estimatedDuration": 240
}
```

## Design Philosophy

### ADHD-First Principles

1. **Capacity Awareness**: Respects user's self-assessment of energy
2. **Gentle Language**: Supportive friend, not nagging parent
3. **Realistic Time Estimation**: 25-50% buffer for task initiation
4. **Break Integration**: Ultradian rhythm (90-min cycles)
5. **Task Alternation**: Hard/easy balance to prevent burnout

### Prompt Engineering

All prompts follow these principles:
- Empathetic and understanding tone
- Specific, actionable output format
- ADHD-specific considerations (time blindness, task switching cost)
- Ruthless prioritization to prevent overwhelm
- Celebration of progress, normalization of struggles

## Type Definitions

```typescript
interface AITask {
  title: string;
  duration_minutes: number;
  color: 'blue' | 'coral' | 'green' | 'orange' | 'purple';
  reasoning: string;
}

interface CompressionOptions {
  text: string;
  capacity?: 'light' | 'medium' | 'full';
  apiKey: string;
  maxTokens?: number;
}

interface SchedulingPreferences {
  preferredStartTime?: string;
  breakDuration?: number;
  maxConsecutiveTasks?: number;
  alternateHardEasy?: boolean;
}

interface Nudge {
  type: NudgeType;
  message: string;
  tone: 'supportive' | 'celebratory' | 'gentle-warning';
  showInApp: boolean;
  dismissible: boolean;
}
```

## Color System

Tasks are categorized by color:

- **Blue** (#6B85A6): Work tasks, professional responsibilities
- **Coral**: Personal errands, life admin, household tasks
- **Green** (#7A9B8E): Routine activities (meals, exercise, daily habits)
- **Orange** (#C89B5C): Time-sensitive items with deadlines
- **Purple** (#9A8FB0): Self-care, mental health, breaks

## Development

```bash
# Build package
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm type-check
```

## Dependencies

- `@anthropic-ai/sdk`: Claude AI integration

## Related Packages

- `@multi-platform-app/types`: Shared TypeScript types
- `@multi-platform-app/store`: State management (capacity settings)
- `@multi-platform-app/ui`: UI components (nudge display)

## License

MIT
