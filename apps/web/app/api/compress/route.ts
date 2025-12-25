import { NextRequest, NextResponse } from 'next/server'
import {
  compressBrainDump,
  compressBrainDumpStream,
  COMPRESSION_ERROR_MESSAGE,
  type AITask,
} from '@multi-platform-app/ai'
import type { AIProvider } from '@multi-platform-app/types'

// Simplified rate limiting for faster compilation
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW = 60 * 1000
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

interface CompressRequestBody {
  text: string
  userId: string
  capacity?: 'light' | 'medium' | 'full'
  stream?: boolean
  preferredProvider?: AIProvider
}

function checkRateLimit(userId: string): { allowed: boolean; error?: string } {
  const now = Date.now()
  const userLimit = rateLimitStore.get(userId)

  if (!userLimit || now > userLimit.resetAt) {
    rateLimitStore.set(userId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    })
    return { allowed: true }
  }

  if (userLimit.count >= RATE_LIMIT_MAX) {
    const waitTime = Math.ceil((userLimit.resetAt - now) / 1000)
    return {
      allowed: false,
      error: `Rate limit exceeded. Please try again in ${waitTime} seconds.`,
    }
  }

  userLimit.count++
  return { allowed: true }
}


export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CompressRequestBody = await request.json()
    const { text, userId, capacity, stream = false, preferredProvider } = body

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'userId is required and must be a string' },
        { status: 400 }
      )
    }

    if (text.length < 10 || text.length > 2000) {
      return NextResponse.json(
        { success: false, error: COMPRESSION_ERROR_MESSAGE },
        { status: 400 }
      )
    }

    // Validate capacity if provided
    if (capacity && !['light', 'medium', 'full'].includes(capacity)) {
      return NextResponse.json(
        { success: false, error: 'Invalid capacity value' },
        { status: 400 }
      )
    }

    // Check rate limiting
    const rateLimitCheck = checkRateLimit(userId)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: rateLimitCheck.error! },
        { status: 429 }
      )
    }

    // Handle streaming response
    if (stream) {
      try {
        const streamResponse = await compressBrainDumpStream({
          text,
          capacity,
          preferredProvider,
        })

        return new NextResponse(streamResponse, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        })
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'AI service is not configured' },
          { status: 500 }
        )
      }
    }

    // Handle regular response
    try {
      const result = await compressBrainDump({
        text,
        capacity,
        preferredProvider,
      })

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error || COMPRESSION_ERROR_MESSAGE },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: true, tasks: result.tasks },
        { status: 200 }
      )
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'AI service is not configured' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: COMPRESSION_ERROR_MESSAGE },
      { status: 500 }
    )
  }
}
