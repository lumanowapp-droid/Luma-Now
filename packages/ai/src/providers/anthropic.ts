/**
 * Anthropic Claude AI Provider Adapter
 */

import Anthropic from '@anthropic-ai/sdk'
import {
  AIProviderAdapter,
  AICompletionRequest,
  AICompletionResponse,
  AIProvider,
  PROVIDER_MODELS,
  ModelTier,
} from './types'

export class AnthropicAIAdapter implements AIProviderAdapter {
  private client: Anthropic
  private model: string

  constructor(config: { apiKey: string; model?: ModelTier }) {
    if (!config.apiKey) {
      throw new Error('Anthropic API key is required')
    }

    this.client = new Anthropic({
      apiKey: config.apiKey,
    })
    this.model = PROVIDER_MODELS.anthropic[config.model as keyof typeof PROVIDER_MODELS.anthropic] || PROVIDER_MODELS.anthropic.default
  }

  getProvider(): AIProvider {
    return 'anthropic'
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const systemMessage = request.messages.find(m => m.role === 'system')
    const messages = request.messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: request.maxTokens ?? 2048,
      temperature: request.temperature ?? 0.7,
      system: systemMessage?.content,
      messages,
    })

    const content =
      response.content[0].type === 'text' ? response.content[0].text : ''

    return {
      content,
      finishReason: response.stop_reason || 'stop',
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    }
  }

  stream(request: AICompletionRequest): ReadableStream {
    const client = this.client
    const model = this.model

    return new ReadableStream({
      async start(controller) {
        try {
          const systemMessage = request.messages.find(m => m.role === 'system')
          const messages = request.messages
            .filter(m => m.role !== 'system')
            .map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            }))

          const stream = await client.messages.stream({
            model,
            max_tokens: request.maxTokens ?? 2048,
            temperature: request.temperature ?? 0.7,
            system: systemMessage?.content,
            messages,
          })

          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const text = event.delta.text
              controller.enqueue(new TextEncoder().encode(text))
            }
          }

          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })
  }
}
