import { createBrowserClient, createServerClient } from '@supabase/ssr'

type Cookie = {
  name: string
  value: string
  options?: {
    path?: string
    expires?: Date
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'lax' | 'strict' | 'none'
  }
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          if (typeof document === 'undefined') return []
          const cookies = document.cookie.split(';').filter(c => c.trim())
          return cookies.map(c => {
            const [name, ...rest] = c.split('=')
            return { 
              name: name?.trim() || '', 
              value: rest.join('=') || '' 
            }
          })
        },
        setAll(cookiesToSet: Cookie[]) {
          if (typeof document === 'undefined') return
          cookiesToSet.forEach(({ name, value, options }: Cookie) => {
            try {
              // Ensure proper cookie formatting for PKCE
              let cookieStr = `${name}=${value}`
              
              if (options?.path) {
                cookieStr += `; path=${options.path}`
              }
              if (options?.expires) {
                cookieStr += `; expires=${options.expires.toUTCString()}`
              }
              if (options?.httpOnly) {
                cookieStr += `; httpOnly`
              }
              if (options?.secure) {
                cookieStr += `; secure`
              }
              if (options?.sameSite) {
                cookieStr += `; sameSite=${options.sameSite}`
              }
              
              document.cookie = cookieStr
              console.log('Cookie set:', name, 'Value length:', value.length)
            } catch (error) {
              console.error('Error setting cookie:', error)
            }
          })
        },
      },
    }
  )
}

export async function createServerSupabaseClient() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Cookie[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: Cookie) => {
              cookieStore.set(name, value, {
                path: '/',
                httpOnly: false, // Allow client access for PKCE
                secure: false, // Allow HTTP in development
                sameSite: 'lax',
                ...options
              })
            })
          } catch (error) {
            // Ignore if called from Server Component
            console.log('Cookie set from server component:', error)
          }
        },
      },
    }
  )
}