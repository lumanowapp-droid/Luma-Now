import { CAPACITY_AWARE_PROMPT, SCHEDULE_SYSTEM_PROMPT } from '../prompts';
import { getAIProvider, AIProvider, ModelTier } from '../providers';

export interface AITask {
  title: string;
  duration_minutes: number;
  color: 'blue' | 'coral' | 'green' | 'orange' | 'purple';
  reasoning: string;
}

export interface CompressionOptions {
  text: string;
  capacity?: 'light' | 'medium' | 'full';
  apiKey?: string;
  provider?: AIProvider;
  preferredProvider?: AIProvider;
  model?: ModelTier;
  maxTokens?: number;
}

export interface CompressionResult {
  success: boolean;
  tasks?: AITask[];
  error?: string;
}

/**
 * Validates that the AI response matches the expected task structure
 */
export function validateAIResponse(data: unknown): data is AITask[] {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every((task) => {
    return (
      typeof task === 'object' &&
      task !== null &&
      typeof task.title === 'string' &&
      task.title.length > 0 &&
      typeof task.duration_minutes === 'number' &&
      task.duration_minutes > 0 &&
      typeof task.color === 'string' &&
      ['blue', 'coral', 'green', 'orange', 'purple'].includes(task.color) &&
      typeof task.reasoning === 'string'
    );
  });
}

/**
 * Compresses brain dump text into structured tasks using AI
 *
 * @param options - Compression configuration
 * @returns Structured tasks or error
 */
export async function compressBrainDump(
  options: CompressionOptions
): Promise<CompressionResult> {
  const { text, capacity, apiKey, provider, preferredProvider, model, maxTokens = 2048 } = options;

  try {
    // Get AI provider (prioritizes user-selected provider with fallback)
    const aiProvider = getAIProvider({
      provider,
      apiKey,
      model,
    }, preferredProvider);

    // Use capacity-aware prompt if capacity is provided
    const systemPrompt = capacity
      ? CAPACITY_AWARE_PROMPT(capacity)
      : SCHEDULE_SYSTEM_PROMPT;

    // Call AI provider
    const response = await aiProvider.complete({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      maxTokens,
      temperature: 0.7,
    });

    // Parse response - try to extract JSON from the response
    let tasks: unknown;
    try {
      // First try direct JSON parse
      tasks = JSON.parse(response.content.trim());
    } catch (error) {
      // If direct parse fails, try to extract JSON array from the response
      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          tasks = JSON.parse(jsonMatch[0]);
        } catch (extractError) {
          return {
            success: false,
            error: 'Failed to parse AI response',
          };
        }
      } else {
        return {
          success: false,
          error: 'Failed to parse AI response',
        };
      }
    }

    // Validate response structure
    if (!validateAIResponse(tasks)) {
      return {
        success: false,
        error: 'AI response has invalid structure',
      };
    }

    // Enforce capacity limit if specified
    let validatedTasks = tasks;
    if (capacity) {
      const maxTasks = { light: 3, medium: 5, full: 7 }[capacity];
      if (validatedTasks.length > maxTasks) {
        validatedTasks = validatedTasks.slice(0, maxTasks);
      }
    }

    return {
      success: true,
      tasks: validatedTasks,
    };
  } catch (error) {
    console.error('Compression error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

/**
 * Streams brain dump compression with progress updates
 *
 * @param options - Compression configuration
 * @returns Readable stream of AI response
 */
export async function compressBrainDumpStream(
  options: CompressionOptions
): Promise<ReadableStream> {
  const { text, capacity, apiKey, provider, preferredProvider, model, maxTokens = 2048 } = options;

  // Get AI provider (prioritizes user-selected provider with fallback)
  const aiProvider = getAIProvider({
    provider,
    apiKey,
    model,
  }, preferredProvider);

  // Use capacity-aware prompt if capacity is provided
  const systemPrompt = capacity
    ? CAPACITY_AWARE_PROMPT(capacity)
    : SCHEDULE_SYSTEM_PROMPT;

  // Create streaming response
  return aiProvider.stream({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    maxTokens,
    temperature: 0.7,
  });
}
