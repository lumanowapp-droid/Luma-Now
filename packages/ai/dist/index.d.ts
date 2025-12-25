declare const SCHEDULE_SYSTEM_PROMPT = "You are an empathetic AI assistant helping someone with ADHD plan their day effectively. Transform unstructured thoughts into realistic, achievable schedules that respect neurodivergent needs.\n\nCore Principles:\n- Realistic Time Estimation: Add 25-50% buffer time. Account for task initiation difficulty.\n- Breathing Room: Build 10-15 minute transitions between activities. Never schedule back-to-back.\n- Protected Personal Time: Meals, breaks, and rest are non-negotiable anchor points.\n- Gentle Language: Avoid stress-inducing words. Use encouraging, neutral language.\n- Ruthless Prioritization: Compress to 3-5 meaningful items maximum.\n\nOutput Format: Return ONLY a valid JSON array with this exact structure. Do not include any other text, explanations, or formatting:\n[\n  {\n    \"title\": \"Clear, actionable task name\",\n    \"duration_minutes\": 60,\n    \"color\": \"blue\",\n    \"reasoning\": \"Brief explanation of why this matters\"\n  }\n]\n\nColor System:\n- blue: Work tasks, professional responsibilities\n- coral: Personal errands, life admin, household tasks\n- green: Routine activities (meals, exercise, daily habits)\n- orange: Time-sensitive items with deadlines\n- purple: Self-care, mental health, breaks\n\nADHD-Specific Considerations:\n- Task switching costs 10-20 minutes of mental energy\n- Time blindness affects perception - use specific durations\n- Mental energy fluctuates - alternate demanding and easier tasks\n- Break tasks smaller if motivation feels impossible\n- Make tasks concrete and specific to avoid analysis paralysis\n\nDecision Framework:\n1. What HAS to happen today (true deadlines)?\n2. What would make today feel successful?\n3. What supports wellbeing?\n4. What can wait until tomorrow?\n\nRemember: Sustainable pace over sprint-and-crash cycles. Schedule should feel doable, not daunting.";
/**
 * Capacity-aware prompt that respects user's self-assessed energy level
 */
declare function CAPACITY_AWARE_PROMPT(capacity: 'light' | 'medium' | 'full'): string;
/**
 * Gentle error message for AI failures
 */
declare const COMPRESSION_ERROR_MESSAGE = "That's a lot! Let's break it down together. Could you try describing your day in a bit less detail?";
/**
 * Reflection prompt for end-of-day review
 */
declare const REFLECTION_PROMPT = "You are helping someone with ADHD reflect on their day with kindness and self-compassion.\n\nReview their completed and incomplete tasks, and provide:\n1. Recognition of what they accomplished (no matter how small)\n2. Understanding for what didn't get done (without judgment)\n3. A gentle suggestion for tomorrow if appropriate\n\nTone: Supportive friend, not harsh critic. Celebrate progress, normalize struggles.\n\nOutput Format: Return a JSON object:\n{\n  \"message\": \"Your compassionate reflection message\",\n  \"wins\": [\"Specific accomplishment 1\", \"Specific accomplishment 2\"],\n  \"tomorrow_suggestion\": \"Optional gentle suggestion\"\n}";
/**
 * Task duration estimation prompt
 */
declare const DURATION_ESTIMATION_PROMPT = "You are helping someone with ADHD estimate realistic task durations.\n\nKey principles:\n- Add 25-50% buffer for task initiation and transitions\n- Account for ADHD time blindness\n- Break large tasks into smaller chunks (max 90 minutes per chunk)\n- Include break time between tasks\n\nReturn duration in minutes as a number.";

/**
 * AI Provider Types and Interfaces
 * Supports multiple AI providers: Cloudflare Workers AI, Anthropic, OpenAI
 */
type AIProvider = 'cloudflare' | 'anthropic' | 'openai';
interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
interface AICompletionRequest {
    messages: AIMessage[];
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
}
interface AICompletionResponse {
    content: string;
    finishReason?: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
interface AIProviderConfig {
    provider: AIProvider;
    apiKey?: string;
    accountId?: string;
    model?: string;
}
interface AIProviderAdapter {
    complete(request: AICompletionRequest): Promise<AICompletionResponse>;
    stream(request: AICompletionRequest): ReadableStream;
    getProvider(): AIProvider;
}
declare const PROVIDER_MODELS: {
    readonly cloudflare: {
        readonly default: "@cf/meta/llama-3.1-70b-instruct";
        readonly fast: "@cf/meta/llama-3.1-8b-instruct";
        readonly smart: "@cf/meta/llama-3.1-70b-instruct";
        readonly vision: "@cf/llava-hf/llava-1.5-7b-hf";
    };
    readonly anthropic: {
        readonly default: "claude-3-5-sonnet-20241022";
        readonly fast: "claude-3-5-haiku-20241022";
        readonly smart: "claude-3-5-sonnet-20241022";
        readonly opus: "claude-3-opus-20240229";
    };
    readonly openai: {
        readonly default: "gpt-4o-mini";
        readonly fast: "gpt-4o-mini";
        readonly smart: "gpt-4o";
        readonly vision: "gpt-4o";
    };
};
type ProviderModels = typeof PROVIDER_MODELS;
type ModelTier = 'default' | 'fast' | 'smart' | 'vision' | 'opus';

/**
 * Cloudflare Workers AI Provider Adapter
 * Default provider for cost-effective AI operations
 */

declare class CloudflareAIAdapter implements AIProviderAdapter {
    private accountId;
    private apiKey;
    private model;
    constructor(config: {
        accountId: string;
        apiKey: string;
        model?: ModelTier;
    });
    getProvider(): AIProvider;
    complete(request: AICompletionRequest): Promise<AICompletionResponse>;
    stream(request: AICompletionRequest): ReadableStream;
}

/**
 * Anthropic Claude AI Provider Adapter
 */

declare class AnthropicAIAdapter implements AIProviderAdapter {
    private client;
    private model;
    constructor(config: {
        apiKey: string;
        model?: ModelTier;
    });
    getProvider(): AIProvider;
    complete(request: AICompletionRequest): Promise<AICompletionResponse>;
    stream(request: AICompletionRequest): ReadableStream;
}

/**
 * OpenAI Provider Adapter
 */

declare class OpenAIAdapter implements AIProviderAdapter {
    private apiKey;
    private model;
    constructor(config: {
        apiKey: string;
        model?: ModelTier;
    });
    getProvider(): AIProvider;
    complete(request: AICompletionRequest): Promise<AICompletionResponse>;
    stream(request: AICompletionRequest): ReadableStream;
}

/**
 * AI Provider Factory
 * Creates appropriate AI adapter based on configuration
 */

declare class AIProviderFactory {
    /**
     * Create an AI provider adapter based on configuration
     * Defaults to Cloudflare Workers AI if not specified
     */
    static create(config?: Partial<AIProviderConfig>): AIProviderAdapter;
    /**
     * Get default provider (Cloudflare Workers AI)
     */
    static getDefaultProvider(): AIProviderAdapter;
    /**
     * Try providers in order of preference: preferred -> Cloudflare -> Anthropic -> OpenAI
     */
    static createWithFallback(preferredProvider?: AIProvider): AIProviderAdapter;
}
declare function getAIProvider(config?: Partial<AIProviderConfig>, preferredProvider?: AIProvider): AIProviderAdapter;

interface AITask {
    title: string;
    duration_minutes: number;
    color: 'blue' | 'coral' | 'green' | 'orange' | 'purple';
    reasoning: string;
}
interface CompressionOptions {
    text: string;
    capacity?: 'light' | 'medium' | 'full';
    apiKey?: string;
    provider?: AIProvider;
    preferredProvider?: AIProvider;
    model?: ModelTier;
    maxTokens?: number;
}
interface CompressionResult {
    success: boolean;
    tasks?: AITask[];
    error?: string;
}
/**
 * Validates that the AI response matches the expected task structure
 */
declare function validateAIResponse(data: unknown): data is AITask[];
/**
 * Compresses brain dump text into structured tasks using AI
 *
 * @param options - Compression configuration
 * @returns Structured tasks or error
 */
declare function compressBrainDump(options: CompressionOptions): Promise<CompressionResult>;
/**
 * Streams brain dump compression with progress updates
 *
 * @param options - Compression configuration
 * @returns Readable stream of AI response
 */
declare function compressBrainDumpStream(options: CompressionOptions): Promise<ReadableStream>;

interface TaskWithHistory {
    title: string;
    category: string;
    historicalDurations?: number[];
    energyImpact?: 'draining' | 'neutral' | 'energizing';
}
interface SchedulingPreferences {
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
declare function suggestDuration(task: TaskWithHistory): number;
/**
 * Identifies whether a task is energy-draining or energizing
 *
 * @param task - Task to analyze
 * @returns Energy impact classification
 */
declare function classifyEnergyImpact(task: AITask): 'draining' | 'neutral' | 'energizing';
/**
 * Orders tasks to alternate between hard and easy
 *
 * @param tasks - Array of tasks to order
 * @returns Reordered tasks
 */
declare function optimizeTaskOrder(tasks: AITask[]): AITask[];
/**
 * Recommends break intervals based on task schedule
 *
 * @param tasks - Array of tasks
 * @param preferences - User scheduling preferences
 * @returns Array of break recommendations
 */
declare function recommendBreaks(tasks: AITask[], preferences?: SchedulingPreferences): {
    afterTaskIndex: number;
    duration: number;
    reason: string;
}[];
/**
 * Calculates estimated completion time for task list
 *
 * @param tasks - Array of tasks
 * @param preferences - User scheduling preferences
 * @returns Total estimated duration in minutes
 */
declare function estimateCompletionTime(tasks: AITask[], preferences?: SchedulingPreferences): number;

type NudgeType = 'timeline_full' | 'focus_duration' | 'task_completion' | 'capacity_warning' | 'break_reminder' | 'end_of_day';
interface Nudge {
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
declare function createTimelineFullNudge(currentTaskCount: number, capacity: 'light' | 'medium' | 'full'): Nudge | null;
/**
 * Generates a nudge for extended focus mode sessions
 *
 * @param elapsedMinutes - Time spent in focus mode
 * @returns Nudge message
 */
declare function createFocusDurationNudge(elapsedMinutes: number): Nudge | null;
/**
 * Generates a celebratory nudge for task completion
 *
 * @param completedCount - Number of tasks completed today
 * @param totalCount - Total tasks for the day
 * @returns Nudge message
 */
declare function createTaskCompletionNudge(completedCount: number, totalCount: number): Nudge | null;
/**
 * Generates a nudge when user tries to exceed capacity
 *
 * @param attemptedTaskCount - Number of tasks user is trying to add
 * @param capacity - User's selected capacity
 * @returns Nudge message
 */
declare function createCapacityWarningNudge(attemptedTaskCount: number, capacity: 'light' | 'medium' | 'full'): Nudge | null;
/**
 * Generates a break reminder nudge
 *
 * @param minutesSinceLastBreak - Time since last break or task completion
 * @returns Nudge message
 */
declare function createBreakReminderNudge(minutesSinceLastBreak: number): Nudge | null;
/**
 * Generates end-of-day reflection nudge
 *
 * @param tasks - Tasks from the day
 * @returns Nudge message
 */
declare function createEndOfDayNudge(tasks: AITask[]): Nudge;
/**
 * Checks all nudge conditions and returns applicable nudges
 *
 * @param context - Current app context
 * @returns Array of applicable nudges
 */
declare function checkNudges(context: {
    taskCount?: number;
    completedCount?: number;
    capacity?: 'light' | 'medium' | 'full';
    focusElapsedMinutes?: number;
    minutesSinceLastBreak?: number;
    isEndOfDay?: boolean;
    tasks?: AITask[];
}): Nudge[];

export { type AICompletionRequest, type AICompletionResponse, type AIMessage, type AIProvider, type AIProviderAdapter, type AIProviderConfig, AIProviderFactory, type AITask, AnthropicAIAdapter, CAPACITY_AWARE_PROMPT, COMPRESSION_ERROR_MESSAGE, CloudflareAIAdapter, type CompressionOptions, type CompressionResult, DURATION_ESTIMATION_PROMPT, type ModelTier, type Nudge, type NudgeType, OpenAIAdapter, PROVIDER_MODELS, type ProviderModels, REFLECTION_PROMPT, SCHEDULE_SYSTEM_PROMPT, type SchedulingPreferences, type TaskWithHistory, checkNudges, classifyEnergyImpact, compressBrainDump, compressBrainDumpStream, createBreakReminderNudge, createCapacityWarningNudge, createEndOfDayNudge, createFocusDurationNudge, createTaskCompletionNudge, createTimelineFullNudge, estimateCompletionTime, getAIProvider, optimizeTaskOrder, recommendBreaks, suggestDuration, validateAIResponse };
