'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../../../providers'

export default function AuthCallbackPage() {
  const supabase = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      const startTime = Date.now()
      try {
        console.log('=== OAuth Callback Processing ===')

        // With @supabase/ssr middleware, the code exchange should be handled automatically
        // Just check for the session
        console.log('Checking for session...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        console.log(`Session check took ${Date.now() - startTime}ms`)

        if (sessionError) {
          console.error('Session error:', sessionError)
          setError(sessionError.message)
          return
        }

        if (session) {
          console.log('Session found, redirecting to dashboard')
          console.log('User:', session.user?.email)
          console.log(`Total callback processing time: ${Date.now() - startTime}ms`)
          router.push('/dashboard')
        } else {
          console.log('No session found')
          setError('Authentication failed - no session found')
        }
      } catch (err) {
        console.error('Unexpected error in callback:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => router.push('/auth/signin')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}