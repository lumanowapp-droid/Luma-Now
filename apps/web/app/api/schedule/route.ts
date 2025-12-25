import { NextRequest, NextResponse } from 'next/server';
import {
  optimizeTaskOrder,
  recommendBreaks,
  estimateCompletionTime,
  type AITask,
  type SchedulingPreferences,
} from '@multi-platform-app/ai';

interface ScheduleRequestBody {
  tasks: AITask[];
  preferences?: SchedulingPreferences;
  userId: string;
}

interface ScheduleResponse {
  success: boolean;
  optimizedTasks?: AITask[];
  breaks?: Array<{
    afterTaskIndex: number;
    duration: number;
    reason: string;
  }>;
  estimatedDuration?: number;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ScheduleResponse>> {
  try {
    const body: ScheduleRequestBody = await request.json();
    const { tasks, preferences = {}, userId } = body;

    // Validate input
    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json(
        { success: false, error: 'Tasks array is required' },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'userId is required and must be a string' },
        { status: 400 }
      );
    }

    if (tasks.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tasks array cannot be empty' },
        { status: 400 }
      );
    }

    // Optimize task order (alternate hard/easy)
    const optimizedTasks = optimizeTaskOrder(tasks);

    // Recommend breaks
    const breaks = recommendBreaks(optimizedTasks, preferences);

    // Estimate completion time
    const estimatedDuration = estimateCompletionTime(optimizedTasks, preferences);

    return NextResponse.json(
      {
        success: true,
        optimizedTasks,
        breaks,
        estimatedDuration,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Schedule API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while scheduling tasks' },
      { status: 500 }
    );
  }
}
