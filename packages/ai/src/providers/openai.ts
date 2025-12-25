/**
 * OpenAI Provider Adapter
 */

import {
  AIProviderAdapter,
  AICompletionRequest,
  AICompletionResponse,
  AIProvider,
  PROVIDER_MODELS,
  ModelTier,
} from './types'

export class OpenAIAdapter implements AIProviderAdapter {
  private apiKey: string
  private model: string

  constructor(config: { apiKey: string; model?: ModelTier }) {
    if (!config.apiKey) {
      throw new Error('OpenAI API key is required')
    }

    this.apiKey = config.apiKey
    this.model = PROVIDER_MODELS.openai[config.model as keyof typeof PROVIDER_MODELS.openai] || PROVIDER_MODELS.openai.default
  }

  getProvider(): AIProvider {
    return 'openai'
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI request failed: ${error}`)
    }

    const data = (await response.json()) as any

    return {
      content: data.choices[0]?.message?.content || '',
      finishReason: data.choices[0]?.finish_reason || 'stop',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    }
  }

  stream(request: AICompletionRequest): ReadableStream {
    const apiKey = this.apiKey
    const model = this.model

    return new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch(
            'https://api.openai.com/v1/chat/completions',
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model,
                messages: request.messages,
                temperature: request.temperature ?? 0.7,
                max_tokens: request.maxTokens ?? 2048,
                stream: true,
              }),
            }
          )

          if (!response.ok) {
            throw new Error(`OpenAI stream failed: ${response.statusText}`)
          }

          const reader = response.body?.getReader()
          if (!reader) {
            throw new Error('No response body')
          }

          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              controller.close()
              break
            }

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n').filter(line => line.trim())

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  controller.close()
                  return
                }

                try {
                  const json = JSON.parse(data)
                  const content = json.choices[0]?.delta?.content
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content))
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          controller.error(error)
        }
      },
    })
  }
}
