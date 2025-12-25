'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '../../providers'
import { BrainDump } from '../../components/brain-dump'
import { useAppStore } from '@luma/store'

interface AITask {
  title: string
  duration_minutes: number
  color: 'blue' | 'coral' | 'green' | 'orange' | 'purple'
  reasoning: string
}

export default function DashboardPage() {
  const supabase = useSupabase()
  const { settings } = useAppStore()
  const [user, setUser] = useState<any>(null)
  const [tasks, setTasks] = useState<AITask[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('DashboardPage: Component mounted')
    // Check if CSS is loaded
    const computedStyle = window.getComputedStyle(document.body)
    console.log('DashboardPage: Body background', computedStyle.backgroundColor)
    console.log('DashboardPage: CSS custom property --background', getComputedStyle(document.documentElement).getPropertyValue('--background'))
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      console.log('DashboardPage: User fetched', user)
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth/signin'
  }

  const handleCompress = async (text: string): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)

    try {
      const response = await fetch('/api/compress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          userId: user.id,
          preferredProvider: settings.aiProvider,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to compress text')
      }

      if (data.success) {
        setTasks(data.tasks)
        return formatTasksAsText(data.tasks)
      } else {
        throw new Error(data.error || 'Failed to compress text')
      }
    } catch (error) {
      console.error('Compression error:', error)
      throw error instanceof Error ? error : new Error('Failed to compress text')
    } finally {
      setLoading(false)
    }
  }

  const formatTasksAsText = (tasks: AITask[]): string => {
    return tasks.map(task => 
      `• ${task.title} (${task.duration_minutes} min) - ${task.reasoning}`
    ).join('\n')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            {user && (
              <p className="text-gray-600 mt-1">Welcome back, {user.email}!</p>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        {/* Brain Dump Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Brain Dump
            </h2>
            <p className="text-gray-600">
              Clear your mind and organize your thoughts with AI-powered task breakdown
            </p>
          </div>

          <BrainDump 
            onCompress={handleCompress}
            className="opacity-100"
          />

          {/* Loading indicator for compression */}
          {loading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                AI is organizing your thoughts...
              </div>
            </div>
          )}
        </div>

        {/* Tasks Display */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Organized Tasks</h3>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    task.color === 'blue' ? 'border-blue-500 bg-blue-50' :
                    task.color === 'coral' ? 'border-coral-500 bg-coral-50' :
                    task.color === 'green' ? 'border-green-500 bg-green-50' :
                    task.color === 'orange' ? 'border-orange-500 bg-orange-50' :
                    'border-purple-500 bg-purple-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{task.reasoning}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-500 ml-4">
                      {task.duration_minutes} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}