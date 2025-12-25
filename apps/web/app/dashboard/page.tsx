import { Suspense } from 'react'
import { Metadata } from 'next'
import { EnterpriseDashboard } from '@/components/enterprise-dashboard'
import { AuthCheck } from '@/components/auth-check'

export const metadata: Metadata = {
  title: 'Dashboard - Luma Now',
  description: 'Your ADHD-friendly planning dashboard',
}

// Force dynamic rendering to avoid build-time context issues
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  return (
    <AuthCheck>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>
        <EnterpriseDashboard />
      </Suspense>
    </AuthCheck>
  )
}