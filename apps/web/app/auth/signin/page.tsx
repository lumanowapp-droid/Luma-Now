import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Luma Now',
  description: 'Sign in to your Luma Now account',
}

// Force dynamic rendering to avoid build-time context issues
export const dynamic = 'force-dynamic'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
          <p className="text-gray-600 text-center mb-4">
            Sign in to access your ADHD-friendly planning dashboard
          </p>
          <div className="space-y-4">
            <a
              href="/auth/callback"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue with Email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}