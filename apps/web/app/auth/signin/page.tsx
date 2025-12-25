'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../../../providers'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { OAuthButtons } from '../../../components/auth/oauth-buttons'
import { PhoneAuth } from '../../../components/auth/phone-auth'
import { EmailConfirmation } from '../../../components/auth/email-confirmation'

export default function SignInPage() {
  const supabase = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [authMode, setAuthMode] = useState<'select' | 'phone-input' | 'phone-verify'>('select')

  const signInWithProvider = async (provider: 'google' | 'apple') => {
    const startTime = Date.now()
    console.log('Starting OAuth sign-in with provider:', provider)
    setLoading(provider)
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`
      console.log('Redirect URL:', redirectUrl)

      // Use OAuth redirect flow - let Supabase handle the redirect
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      console.log(`OAuth sign-in setup took ${Date.now() - startTime}ms`)

      if (error) {
        console.error('OAuth sign in error:', error)
        alert(`Error signing in with ${provider}: ${error.message}`)
        setLoading(null)
        return
      }

      // Supabase will handle the redirect automatically
      console.log(`Total sign-in setup time: ${Date.now() - startTime}ms`)
    } catch (err) {
      console.error('Unexpected error during OAuth:', err)
      alert('An unexpected error occurred.')
      setLoading(null)
    }
  }

  const signInWithMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      alert('Please enter your email address')
      return
    }

    console.log('Starting magic link sign-in for email:', email)
    setLoading('magiclink')
    
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      console.log('Magic link response:', data)
      if (error) {
        console.error('Magic link sign in error:', error)
        alert(`Error sending magic link: ${error.message}`)
      } else {
        console.log('Magic link sent successfully')
        setIsEmailSent(true)
      }
    } catch (err) {
      console.error('Unexpected error during magic link:', err)
      alert('An unexpected error occurred.')
    } finally {
      setLoading(null)
    }
  }

  const sendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) {
      alert('Please enter your phone number')
      return
    }

    // Add country code if not present
    const formattedPhone = phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`
    
    console.log('Starting phone OTP for:', formattedPhone)
    setLoading('phone-otp')
    
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          channel: 'sms'
        }
      })
      
      console.log('Phone OTP response:', data)
      if (error) {
        console.error('Phone OTP error:', error)
        alert(`Error sending SMS: ${error.message}`)
      } else {
        console.log('SMS sent successfully')
        setAuthMode('phone-verify')
      }
    } catch (err) {
      console.error('Unexpected error during phone OTP:', err)
      alert('An unexpected error occurred.')
    } finally {
      setLoading(null)
    }
  }

  const verifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode.trim()) {
      alert('Please enter the verification code')
      return
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`
    
    console.log('Verifying phone OTP:', otpCode)
    setLoading('phone-verify')
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otpCode,
        type: 'sms'
      })
      
      console.log('Phone verification response:', data)
      if (error) {
        console.error('Phone verification error:', error)
        alert(`Error verifying code: ${error.message}`)
      } else {
        console.log('Phone verification successful')
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Unexpected error during phone verification:', err)
      alert('An unexpected error occurred.')
    } finally {
      setLoading(null)
    }
  }

  // Email confirmation screen
  if (isEmailSent) {
    return (
      <EmailConfirmation
        email={email}
        onBack={() => setAuthMode('select')}
        onSendDifferent={() => setIsEmailSent(false)}
      />
    )
  }

  // Phone authentication screens
  if (authMode === 'phone-input' || authMode === 'phone-verify') {
    return (
      <PhoneAuth
        onSendOtp={sendPhoneOtp}
        onVerifyOtp={verifyPhoneOtp}
        phone={phone}
        otpCode={otpCode}
        setPhone={setPhone}
        setOtpCode={setOtpCode}
        loading={loading}
        mode={authMode}
        onBack={() => setAuthMode('select')}
      />
    )
  }

  // Main sign-in selection screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign in to Luma Now</h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose your preferred sign-in method
          </p>
        </div>

        <div className="space-y-4">
          {/* OAuth Providers */}
          <OAuthButtons onProviderSignIn={signInWithProvider} loading={loading} />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Magic Link */}
          <form onSubmit={signInWithMagicLink} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading !== null}
              className="w-full"
            />
            <Button
              type="submit"
              disabled={loading !== null || !email.trim()}
              className="w-full"
              variant="outline"
            >
              {loading === 'magiclink' ? 'Sending magic link...' : 'Send magic link to email'}
            </Button>
          </form>

          {/* Phone Authentication */}
          <Button
            onClick={() => setAuthMode('phone-input')}
            disabled={loading !== null}
            className="w-full"
            variant="outline"
          >
            Sign in with phone number
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our terms of service.
          </p>
        </div>
      </div>
    </div>
  )
}