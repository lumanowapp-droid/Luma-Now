// src/prompts.ts
var SCHEDULE_SYSTEM_PROMPT = `You are an empathetic AI assistant helping someone with ADHD plan their day effectively. Transform unstructured thoughts into realistic, achievable schedules that respect neurodivergent needs.

Core Principles:
- Realistic Time Estimation: Add 25-50% buffer time. Account for task initiation difficulty.
- Breathing Room: Build 10-15 minute transitions between activities. Never schedule back-to-back.
- Protected Personal Time: Meals, breaks, and rest are non-negotiable anchor points.
- Gentle Language: Avoid stress-inducing words. Use encouraging, neutral language.
- Ruthless Prioritization: Compress to 3-5 meaningful items maximum.

Output Format: Return ONLY a valid JSON array with this exact structure. Do not include any other text, explanations, or formatting:
[
  {
    "title": "Clear, actionable task name",
    "duration_minutes": 60,
    "color": "blue",
    "reasoning": "Brief explanation of why this matters"
  }
]

Color System:
- blue: Work tasks, professional responsibilities
- coral: Personal errands, life admin, household tasks
- green: Routine activities (meals, exercise, daily habits)
- orange: Time-sensitive items with deadlines
- purple: Self-care, mental health, breaks

ADHD-Specific Considerations:
- Task switching costs 10-20 minutes of mental energy
- Time blindness affects perception - use specific durations
- Mental energy fluctuates - alternate demanding and easier tasks
- Break tasks smaller if motivation feels impossible
- Make tasks concrete and specific to avoid analysis paralysis

Decision Framework:
1. What HAS to happen today (true deadlines)?
2. What would make today feel successful?
3. What supports wellbeing?
4. What can wait until tomorrow?

Remember: Sustainable pace over sprint-and-crash cycles. Schedule should feel doable, not daunting.`;
function CAPACITY_AWARE_PROMPT(capacity) {
  const maxTasks = { light: 3, medium: 5, full: 7 }[capacity];
  const capacityGuidance = {
    light: "They have LIMITED energy today - prioritize only the truly essential. This is a low-energy day.",
    medium: "They have MODERATE energy today - a balanced workload with room to breathe.",
    full: "They have GOOD energy today - they can handle more, but still need balance and breaks."
  }[capacity];
  return `You are helping someone with ADHD plan their day. They have ${capacity} capacity today.

${capacityGuidance}

CRITICAL: Return exactly ${maxTasks} tasks, no more. Ruthlessly prioritize.

${SCHEDULE_SYSTEM_PROMPT}

Remember: This person chose "${capacity}" capacity. Respect that self-awareness. Don't overfill their day. ${maxTasks} tasks maximum.`;
}
var COMPRESSION_ERROR_MESSAGE = "That's a lot! Let's break it down together. Could you try describing your day in a bit less detail?";
var REFLECTION_PROMPT = `You are helping someone with ADHD reflect on their day with kindness and self-compassion.

Review their completed and incomplete tasks, and provide:
1. Recognition of what they accomplished (no matter how small)
2. Understanding for what didn't get done (without judgment)
3. A gentle suggestion for tomorrow if appropriate

Tone: Supportive friend, not harsh critic. Celebrate progress, normalize struggles.

Output Format: Return a JSON object:
{
  "message": "Your compassionate reflection message",
  "wins": ["Specific accomplishment 1", "Specific accomplishment 2"],
  "tomorrow_suggestion": "Optional gentle suggestion"
}`;
var DURATION_ESTIMATION_PROMPT = `You are helping someone with ADHD estimate realistic task durations.

Key principles:
- Add 25-50% buffer for task initiation and transitions
- Account for ADHD time blindness
- Break large tasks into smaller chunks (max 90 minutes per chunk)
- Include break time between tasks

Return duration in minutes as a number.`;

// src/providers/types.ts
var PROVIDER_MODELS = {
  cloudflare: {
    default: "@cf/meta/llama-3.1-70b-instruct",
    fast: "@cf/meta/llama-3.1-8b-instruct",
    smart: "@cf/meta/llama-3.1-70b-instruct",
    vision: "@cf/llava-hf/llava-1.5-7b-hf"
  },
  anthropic: {
    default: "claude-3-5-sonnet-20241022",
    fast: "claude-3-5-haiku-20241022",
    smart: "claude-3-5-sonnet-20241022",
    opus: "claude-3-opus-20240229"
  },
  openai: {
    default: "gpt-4o-mini",
    fast: "gpt-4o-mini",
    smart: "gpt-4o",
    vision: "gpt-4o"
  }
};

// src/providers/cloudflare.ts
var CloudflareAIAdapter = class {
  accountId;
  apiKey;
  model;
  constructor(config) {
    if (!config.accountId || !config.apiKey) {
      throw new Error("Cloudflare account ID and API key are required");
    }
    this.accountId = config.accountId;
    this.apiKey = config.apiKey;
    this.model = PROVIDER_MODELS.cloudflare[config.model] || PROVIDER_MODELS.cloudflare.default;
  }
  getProvider() {
    return "cloudflare";
  }
  async complete(request) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${this.model}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
        stream: false
      })
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare AI request failed: ${error}`);
    }
    const data = await response.json();
    return {
      content: data.result?.response || data.result?.generated_text || "",
      finishReason: "stop",
      usage: {
        promptTokens: 0,
        // Cloudflare doesn't provide token counts
        completionTokens: 0,
        totalTokens: 0
      }
    };
  }
  stream(request) {
    const accountId = this.accountId;
    const apiKey = this.apiKey;
    const model = this.model;
    return new ReadableStream({
      async start(controller) {
        const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              messages: request.messages,
              temperature: request.temperature ?? 0.7,
              max_tokens: request.maxTokens ?? 2048,
              stream: true
            })
          });
          if (!response.ok) {
            throw new Error(`Cloudflare AI stream failed: ${response.statusText}`);
          }
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("No response body");
          }
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((line) => line.trim());
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  controller.close();
                  return;
                }
                try {
                  const json = JSON.parse(data);
                  const content = json.response || json.generated_text || "";
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch (e) {
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      }
    });
  }
};

// src/providers/anthropic.ts
import Anthropic from "@anthropic-ai/sdk";
var AnthropicAIAdapter = class {
  client;
  model;
  constructor(config) {
    if (!config.apiKey) {
      throw new Error("Anthropic API key is required");
    }
    this.client = new Anthropic({
      apiKey: config.apiKey
    });
    this.model = PROVIDER_MODELS.anthropic[config.model] || PROVIDER_MODELS.anthropic.default;
  }
  getProvider() {
    return "anthropic";
  }
  async complete(request) {
    const systemMessage = request.messages.find((m) => m.role === "system");
    const messages = request.messages.filter((m) => m.role !== "system").map((m) => ({
      role: m.role,
      content: m.content
    }));
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: request.maxTokens ?? 2048,
      temperature: request.temperature ?? 0.7,
      system: systemMessage?.content,
      messages
    });
    const content = response.content[0].type === "text" ? response.content[0].text : "";
    return {
      content,
      finishReason: response.stop_reason || "stop",
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      }
    };
  }
  stream(request) {
    const client = this.client;
    const model = this.model;
    return new ReadableStream({
      async start(controller) {
        try {
          const systemMessage = request.messages.find((m) => m.role === "system");
          const messages = request.messages.filter((m) => m.role !== "system").map((m) => ({
            role: m.role,
            content: m.content
          }));
          const stream = await client.messages.stream({
            model,
            max_tokens: request.maxTokens ?? 2048,
            temperature: request.temperature ?? 0.7,
            system: systemMessage?.content,
            messages
          });
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              const text = event.delta.text;
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });
  }
};

// src/providers/openai.ts
var OpenAIAdapter = class {
  apiKey;
  model;
  constructor(config) {
    if (!config.apiKey) {
      throw new Error("OpenAI API key is required");
    }
    this.apiKey = config.apiKey;
    this.model = PROVIDER_MODELS.openai[config.model] || PROVIDER_MODELS.openai.default;
  }
  getProvider() {
    return "openai";
  }
  async complete(request) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
        stream: false
      })
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI request failed: ${error}`);
    }
    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || "",
      finishReason: data.choices[0]?.finish_reason || "stop",
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      }
    };
  }
  stream(request) {
    const apiKey = this.apiKey;
    const model = this.model;
    return new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                model,
                messages: request.messages,
                temperature: request.temperature ?? 0.7,
                max_tokens: request.maxTokens ?? 2048,
                stream: true
              })
            }
          );
          if (!response.ok) {
            throw new Error(`OpenAI stream failed: ${response.statusText}`);
          }
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("No response body");
          }
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((line) => line.trim());
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  controller.close();
                  return;
                }
                try {
                  const json = JSON.parse(data);
                  const content = json.choices[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch (e) {
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      }
    });
  }
};

// src/providers/factory.ts
var AIProviderFactory = class {
  /**
   * Create an AI provider adapter based on configuration
   * Defaults to Cloudflare Workers AI if not specified
   */
  static create(config) {
    const provider = config?.provider || "cloudflare";
    const modelTier = config?.model || "default";
    switch (provider) {
      case "cloudflare": {
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || config?.accountId;
        const apiKey = process.env.CLOUDFLARE_API_TOKEN || config?.apiKey;
        if (!accountId || !apiKey) {
          throw new Error(
            "Cloudflare account ID and API token are required. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables."
          );
        }
        return new CloudflareAIAdapter({
          accountId,
          apiKey,
          model: modelTier
        });
      }
      case "anthropic": {
        const apiKey = process.env.ANTHROPIC_API_KEY || config?.apiKey;
        if (!apiKey) {
          throw new Error(
            "Anthropic API key is required. Set ANTHROPIC_API_KEY environment variable."
          );
        }
        return new AnthropicAIAdapter({
          apiKey,
          model: modelTier
        });
      }
      case "openai": {
        const apiKey = process.env.OPENAI_API_KEY || config?.apiKey;
        if (!apiKey) {
          throw new Error(
            "OpenAI API key is required. Set OPENAI_API_KEY environment variable."
          );
        }
        return new OpenAIAdapter({
          apiKey,
          model: modelTier
        });
      }
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }
  /**
   * Get default provider (Cloudflare Workers AI)
   */
  static getDefaultProvider() {
    return this.create({ provider: "cloudflare" });
  }
  /**
   * Try providers in order of preference: preferred -> Cloudflare -> Anthropic -> OpenAI
   */
  static createWithFallback(preferredProvider) {
    if (preferredProvider) {
      try {
        return this.create({ provider: preferredProvider });
      } catch (e) {
        console.warn(`${preferredProvider} provider failed, trying fallback...`);
      }
    }
    if (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN) {
      try {
        return this.create({ provider: "cloudflare" });
      } catch (e) {
        console.warn("Cloudflare provider failed, trying fallback...");
      }
    }
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        return this.create({ provider: "anthropic" });
      } catch (e) {
        console.warn("Anthropic provider failed, trying fallback...");
      }
    }
    if (process.env.OPENAI_API_KEY) {
      try {
        return this.create({ provider: "openai" });
      } catch (e) {
        console.warn("OpenAI provider failed");
      }
    }
    throw new Error(
      "No AI provider configured. Please set environment variables for at least one provider."
    );
  }
};
function getAIProvider(config, preferredProvider) {
  if (!config) {
    return AIProviderFactory.createWithFallback(preferredProvider);
  }
  return AIProviderFactory.create(config);
}

// src/compression/index.ts
function validateAIResponse(data) {
  if (!Array.isArray(data)) {
    return false;
  }
  return data.every((task) => {
    return typeof task === "object" && task !== null && typeof task.title === "string" && task.title.length > 0 && typeof task.duration_minutes === "number" && task.duration_minutes > 0 && typeof task.color === "string" && ["blue", "coral", "green", "orange", "purple"].includes(task.color) && typeof task.reasoning === "string";
  });
}
async function compressBrainDump(options) {
  const { text, capacity, apiKey, provider, preferredProvider, model, maxTokens = 2048 } = options;
  try {
    const aiProvider = getAIProvider({
      provider,
      apiKey,
      model
    }, preferredProvider);
    const systemPrompt = capacity ? CAPACITY_AWARE_PROMPT(capacity) : SCHEDULE_SYSTEM_PROMPT;
    const response = await aiProvider.complete({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: text
        }
      ],
      maxTokens,
      temperature: 0.7
    });
    let tasks;
    try {
      tasks = JSON.parse(response.content.trim());
    } catch (error) {
      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          tasks = JSON.parse(jsonMatch[0]);
        } catch (extractError) {
          return {
            success: false,
            error: "Failed to parse AI response"
          };
        }
      } else {
        return {
          success: false,
          error: "Failed to parse AI response"
        };
      }
    }
    if (!validateAIResponse(tasks)) {
      return {
        success: false,
        error: "AI response has invalid structure"
      };
    }
    let validatedTasks = tasks;
    if (capacity) {
      const maxTasks = { light: 3, medium: 5, full: 7 }[capacity];
      if (validatedTasks.length > maxTasks) {
        validatedTasks = validatedTasks.slice(0, maxTasks);
      }
    }
    return {
      success: true,
      tasks: validatedTasks
    };
  } catch (error) {
    console.error("Compression error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}
async function compressBrainDumpStream(options) {
  const { text, capacity, apiKey, provider, preferredProvider, model, maxTokens = 2048 } = options;
  const aiProvider = getAIProvider({
    provider,
    apiKey,
    model
  }, preferredProvider);
  const systemPrompt = capacity ? CAPACITY_AWARE_PROMPT(capacity) : SCHEDULE_SYSTEM_PROMPT;
  return aiProvider.stream({
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: text
      }
    ],
    maxTokens,
    temperature: 0.7
  });
}

// src/scheduling/index.ts
function suggestDuration(task) {
  if (!task.historicalDurations || task.historicalDurations.length === 0) {
    const defaultDurations = {
      work: 60,
      personal: 30,
      care: 45,
      routine: 15
    };
    return defaultDurations[task.category] || 30;
  }
  const average = task.historicalDurations.reduce((sum, duration) => sum + duration, 0) / task.historicalDurations.length;
  return Math.round(average * 1.25);
}
function classifyEnergyImpact(task) {
  if (task.color === "purple" || task.color === "green") {
    return "energizing";
  }
  if (task.color === "orange" || task.color === "blue") {
    return "draining";
  }
  return "neutral";
}
function optimizeTaskOrder(tasks) {
  const classified = tasks.map((task) => ({
    task,
    energy: classifyEnergyImpact(task)
  }));
  const draining = classified.filter((t) => t.energy === "draining");
  const energizing = classified.filter((t) => t.energy === "energizing");
  const neutral = classified.filter((t) => t.energy === "neutral");
  const ordered = [];
  const recovery = [...energizing, ...neutral];
  let drainingIndex = 0;
  let recoveryIndex = 0;
  while (drainingIndex < draining.length || recoveryIndex < recovery.length) {
    if (drainingIndex < draining.length) {
      ordered.push(draining[drainingIndex].task);
      drainingIndex++;
    }
    if (recoveryIndex < recovery.length) {
      ordered.push(recovery[recoveryIndex].task);
      recoveryIndex++;
    }
  }
  return ordered;
}
function recommendBreaks(tasks, preferences = {}) {
  const {
    breakDuration = 15,
    maxConsecutiveTasks = 3
  } = preferences;
  const breaks = [];
  let consecutiveCount = 0;
  let totalDuration = 0;
  tasks.forEach((task, index) => {
    consecutiveCount++;
    totalDuration += task.duration_minutes;
    if (consecutiveCount >= maxConsecutiveTasks && index < tasks.length - 1) {
      breaks.push({
        afterTaskIndex: index,
        duration: breakDuration,
        reason: "Prevent burnout - time to reset"
      });
      consecutiveCount = 0;
      totalDuration = 0;
    }
    if (totalDuration >= 90 && index < tasks.length - 1) {
      breaks.push({
        afterTaskIndex: index,
        duration: breakDuration,
        reason: "Natural energy cycle - recharge time"
      });
      totalDuration = 0;
    }
    if (classifyEnergyImpact(task) === "draining" && index < tasks.length - 1) {
      const nextTask = tasks[index + 1];
      if (nextTask && classifyEnergyImpact(nextTask) === "draining") {
        breaks.push({
          afterTaskIndex: index,
          duration: breakDuration,
          reason: "Two challenging tasks - breathe between them"
        });
      }
    }
  });
  return breaks;
}
function estimateCompletionTime(tasks, preferences = {}) {
  const taskDuration = tasks.reduce((sum, task) => sum + task.duration_minutes, 0);
  const breaks = recommendBreaks(tasks, preferences);
  const breakDuration = breaks.reduce((sum, b) => sum + b.duration, 0);
  const transitionTime = Math.max(0, tasks.length - 1) * 10;
  return taskDuration + breakDuration + transitionTime;
}

// src/nudges/index.ts
function createTimelineFullNudge(currentTaskCount, capacity) {
  const maxTasks = { light: 3, medium: 5, full: 7 }[capacity];
  if (currentTaskCount < maxTasks - 1) {
    return null;
  }
  if (currentTaskCount === maxTasks - 1) {
    return {
      type: "timeline_full",
      message: "Your timeline is almost at capacity. Remember to pace yourself.",
      tone: "gentle-warning",
      showInApp: true,
      dismissible: true
    };
  }
  if (currentTaskCount >= maxTasks) {
    return {
      type: "timeline_full",
      message: "Your timeline is full. You've reached your capacity for today. Be kind to yourself.",
      tone: "gentle-warning",
      showInApp: true,
      dismissible: true
    };
  }
  return null;
}
function createFocusDurationNudge(elapsedMinutes) {
  if (elapsedMinutes >= 90 && elapsedMinutes < 95) {
    return {
      type: "focus_duration",
      message: "You've been in focus mode for 90 minutes. Time for a break?",
      tone: "supportive",
      showInApp: true,
      dismissible: true
    };
  }
  if (elapsedMinutes >= 120 && elapsedMinutes < 125) {
    return {
      type: "focus_duration",
      message: "You've been at this for 2 hours. Your brain needs rest. Take a real break.",
      tone: "gentle-warning",
      showInApp: true,
      dismissible: false
    };
  }
  return null;
}
function createTaskCompletionNudge(completedCount, totalCount) {
  if (completedCount === 1) {
    return {
      type: "task_completion",
      message: "You started. That's the hardest part. Well done.",
      tone: "celebratory",
      showInApp: true,
      dismissible: true
    };
  }
  if (completedCount === Math.floor(totalCount / 2) && totalCount > 2) {
    return {
      type: "task_completion",
      message: "You're halfway there. That's real progress.",
      tone: "celebratory",
      showInApp: true,
      dismissible: true
    };
  }
  if (completedCount === totalCount && totalCount > 0) {
    return {
      type: "task_completion",
      message: "Everything's done. You did it. Take a moment to recognize that.",
      tone: "celebratory",
      showInApp: true,
      dismissible: true
    };
  }
  if (completedCount > 0 && completedCount % 3 === 0) {
    return {
      type: "task_completion",
      message: `${completedCount} tasks completed. That's meaningful progress.`,
      tone: "celebratory",
      showInApp: true,
      dismissible: true
    };
  }
  return null;
}
function createCapacityWarningNudge(attemptedTaskCount, capacity) {
  const maxTasks = { light: 3, medium: 5, full: 7 }[capacity];
  if (attemptedTaskCount > maxTasks) {
    const excess = attemptedTaskCount - maxTasks;
    return {
      type: "capacity_warning",
      message: `That's ${excess} more ${excess === 1 ? "task" : "tasks"} than your ${capacity} capacity. Remember: you chose ${capacity} energy for a reason.`,
      tone: "gentle-warning",
      showInApp: true,
      dismissible: true
    };
  }
  return null;
}
function createBreakReminderNudge(minutesSinceLastBreak) {
  if (minutesSinceLastBreak >= 60 && minutesSinceLastBreak < 65) {
    return {
      type: "break_reminder",
      message: "You've been working for an hour. A 5-minute break helps more than pushing through.",
      tone: "supportive",
      showInApp: true,
      dismissible: true
    };
  }
  return null;
}
function createEndOfDayNudge(tasks) {
  const completedTasks = tasks.filter((t) => "completed" in t && t.completed);
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
    type: "end_of_day",
    message,
    tone: "supportive",
    showInApp: true,
    dismissible: true
  };
}
function checkNudges(context) {
  const nudges = [];
  if (context.taskCount !== void 0 && context.capacity) {
    const timelineNudge = createTimelineFullNudge(context.taskCount, context.capacity);
    if (timelineNudge)
      nudges.push(timelineNudge);
  }
  if (context.focusElapsedMinutes !== void 0) {
    const focusNudge = createFocusDurationNudge(context.focusElapsedMinutes);
    if (focusNudge)
      nudges.push(focusNudge);
  }
  if (context.completedCount !== void 0 && context.taskCount !== void 0) {
    const completionNudge = createTaskCompletionNudge(
      context.completedCount,
      context.taskCount
    );
    if (completionNudge)
      nudges.push(completionNudge);
  }
  if (context.taskCount !== void 0 && context.capacity) {
    const capacityNudge = createCapacityWarningNudge(context.taskCount, context.capacity);
    if (capacityNudge)
      nudges.push(capacityNudge);
  }
  if (context.minutesSinceLastBreak !== void 0) {
    const breakNudge = createBreakReminderNudge(context.minutesSinceLastBreak);
    if (breakNudge)
      nudges.push(breakNudge);
  }
  if (context.isEndOfDay && context.tasks) {
    const endOfDayNudge = createEndOfDayNudge(context.tasks);
    nudges.push(endOfDayNudge);
  }
  return nudges;
}
export {
  AIProviderFactory,
  AnthropicAIAdapter,
  CAPACITY_AWARE_PROMPT,
  COMPRESSION_ERROR_MESSAGE,
  CloudflareAIAdapter,
  DURATION_ESTIMATION_PROMPT,
  OpenAIAdapter,
  PROVIDER_MODELS,
  REFLECTION_PROMPT,
  SCHEDULE_SYSTEM_PROMPT,
  checkNudges,
  classifyEnergyImpact,
  compressBrainDump,
  compressBrainDumpStream,
  createBreakReminderNudge,
  createCapacityWarningNudge,
  createEndOfDayNudge,
  createFocusDurationNudge,
  createTaskCompletionNudge,
  createTimelineFullNudge,
  estimateCompletionTime,
  getAIProvider,
  optimizeTaskOrder,
  recommendBreaks,
  suggestDuration,
  validateAIResponse
};
