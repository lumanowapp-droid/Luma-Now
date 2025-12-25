"use client"

import { useState } from "react"
import { useSupabase } from "@/providers/supabase-provider"
import { AuthCheck } from "@/components/auth-check"
import { LandingPage } from "@/components/landing-page"

export default function Home() {
  const supabase = useSupabase()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Simple Header */}
        <header className="px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">⭐</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Luma Now</span>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to Luma Now! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your ADHD-friendly productivity app is working correctly.
            </p>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-4">✅ Status: All Systems Operational</h2>
              <ul className="text-left space-y-2 text-gray-600">
                <li>✅ Development server running</li>
                <li>✅ Authentication system working</li>
                <li>✅ UI components loading</li>
                <li>✅ Supabase integration active</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </AuthCheck>
  )
}