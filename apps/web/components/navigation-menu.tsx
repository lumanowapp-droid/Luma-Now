"use client"

import { useAppStore } from "@/lib/store"

export function NavigationMenu() {
  const { currentView, setCurrentView } = useAppStore()

  const navItems = [
    { id: 'brain-dump' as const, label: 'Brain Dump', icon: '🧠', color: 'from-blue-400 to-cyan-400' },
    { id: 'timeline' as const, label: 'Timeline', icon: '📅', color: 'from-green-400 to-emerald-400' },
    { id: 'focus' as const, label: 'Focus', icon: '🎯', color: 'from-purple-400 to-pink-400' },
  ]

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
        {navItems.map((item) => {
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                relative px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform
                ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                    : 'text-gray-600 hover:bg-gray-100 hover:scale-105 hover:shadow-md'
                }
              `}
              aria-label={item.label}
              aria-current={currentView === item.id ? 'page' : undefined}
            >
              <span className="mr-2" aria-hidden="true">{item.icon}</span>
              {item.label}
              {isActive && (
                <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
