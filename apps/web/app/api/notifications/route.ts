import { NextRequest, NextResponse } from 'next/server'
import { apiGateway } from '@/lib/api/api-gateway'
import { NotificationItem } from '@/lib/api/api-gateway'

export async function GET(request: NextRequest) {
  try {
    return await apiGateway.handleRequest(request, async (req) => {
      // In a real implementation, this would fetch from database
      // For now, return mock notifications
      const mockNotifications: NotificationItem[] = [
        {
          id: '1',
          type: 'info' as const,
          title: 'New task assigned',
          message: 'Review quarterly reports',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          read: false
        },
        {
          id: '2',
          type: 'success' as const,
          title: 'Team meeting scheduled',
          message: 'Tomorrow at 2:00 PM',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          read: false
        },
        {
          id: '3',
          type: 'warning' as const,
          title: 'Deadline reminder',
          message: 'Security audit due in 2 hours',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true
        }
      ]

      return NextResponse.json(mockNotifications)
    })
  } catch (error) {
    console.error('Notifications API error:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}