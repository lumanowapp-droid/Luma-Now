import { Suspense } from 'react'
import { Metadata } from 'next'
import { LandingPage } from '@/components/landing-page'
import { BrainDump } from '@/components/brain-dump'
import { AuthCheck } from '@/components/auth-check'

export const metadata: Metadata = {
  title: 'Luma Now - ADHD-friendly Planning',
  description: 'AI-powered task management designed for ADHD brains',
}

// Force dynamic rendering to avoid build-time context issues
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AuthCheck>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <LandingPage />
          <BrainDump />
        </Suspense>
      </AuthCheck>
    </div>
  )
}
