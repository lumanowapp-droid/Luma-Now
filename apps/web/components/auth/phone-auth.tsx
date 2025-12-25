'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PhoneAuthProps {
  onSendOtp: (e: React.FormEvent) => void
  onVerifyOtp: (e: React.FormEvent) => void
  phone: string
  otpCode: string
  setPhone: (value: string) => void
  setOtpCode: (value: string) => void
  loading: string | null
  mode: 'phone-input' | 'phone-verify'
  onBack: () => void
}

export function PhoneAuth({ 
  onSendOtp, 
  onVerifyOtp, 
  phone, 
  otpCode, 
  setPhone, 
  setOtpCode, 
  loading, 
  mode,
  onBack 
}: PhoneAuthProps) {
  if (mode === 'phone-verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Enter verification code</h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a code to <strong>{phone}</strong>
            </p>
          </div>

          <form onSubmit={onVerifyOtp} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                disabled={loading !== null}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
            <Button
              type="submit"
              disabled={loading !== null || otpCode.length !== 6}
              className="w-full"
            >
              {loading === 'phone-verify' ? 'Verifying...' : 'Verify & Sign In'}
            </Button>
          </form>

          <div className="text-center space-y-3">
            <Button
              onClick={() => {
                setPhone('')
                setOtpCode('')
                onBack()
              }}
              variant="outline"
              className="w-full"
            >
              Change phone number
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full"
            >
              Back to sign in options
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign in with phone</h2>
          <p className="mt-2 text-sm text-gray-600">
            We'll send you a verification code
          </p>
        </div>

        <form onSubmit={onSendOtp} className="space-y-6">
          <div>
            <Input
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading !== null}
            />
          </div>
          <Button
            type="submit"
            disabled={loading !== null || !phone.trim()}
            className="w-full"
          >
            {loading === 'phone-otp' ? 'Sending code...' : 'Send verification code'}
          </Button>
        </form>

        <div className="text-center">
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full"
          >
            Back to sign in options
          </Button>
        </div>
      </div>
    </div>
  )
}