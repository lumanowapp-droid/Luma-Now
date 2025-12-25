/**
 * AI Provider Factory
 * Creates appropriate AI adapter based on configuration
 */

import {
  AIProvider,
  AIProviderAdapter,
  AIProviderConfig,
  ModelTier,
} from './types'
import { CloudflareAIAdapter } from './cloudflare'
import { AnthropicAIAdapter } from './anthropic'
import { OpenAIAdapter } from './openai'

export class AIProviderFactory {
  /**
   * Create an AI provider adapter based on configuration
   * Defaults to Cloudflare Workers AI if not specified
   */
  static create(config?: Partial<AIProviderConfig>): AIProviderAdapter {
    const provider = config?.provider || 'cloudflare'
    const modelTier: ModelTier = (config?.model as ModelTier) || 'default'

    switch (provider) {
      case 'cloudflare': {
        const accountId =
          process.env.CLOUDFLARE_ACCOUNT_ID || config?.accountId
        const apiKey = process.env.CLOUDFLARE_API_TOKEN || config?.apiKey

        if (!accountId || !apiKey) {
          throw new Error(
            'Cloudflare account ID and API token are required. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables.'
          )
        }

        return new CloudflareAIAdapter({
          accountId,
          apiKey,
          model: modelTier,
        })
      }

      case 'anthropic': {
        const apiKey = process.env.ANTHROPIC_API_KEY || config?.apiKey

        if (!apiKey) {
          throw new Error(
            'Anthropic API key is required. Set ANTHROPIC_API_KEY environment variable.'
          )
        }

        return new AnthropicAIAdapter({
          apiKey,
          model: modelTier,
        })
      }

      case 'openai': {
        const apiKey = process.env.OPENAI_API_KEY || config?.apiKey

        if (!apiKey) {
          throw new Error(
            'OpenAI API key is required. Set OPENAI_API_KEY environment variable.'
          )
        }

        return new OpenAIAdapter({
          apiKey,
          model: modelTier,
        })
      }

      default:
        throw new Error(`Unsupported AI provider: ${provider}`)
    }
  }

  /**
   * Get default provider (Cloudflare Workers AI)
   */
  static getDefaultProvider(): AIProviderAdapter {
    return this.create({ provider: 'cloudflare' })
  }

  /**
   * Try providers in order of preference: preferred -> Cloudflare -> Anthropic -> OpenAI
   */
  static createWithFallback(preferredProvider?: AIProvider): AIProviderAdapter {
    // Try preferred provider first if specified
    if (preferredProvider) {
      try {
        return this.create({ provider: preferredProvider })
      } catch (e) {
        console.warn(`${preferredProvider} provider failed, trying fallback...`)
      }
    }

    // Try Cloudflare first (cheapest)
    if (
      process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.CLOUDFLARE_API_TOKEN
    ) {
      try {
        return this.create({ provider: 'cloudflare' })
      } catch (e) {
        console.warn('Cloudflare provider failed, trying fallback...')
      }
    }

    // Fallback to Anthropic
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        return this.create({ provider: 'anthropic' })
      } catch (e) {
        console.warn('Anthropic provider failed, trying fallback...')
      }
    }

    // Fallback to OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        return this.create({ provider: 'openai' })
      } catch (e) {
        console.warn('OpenAI provider failed')
      }
    }

    throw new Error(
      'No AI provider configured. Please set environment variables for at least one provider.'
    )
  }
}

// Export convenience function
export function getAIProvider(
  config?: Partial<AIProviderConfig>,
  preferredProvider?: AIProvider
): AIProviderAdapter {
  if (!config) {
    return AIProviderFactory.createWithFallback(preferredProvider)
  }
  return AIProviderFactory.create(config)
}
