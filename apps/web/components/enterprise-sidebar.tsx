"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { useLumaStore } from "@luma/store"
import { useRouter } from "next/navigation"

interface EnterpriseSidebarProps {
  className?: string
}

export function EnterpriseSidebar({ className = "" }: EnterpriseSidebarProps) {
  const { currentView, setCurrentView } = useAppStore()
  const router = useRouter()
  

  const navigationItems: Array<{
    id: 'brain-dump' | 'timeline' | 'focus' | 'dashboard' | 'analytics' | 'team' | 'settings' | 'tasks'
    label: string
    icon: string
    color: string
    description: string
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      color: 'text-blue-600',
      description: 'Overview & Analytics'
    },
    {
      id: 'tasks',
      label: 'Task Management',
      icon: '✅',
      color: 'text-green-600', 
      description: 'Organize & Track'
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: '📅',
      color: 'text-purple-600',
      description: 'Project Planning'
    },
    {
      id: 'focus',
      label: 'Focus Mode',
      icon: '🎯',
      color: 'text-orange-600',
      description: 'Deep Work'
    },
    {
      id: 'brain-dump',
      label: 'Brain Dump',
      icon: '🧠',
      color: 'text-cyan-600',
      description: 'AI Task Extraction'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      color: 'text-indigo-600',
      description: 'Performance Insights'
    },
    {
      id: 'team',
      label: 'Team',
      icon: '👥',
      color: 'text-pink-600',
      description: 'Collaboration'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      color: 'text-gray-600',
      description: 'Configuration'
    }
  ]

  const handleNavigation = (itemId: 'brain-dump' | 'timeline' | 'focus' | 'dashboard' | 'analytics' | 'team' | 'settings' | 'tasks') => {
    setCurrentView(itemId)
  }

  return (
    <div className={`sidebar-bg flex flex-col h-full ${className}`}>

      {/* Navigation */}
      <nav className="flex-1 safe-area space-y-1">
        {navigationItems.map((item) => {
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`
                nav-item w-full flex items-center px-4 py-3 text-left
                ${isActive
                  ? 'active'
                  : 'text-secondary hover:text-primary'
                }
              `}
            >
              <span className="text-lg transition-transform">
                {item.icon}
              </span>
              <div className="ml-3 flex-1">
                <div className="text-body font-medium">
                  {item.label}
                </div>
                <div className="text-body-small text-secondary">
                  {item.description}
                </div>
              </div>
              {isActive && (
                <div className="w-1 h-6 bg-status-info rounded-full" />
              )}
            </button>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="safe-area border-t border-light">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="white"/>
              <circle cx="12" cy="12" r="2.5" fill="rgba(255,255,255,0.3)"/>
              <circle cx="12" cy="12" r="1" fill="white"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-body font-medium text-primary">John Doe</div>
            <div className="text-body-small text-secondary">Enterprise Admin</div>
          </div>
        </div>
      </div>
    </div>
  )
}