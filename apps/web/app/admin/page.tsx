'use client'

/**
 * Admin Dashboard - Developer Control Panel
 * Provides system monitoring, configuration, and database management
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../../providers'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

interface SystemStats {
  totalUsers: number
  totalTasks: number
  totalSessions: number
  apiRequests24h: number
  activeUsers: number
}

interface DatabaseStatus {
  tables: {
    name: string
    rows: number
    size: string
  }[]
  health: 'healthy' | 'warning' | 'critical'
}

export default function AdminDashboard() {
  const supabase = useSupabase()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalTasks: 0,
    totalSessions: 0,
    apiRequests24h: 0,
    activeUsers: 0,
  })
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>({
    tables: [],
    health: 'healthy',
  })

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/signin')
        return
      }

      // Check if user is admin (you can implement your own logic)
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'owner' && profile?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
      await loadDashboardData()
    } catch (error) {
      console.error('Admin check error:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardData = async () => {
    try {
      // Load system stats
      const [usersCount, tasksCount, sessionsCount] = await Promise.all([
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('session_id', { count: 'exact', head: true }),
      ])

      setStats({
        totalUsers: usersCount.count || 0,
        totalTasks: tasksCount.count || 0,
        totalSessions: sessionsCount.count || 0,
        apiRequests24h: 0, // Would come from api_requests table
        activeUsers: 0, // Would come from user_profiles with recent activity
      })

      // Load database status
      // In production, this would query database metadata
      setDbStatus({
        tables: [
          { name: 'user_profiles', rows: usersCount.count || 0, size: '—' },
          { name: 'tasks', rows: tasksCount.count || 0, size: '—' },
          { name: 'tenants', rows: 0, size: '—' },
        ],
        health: 'healthy',
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const runMigration = async () => {
    if (!confirm('Are you sure you want to run database migrations? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/admin/migrate', {
        method: 'POST',
      })

      if (response.ok) {
        alert('Migration completed successfully')
        await loadDashboardData()
      } else {
        const error = await response.text()
        alert(`Migration failed: ${error}`)
      }
    } catch (error) {
      console.error('Migration error:', error)
      alert('Migration failed. Check console for details.')
    }
  }

  const clearCache = async () => {
    if (!confirm('Clear all application caches?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/cache', {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Cache cleared successfully')
      } else {
        alert('Failed to clear cache')
      }
    } catch (error) {
      console.error('Cache clear error:', error)
      alert('Failed to clear cache')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">System monitoring and management</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>Registered accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{stats.totalUsers}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Tasks</CardTitle>
                  <CardDescription>Created tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{stats.totalTasks}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sessions</CardTitle>
                  <CardDescription>Brain dump sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{stats.totalSessions}</p>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Overall system status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Database</span>
                  <span className="text-sm text-green-600">● Healthy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API</span>
                  <span className="text-sm text-green-600">● Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Storage</span>
                  <span className="text-sm text-green-600">● Available</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Tables</CardTitle>
                <CardDescription>Schema and data overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dbStatus.tables.map(table => (
                    <div key={table.name} className="flex items-center justify-between py-2 border-b">
                      <span className="font-mono text-sm">{table.name}</span>
                      <div className="flex gap-4">
                        <span className="text-sm text-gray-600">{table.rows} rows</span>
                        <span className="text-sm text-gray-600">{table.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Operations</CardTitle>
                <CardDescription>Manage database schema and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={runMigration} variant="outline" className="w-full">
                  Run Migrations
                </Button>
                <Button onClick={clearCache} variant="outline" className="w-full">
                  Clear Cache
                </Button>
                <Button
                  onClick={() => router.push('/admin/backup')}
                  variant="outline"
                  className="w-full"
                >
                  Backup Database
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>Required configuration (values hidden for security)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm">
                  <ConfigItem name="NEXT_PUBLIC_SUPABASE_URL" value={process.env.NEXT_PUBLIC_SUPABASE_URL} />
                  <ConfigItem name="NEXT_PUBLIC_SUPABASE_ANON_KEY" value={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY} />
                  <ConfigItem name="ANTHROPIC_API_KEY" value={process.env.ANTHROPIC_API_KEY} />
                  <ConfigItem name="OPENAI_API_KEY" value={process.env.OPENAI_API_KEY} />
                  <ConfigItem name="CLOUDFLARE_ACCOUNT_ID" value={process.env.CLOUDFLARE_ACCOUNT_ID} />
                  <ConfigItem name="CLOUDFLARE_API_TOKEN" value={process.env.CLOUDFLARE_API_TOKEN} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Flags</CardTitle>
                <CardDescription>Toggle application features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Voice Input</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Scheduling</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mobile App</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>System logs and audit trail</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Logs would be displayed here. Connect to your logging service (e.g., Sentry, LogRocket) to view
                  detailed application logs.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ConfigItem({ name, value }: { name: string; value?: string }) {
  const isSet = Boolean(value)
  return (
    <div className="flex items-center justify-between py-2 border-b">
      <span className="text-gray-700">{name}</span>
      <span className={isSet ? 'text-green-600' : 'text-red-600'}>
        {isSet ? '✓ Set' : '✗ Not Set'}
      </span>
    </div>
  )
}
