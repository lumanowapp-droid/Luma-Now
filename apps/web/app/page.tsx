"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useLumaStore } from "@luma/store"
import { BrainDump, Timeline, FocusMode } from "@multi-platform-app/ui"
import { CapacityModal } from "@multi-platform-app/ui"
import type { CapacityLevel } from "@multi-platform-app/ui"
import { useSupabase } from "@/providers/supabase-provider"
import { AuthCheck } from "@/components/auth-check"
import { EnterpriseSidebar } from "@/components/enterprise-sidebar"
import { EnterpriseHeader } from "@/components/enterprise-header"
import { EnterpriseFooter } from "@/components/enterprise-footer"
import ErrorBoundary from "@/components/error-boundary"
import { EnterpriseDashboard } from "@/components/enterprise-dashboard"
import { EnterpriseAnalytics } from "@/components/enterprise-analytics"
import { EnterpriseTeam } from "@/components/enterprise-team"
import { EnterpriseSettings } from "@/components/enterprise-settings"
import { EnterpriseTasks } from "@/components/enterprise-tasks"

export default function Home() {
  const { currentView, setCurrentView, isLoading, setIsLoading, setTasks } = useAppStore()
  const addTasks = useLumaStore((state) => state.addTasks)
  const supabase = useSupabase()
  const router = useRouter()

  // Local state for brain dump and capacity
  const [brainDumpText, setBrainDumpText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false)
  const [currentCapacity, setCurrentCapacity] = useState<CapacityLevel>('medium')

  const handleCompress = async (text: string): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      // Double-check authentication before compression
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Session error:', sessionError)
        throw new Error('Authentication error. Please sign in again.')
      }

      if (!session || !(session as any).user || !(session as any).user.id) {
        console.error('No valid session found')
        throw new Error('You must be logged in to compress text. Please sign in first.')
      }

      const userId = (session as any).user.id
      console.log('Using userId:', userId)

      // Call POST /api/compress with text and userId
      console.log('Making API call with userId:', userId)
      const response = await fetch('/api/compress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          userId,
          capacity: currentCapacity,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }))

        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.')
        } else if (response.status === 400) {
          throw new Error(errorData.error || 'Invalid input. Please check your text and try again.')
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.')
        } else {
          throw new Error(errorData.error || 'Request failed. Please try again.')
        }
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to process your text.')
      }

      // On success, store tasks in state
      const tasks = data.tasks.map((task: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        text: task.title,
        completed: false,
        createdAt: new Date(),
      }))

      setTasks(tasks)

      // Also add to shared store for Timeline/FocusMode components
      const sharedTasks = data.tasks.map((task: any) => ({
        title: task.title,
        category: task.category || 'work',
        duration: task.duration || 30,
        completed: false,
      }))
      addTasks(sharedTasks)

      // Clear brain dump text
      setBrainDumpText("")

      // Switch view to timeline
      setCurrentView('timeline')
    } catch (error) {
      console.error('Compression failed:', error)

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.')
      } else if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCapacitySelect = (capacity: CapacityLevel) => {
    setCurrentCapacity(capacity)
  }

  // Render enterprise layout with sidebar navigation
  return (
    <AuthCheck>
      <div className="min-h-screen workspace-bg flex flex-col">
        {/* Enterprise Header */}
        <ErrorBoundary>
          <EnterpriseHeader />
        </ErrorBoundary>
        
        <div className="flex flex-1">
          {/* Enterprise Sidebar */}
          <div className="sidebar-width flex-shrink-0 hidden lg:block">
            <EnterpriseSidebar className="h-full" />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="safe-area">
              {/* Dashboard View */}
              {currentView === 'dashboard' && <EnterpriseDashboard />}

              {/* Task Management View */}
              {currentView === 'tasks' && <EnterpriseTasks />}

              {/* Analytics View */}
              {currentView === 'analytics' && <EnterpriseAnalytics />}

              {/* Team Management View */}
              {currentView === 'team' && <EnterpriseTeam />}

              {/* Settings View */}
              {currentView === 'settings' && <EnterpriseSettings />}

              {/* Brain Dump View */}
              {currentView === 'brain-dump' && (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4">
                      <span className="text-2xl">🧠</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Brain Dump</h1>
                    <p className="text-gray-600">Transform your thoughts into organized tasks with AI</p>

                    {/* Capacity Selector */}
                    <button
                      onClick={() => setIsCapacityModalOpen(true)}
                      className="mt-4 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <span className="mr-2">🎯</span>
                      Capacity: {currentCapacity} ({currentCapacity === 'light' ? '3' : currentCapacity === 'medium' ? '5' : '7'} tasks)
                    </button>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <BrainDump
                      text={brainDumpText}
                      onTextChange={setBrainDumpText}
                      onCompress={handleCompress}
                      isProcessing={isLoading}
                      error={error}
                    />
                  </div>

                  <CapacityModal
                    isOpen={isCapacityModalOpen}
                    currentCapacity={currentCapacity}
                    onClose={() => setIsCapacityModalOpen(false)}
                    onSelectCapacity={handleCapacitySelect}
                  />
                </div>
              )}

              {/* Timeline View */}
              {currentView === 'timeline' && (
                <div className="max-w-6xl mx-auto">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl mb-4">
                      <span className="text-2xl">📅</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Timeline</h1>
                    <p className="text-gray-600">Your organized tasks and project timeline</p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Timeline />
                  </div>
                </div>
              )}

              {/* Focus Mode View */}
              {currentView === 'focus' && (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Focus Mode</h1>
                    <p className="text-gray-600">Deep work session with focused task completion</p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <FocusMode />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Enterprise Footer */}
        <EnterpriseFooter />
      </div>
    </AuthCheck>
  )
}
