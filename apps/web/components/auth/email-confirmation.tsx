'use client'

import { Button } from '@/components/ui/button'

interface EmailConfirmationProps {
  email: string
  onBack: () => void
  onSendDifferent: () => void
}

export function EmailConfirmation({ email, onBack, onSendDifferent }: EmailConfirmationProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a magic link to <strong>{email}</strong>
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Click the link in the email to sign in. You can close this tab.
          </p>
          <div className="mt-6 space-y-3">
            <Button
              onClick={onSendDifferent}
              variant="outline"
              className="w-full"
            >
              Send to different email
            </Button>
            <Button
              onClick={onBack}
              className="w-full"
            >
              Back to sign in options
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}