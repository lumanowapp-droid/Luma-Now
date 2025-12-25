"use client"

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { HeaderAPI, NotificationItem } from "@/lib/api/api-gateway"
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useSupabase } from "@/providers/supabase-provider"

// Debug logging for performance and issues
const DEBUG_MODE = process.env.NODE_ENV === 'development'
// Performance timers map to track unique instances
const perfTimers = new Map<string, number>();

const logPerformance = (label: string, startTime?: number) => {
  if (DEBUG_MODE) {
    if (startTime) {
      console.log(`[Header Performance] ${label}: ${Date.now() - startTime}ms`)
    } else {
      // Use timestamp instead of console.time to avoid "Timer already exists" warnings
      const key = `[Header] ${label}`;
      if (!perfTimers.has(key)) {
        perfTimers.set(key, Date.now());
      }
    }
  }
}
const logIssue = (issue: string, details?: any) => {
  if (DEBUG_MODE) {
    console.warn(`[Header Issue] ${issue}`, details)
  }
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Simple i18n utility
function useTranslation() {
  const translations = {
    en: {
      // Breadcrumbs
      'breadcrumb.home': 'Home',
      'breadcrumb.dashboard': 'Dashboard',
      'breadcrumb.tasks': 'Task Management',
      'breadcrumb.timeline': 'Timeline',
      'breadcrumb.focus': 'Focus Mode',
      'breadcrumb.brain_dump': 'Brain Dump',
      'breadcrumb.analytics': 'Analytics',
      'breadcrumb.team': 'Team Management',
      'breadcrumb.settings': 'Settings',
      
      // Quick Actions
      'action.new_task': 'New Task',
      'action.brain_dump': 'Quick Brain Dump',
      'action.focus': 'Start Focus',
      
      
      // Notifications
      'notifications.title': 'Notifications',
      'notifications.mark_all_read': 'Mark all read',
      'notifications.empty': 'No notifications',
      'notifications.view_all': 'View all notifications',
      
      // Profile
      'profile.view': 'View Profile',
      'profile.account_settings': 'Account Settings',
      'profile.team_settings': 'Team Settings',
      'profile.billing': 'Billing & Usage',
      'profile.sign_out': 'Sign Out',
      
      // Common
      'common.loading': 'Loading...',
      'common.just_now': 'Just now',
      'common.minutes_ago': 'm ago',
      'common.hours_ago': 'h ago',
      'common.days_ago': 'd ago'
    }
  }
  
  const t = (key: string, params?: Record<string, string | number>): string => {
    const translationsObj = translations as Record<string, Record<string, string>>
    let text = translationsObj.en[key] || key
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, String(value))
      })
    }
    
    return text
  }
  
  return { t }
}

interface EnterpriseHeaderProps {
  className?: string
}

export function EnterpriseHeader({ className = "" }: EnterpriseHeaderProps) {
  logPerformance('Component render start')
  const renderStart = Date.now()

  const { currentView, setCurrentView } = useAppStore()
  const router = useRouter()
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const supabase = useSupabase()
  
  // Theme toggle function
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }
  
  // Enhanced state management
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [notificationsLoading, setNotificationsLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Refs for focus management and click outside
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Log state changes for debugging
  useEffect(() => {
    logIssue('State change detected', { currentView, isProfileMenuOpen, isNotificationsOpen })
  }, [currentView, isProfileMenuOpen, isNotificationsOpen])
  
  // Accessibility: Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Accessibility: Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false)
        setIsNotificationsOpen(false)
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])
  
  // Load notifications on mount
  useEffect(() => {
    const loadNotifications = async () => {
      setNotificationsLoading(true)
      try {
        const data = await HeaderAPI.getNotifications()
        setNotifications(data)
        logPerformance('Notifications loaded', Date.now())
      } catch (error) {
        logIssue('Failed to load notifications', error)
        // Keep empty array on error
      } finally {
        setNotificationsLoading(false)
      }
    }
    loadNotifications()
  }, [])

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      logIssue('Failed to sign out', error)
    }
  }

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        logIssue('Failed to load user data', error)
      }
    }
    loadUser()
  }, [supabase])

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Enhanced page title with breadcrumbs
  const getPageTitle = useMemo(() => {
    const titles: Record<string, string> = {
      'dashboard': t('breadcrumb.dashboard'),
      'tasks': t('breadcrumb.tasks'), 
      'timeline': t('breadcrumb.timeline'),
      'focus': t('breadcrumb.focus'),
      'brain-dump': t('breadcrumb.brain_dump'),
      'analytics': t('breadcrumb.analytics'),
      'team': t('breadcrumb.team'),
      'settings': t('breadcrumb.settings')
    }
    return titles[currentView] || t('breadcrumb.dashboard')
  }, [currentView, t])

  // Enhanced breadcrumbs with better navigation
  const breadcrumbs = useMemo(() => [
    { name: t('breadcrumb.home'), href: '/', current: currentView === 'dashboard' },
    { name: getPageTitle, href: `#${currentView}`, current: currentView !== 'dashboard' }
  ], [currentView, getPageTitle, t])

  // Analytics tracking utility
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    // In a real app, this would send to your analytics service
    console.log('Analytics Event:', eventName, properties)
    
    // Example: Send to Google Analytics, Mixpanel, etc.
    // gtag('event', eventName, properties)
    // analytics.track(eventName, properties)
  }, [])

  // Enhanced quick actions with analytics
  const quickActions = useMemo(() => [
    { 
      name: t('action.new_task'), 
      icon: '➕', 
      action: () => {
        setIsLoading(true)
        trackEvent('quick_action_clicked', { action: 'new_task' })
        setCurrentView('tasks')
        setTimeout(() => setIsLoading(false), 300)
      },
      shortcut: 'Ctrl+N'
    },
    { 
      name: t('action.brain_dump'), 
      icon: '🧠', 
      action: () => {
        setIsLoading(true)
        trackEvent('quick_action_clicked', { action: 'brain_dump' })
        setCurrentView('brain-dump')
        setTimeout(() => setIsLoading(false), 300)
      },
      shortcut: 'Ctrl+B'
    },
    { 
      name: t('action.focus'), 
      icon: '🎯', 
      action: () => {
        setIsLoading(true)
        trackEvent('quick_action_clicked', { action: 'focus_mode' })
        setCurrentView('focus')
        setTimeout(() => setIsLoading(false), 300)
      },
      shortcut: 'Ctrl+F'
    }
  ], [setCurrentView, setIsLoading, trackEvent, t])


  // Track notification interactions
  const markNotificationAsRead = useCallback(async (id: string) => {
    trackEvent('notification_marked_read', { notification_id: id })

    // Optimistically update UI
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )

    // Call API
    try {
      await HeaderAPI.markNotificationRead(id)
    } catch (error) {
      logIssue('Failed to mark notification as read', error)
      // Revert on error
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: false } : notif
        )
      )
    }
  }, [trackEvent])

  const markAllNotificationsAsRead = useCallback(() => {
    trackEvent('all_notifications_marked_read')
    
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }, [trackEvent])

  const deleteNotification = useCallback((id: string) => {
    trackEvent('notification_deleted', { notification_id: id })
    
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }, [trackEvent])

  const unreadCount = notifications.filter(n => !n.read).length

  // Format timestamp for notifications
  const formatTimestamp = useCallback((timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }, [])

  // Get notification type styles
  const getNotificationStyles = useCallback((type: NotificationItem['type']) => {
    const styles = {
      info: 'bg-status-info',
      success: 'bg-status-success', 
      warning: 'bg-status-warning',
      error: 'bg-status-danger'
    }
    return styles[type]
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }
      
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'n':
            event.preventDefault()
            quickActions[0].action()
            break
          case 'b':
            event.preventDefault()
            quickActions[1].action()
            break
          case 'f':
            event.preventDefault()
            quickActions[2].action()
            break
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyboardShortcuts)
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts)
  }, [quickActions])

  // Log render completion
  useEffect(() => {
    logPerformance('Component render completed', renderStart)
  })

  return (
    <header className={`header-bg sticky top-0 z-40 ${className}`} role="banner">
      <div className="safe-area">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Breadcrumbs */}
          <div className="flex items-center min-w-0 flex-1">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 mr-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="white"/>
                    <circle cx="12" cy="12" r="2.5" fill="rgba(255,255,255,0.3)"/>
                    <circle cx="12" cy="12" r="1" fill="white"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-primary hidden sm:block">Luma Now</span>
              </div>
            </div>

            {/* Breadcrumbs */}
            <div className="flex-1 min-w-0">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-1">
                  {breadcrumbs.map((item, index) => (
                    <li key={item.name} className="flex items-center">
                      {index > 0 && (
                        <svg
                          className="flex-shrink-0 h-4 w-4 text-secondary mx-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {item.current ? (
                        <span
                          className="text-body-small font-medium text-primary truncate"
                          aria-current="page"
                        >
                          {item.name}
                        </span>
                      ) : (
                        <button
                          onClick={() => item.href !== '/' && setCurrentView(currentView)}
                          className="text-body-small font-medium text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5"
                        >
                          {item.name}
                        </button>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </div>

          {/* Center - Quick Actions */}
          <div className="hidden lg:flex items-center space-x-1 flex-shrink-0">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                disabled={isLoading}
                className="btn btn-ghost flex items-center px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 hover:bg-gray-50 rounded-lg"
                title={`${action.name} (${action.shortcut})`}
                aria-label={`${action.name} - Keyboard shortcut: ${action.shortcut}`}
              >
                <span className="mr-2 text-lg" aria-hidden="true">{action.icon}</span>
                <span className="text-sm font-medium">{action.name}</span>
                {isLoading && (
                  <svg className="ml-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-1 flex-shrink-0">

            {/* Mobile Quick Actions Menu */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsLoading(!isLoading)}
                className="p-2 text-secondary hover:text-primary hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                aria-label="Quick actions menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </button>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-secondary hover:text-primary hover:bg-gray-50 relative transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                aria-expanded={isNotificationsOpen}
                aria-haspopup="true"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12a1 1 0 011-1h6a1 1 0 011 1v12z" />
                </svg>
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-status-danger ring-2 ring-white text-xs font-bold text-white flex items-center justify-center"
                    aria-label={`${unreadCount} unread notifications`}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Enhanced Notifications dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 card z-50 max-h-96 overflow-y-auto" role="dialog" aria-label="Notifications">
                  <div className="safe-area">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-body font-medium text-primary">{t('notifications.title')}</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllNotificationsAsRead}
                          className="text-body-small text-link hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        >
                          {t('notifications.mark_all_read')}
                        </button>
                      )}
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                       {notificationsLoading ? (
                         // Loading skeleton
                         <div className="space-y-3">
                           {[...Array(3)].map((_, i) => (
                             <div key={i} className="flex items-start space-x-3 p-2">
                               <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 animate-pulse"></div>
                               <div className="flex-1">
                                 <div className="h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
                                 <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4 mb-1"></div>
                                 <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2"></div>
                               </div>
                             </div>
                           ))}
                         </div>
                       ) : notifications.length === 0 ? (
                         <div className="text-center py-8 text-secondary">
                           <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12a1 1 0 011-1h6a1 1 0 011 1v12z" />
                           </svg>
                           <p className="mt-2">{t('notifications.empty')}</p>
                         </div>
                       ) : (
                        notifications.map((notification) => (
                          <div key={notification.id} className={`flex items-start space-x-3 p-2 rounded ${!notification.read ? 'bg-blue-50' : ''}`}>
                            <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationStyles(notification.type)}`} aria-hidden="true"></div>
                            <div className="flex-1">
                              <p className="text-body text-primary font-medium">{notification.title}</p>
                              <p className="text-body-small text-secondary">{notification.message}</p>
                              <p className="text-body-small text-secondary">{formatTimestamp(notification.timestamp)}</p>
                            </div>
                            <div className="flex flex-col space-y-1">
                              {!notification.read && (
                                <button
                                  onClick={() => markNotificationAsRead(notification.id)}
                                  className="text-body-small text-link hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                                  aria-label="Mark as read"
                                >
                                  ✓
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-body-small text-red-600 hover:text-red-800 focus:outline-none focus:ring-1 focus:ring-red-500 rounded"
                                aria-label="Delete notification"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-light">
                        <button className="text-body-small text-link hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded w-full text-center">
                          {t('notifications.view_all')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Profile menu${isProfileMenuOpen ? ' (open)' : ''}`}
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="white"/>
                    <circle cx="12" cy="12" r="2.5" fill="rgba(255,255,255,0.3)"/>
                    <circle cx="12" cy="12" r="1" fill="white"/>
                  </svg>
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium text-primary">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</div>
                  <div className="text-xs text-secondary">Enterprise Admin</div>
                </div>
                <svg className="h-4 w-4 text-secondary transition-transform duration-200" style={{ transform: isProfileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Enhanced Profile dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 card z-50" role="dialog" aria-label="Profile menu">
                  <div className="safe-area">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg" aria-hidden="true">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="white"/>
                          <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.3)"/>
                          <circle cx="12" cy="12" r="1" fill="white"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-body font-medium text-primary">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</div>
                        <div className="text-body-small text-secondary">{user?.email || 'user@example.com'}</div>
                        <div className="text-body-small text-link font-medium">Enterprise Plan</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 text-body text-primary hover:bg-hover rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {t('profile.view')}
                      </button>
                      <button className="w-full text-left px-3 py-2 text-body text-primary hover:bg-hover rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {t('profile.account_settings')}
                      </button>
                      <button className="w-full text-left px-3 py-2 text-body text-primary hover:bg-hover rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {t('profile.team_settings')}
                      </button>
                      <button className="w-full text-left px-3 py-2 text-body text-primary hover:bg-hover rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {t('profile.billing')}
                      </button>
                      <hr className="my-2 border-light" />
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-body text-status-danger hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {t('profile.sign_out')}
                      </button>
                      <hr className="my-2 border-light" />
                      <button
                        onClick={toggleTheme}
                        className="w-full text-left px-3 py-2 text-body text-primary hover:bg-hover rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                      >
                        {theme === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded-lg shadow-lg border">
            <svg className="h-5 w-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-body font-medium text-primary">{t('common.loading')}</span>
          </div>
        </div>
      )}
    </header>
  )
}

export default memo(EnterpriseHeader)