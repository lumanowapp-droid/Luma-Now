/**
 * AI Provider Types and Interfaces
 * Supports multiple AI providers: Cloudflare Workers AI, Anthropic, OpenAI
 */

export type AIProvider = 'cloudflare' | 'anthropic' | 'openai'

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AICompletionRequest {
  messages: AIMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface AICompletionResponse {
  content: string
  finishReason?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface AIProviderConfig {
  provider: AIProvider
  apiKey?: string
  accountId?: string // For Cloudflare
  model?: string
}

export interface AIProviderAdapter {
  complete(request: AICompletionRequest): Promise<AICompletionResponse>
  stream(request: AICompletionRequest): ReadableStream
  getProvider(): AIProvider
}

// Model mappings for each provider
export const PROVIDER_MODELS = {
  cloudflare: {
    default: '@cf/meta/llama-3.1-70b-instruct',
    fast: '@cf/meta/llama-3.1-8b-instruct',
    smart: '@cf/meta/llama-3.1-70b-instruct',
    vision: '@cf/llava-hf/llava-1.5-7b-hf',
  },
  anthropic: {
    default: 'claude-3-5-sonnet-20241022',
    fast: 'claude-3-5-haiku-20241022',
    smart: 'claude-3-5-sonnet-20241022',
    opus: 'claude-3-opus-20240229',
  },
  openai: {
    default: 'gpt-4o-mini',
    fast: 'gpt-4o-mini',
    smart: 'gpt-4o',
    vision: 'gpt-4o',
  },
} as const

export type ProviderModels = typeof PROVIDER_MODELS

export type ModelTier = 'default' | 'fast' | 'smart' | 'vision' | 'opus'
