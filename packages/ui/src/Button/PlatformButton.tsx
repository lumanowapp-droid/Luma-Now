import React from 'react'
import { ButtonProps, BaseComponentProps } from '@multi-platform-app/types'

// Platform detection utilities
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined'
const isReactNative = typeof navigator === 'undefined'

interface CrossPlatformButtonProps extends ButtonProps, BaseComponentProps {
  fullWidth?: boolean
}

// Web-specific implementation
const WebButton: React.FC<CrossPlatformButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  children,
  testID,
  accessibilityLabel,
  ...props
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ]

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  }

  const widthClasses = fullWidth ? 'w-full' : ''

  const className = [
    ...baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses
  ].join(' ').trim()

  return (
    <button
      type="button"
      className={className}
      onClick={onPress}
      disabled={disabled || loading}
      aria-label={accessibilityLabel}
      data-testid={testID}
      style={style}
      {...props}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {title}
        </span>
      ) : (
        <span className="flex items-center">
          {icon && (
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {title || children}
        </span>
      )}
    </button>
  )
}

// Mobile-specific implementation (React Native)
const MobileButton: React.FC<CrossPlatformButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  children,
  testID,
  accessibilityLabel,
  accessibilityRole,
  ...props
}) => {
  // Dynamic import for React Native components
  const [TouchableOpacity, Text, ActivityIndicator, StyleSheet, View] = React.useMemo(() => {
    try {
      return [
        require('react-native').TouchableOpacity,
        require('react-native').Text,
        require('react-native').ActivityIndicator,
        require('react-native').StyleSheet,
        require('react-native').View
      ]
    } catch (error) {
      // Fallback for web environment
      return [null, null, null, null, null]
    }
  }, [])

  if (!TouchableOpacity || !Text) {
    // Web fallback
    return (
      <button
        type="button"
        onClick={onPress}
        disabled={disabled || loading}
        aria-label={accessibilityLabel}
        data-testid={testID}
        className={[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          'bg-blue-600 text-white hover:bg-blue-700',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          fullWidth ? 'w-full' : ''
        ].join(' ')}
        style={style}
        {...props}
      >
        {loading ? 'Loading...' : title || children}
      </button>
    )
  }

  const baseStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      paddingHorizontal: size === 'small' ? 12 : size === 'large' ? 24 : 16,
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
      backgroundColor: variant === 'primary' ? '#2563eb' : 
                      variant === 'secondary' ? '#f3f4f6' :
                      variant === 'danger' ? '#dc2626' : 'transparent',
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: '#d1d5db',
      opacity: disabled ? 0.5 : 1
    },
    text: {
      color: variant === 'secondary' || variant === 'outline' ? '#111827' : '#ffffff',
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      fontWeight: '600',
      textAlign: 'center'
    },
    icon: {
      marginRight: 8
    }
  })

  return (
    <TouchableOpacity
      style={[
        baseStyles.container,
        fullWidth && { width: '100%' },
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole || 'button'}
      testID={testID}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'outline' ? '#111827' : '#ffffff'}
        />
      ) : (
        <>
          {icon && (
            <Text style={[baseStyles.text, baseStyles.icon]}>
              {icon}
            </Text>
          )}
          <Text style={baseStyles.text}>
            {title || children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  )
}

export const Button: React.FC<CrossPlatformButtonProps> = (props) => {
  if (isWeb) {
    return <WebButton {...props} />
  }
  return <MobileButton {...props} />
}

export type { CrossPlatformButtonProps }