'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface OAuthButtonsProps {
  onProviderSignIn: (provider: 'google' | 'apple') => void
  loading: string | null
}

export function OAuthButtons({ onProviderSignIn, loading }: OAuthButtonsProps) {
  return (
    <>
      <Button
        onClick={() => onProviderSignIn('google')}
        disabled={loading !== null}
        className="w-full"
        variant="outline"
      >
        {loading === 'google' ? 'Signing in...' : 'Continue with Google'}
      </Button>

      <Button
        onClick={() => onProviderSignIn('apple')}
        disabled={loading !== null}
        className="w-full bg-black text-white hover:bg-gray-800"
      >
        {loading === 'apple' ? 'Signing in...' : 'Continue with Apple'}
      </Button>
    </>
  )
}