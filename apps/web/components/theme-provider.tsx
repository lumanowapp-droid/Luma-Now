'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

/**
 * Accessibility Preferences
 * Detects and tracks system accessibility preferences
 */
interface AccessibilityPreferences {
  reducedMotion: boolean
  highContrast: boolean
}

const AccessibilityContext = React.createContext<AccessibilityPreferences>({
  reducedMotion: false,
  highContrast: false,
})

/**
 * Hook to access accessibility preferences
 * @example
 * const { reducedMotion, highContrast } = useAccessibility()
 * if (reducedMotion) return <StaticComponent />
 */
export const useAccessibility = () => React.useContext(AccessibilityContext)

/**
 * Enhanced Theme Provider with Accessibility Detection
 * Respects system preferences for:
 * - prefers-reduced-motion
 * - prefers-contrast
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [preferences, setPreferences] = React.useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
  })

  React.useEffect(() => {
    // Detect prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')

    const updatePreferences = () => {
      const newPreferences = {
        reducedMotion: reducedMotionQuery.matches,
        highContrast: highContrastQuery.matches,
      }

      setPreferences(newPreferences)

      // Apply classes to document root
      if (reducedMotionQuery.matches) {
        document.documentElement.classList.add('reduce-motion')
      } else {
        document.documentElement.classList.remove('reduce-motion')
      }

      if (highContrastQuery.matches) {
        document.documentElement.classList.add('high-contrast')
      } else {
        document.documentElement.classList.remove('high-contrast')
      }
    }

    // Initial check
    updatePreferences()

    // Listen for changes (user can toggle in OS settings)
    reducedMotionQuery.addEventListener('change', updatePreferences)
    highContrastQuery.addEventListener('change', updatePreferences)

    return () => {
      reducedMotionQuery.removeEventListener('change', updatePreferences)
      highContrastQuery.removeEventListener('change', updatePreferences)
    }
  }, [])

  return (
    <AccessibilityContext.Provider value={preferences}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </AccessibilityContext.Provider>
  )
}