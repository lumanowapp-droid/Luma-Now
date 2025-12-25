/**
 * Cloudflare Workers AI Provider Adapter
 * Default provider for cost-effective AI operations
 */

import {
  AIProviderAdapter,
  AICompletionRequest,
  AICompletionResponse,
  AIProvider,
  PROVIDER_MODELS,
  ModelTier,
} from './types'

export class CloudflareAIAdapter implements AIProviderAdapter {
  private accountId: string
  private apiKey: string
  private model: string

  constructor(config: { accountId: string; apiKey: string; model?: ModelTier }) {
    if (!config.accountId || !config.apiKey) {
      throw new Error('Cloudflare account ID and API key are required')
    }

    this.accountId = config.accountId
    this.apiKey = config.apiKey
    this.model = PROVIDER_MODELS.cloudflare[config.model as keyof typeof PROVIDER_MODELS.cloudflare] || PROVIDER_MODELS.cloudflare.default
  }

  getProvider(): AIProvider {
    return 'cloudflare'
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${this.model}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Cloudflare AI request failed: ${error}`)
    }

    const data = await response.json() as any

    return {
      content: data.result?.response || data.result?.generated_text || '',
      finishReason: 'stop',
      usage: {
        promptTokens: 0, // Cloudflare doesn't provide token counts
        completionTokens: 0,
        totalTokens: 0,
      },
    }
  }

  stream(request: AICompletionRequest): ReadableStream {
    const accountId = this.accountId
    const apiKey = this.apiKey
    const model = this.model

    return new ReadableStream({
      async start(controller) {
        const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: request.messages,
              temperature: request.temperature ?? 0.7,
              max_tokens: request.maxTokens ?? 2048,
              stream: true,
            }),
          })

          if (!response.ok) {
            throw new Error(`Cloudflare AI stream failed: ${response.statusText}`)
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
                  const content = json.response || json.generated_text || ''
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
