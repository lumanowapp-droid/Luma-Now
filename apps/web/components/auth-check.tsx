'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/providers/supabase-provider'
import { LandingPage } from './landing-page'

interface AuthCheckProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthCheck({ children, fallback }: AuthCheckProps) {
  const supabase = useSupabase()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('AuthCheck: session', session)
        if (mounted) {
          const authenticated = !!(session && session.user && session.user.id)
          console.log('AuthCheck: isAuthenticated', authenticated)
          setIsAuthenticated(authenticated)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('AuthCheck: error', error)
        if (mounted) {
          setIsAuthenticated(false)
          setIsLoading(false)
        }
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthCheck: auth state change', _event, session)
      if (mounted) {
        const authenticated = !!(session && session.user && session.user.id)
        console.log('AuthCheck: isAuthenticated after change', authenticated)
        setIsAuthenticated(authenticated)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LandingPage />
  }

  return <>{children}</>
}