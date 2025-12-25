import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type')

    if (!query || query.trim().length < 2) {
      return NextResponse.json([])
    }

    // In a real implementation, this would search your database
    // For now, return mock results based on query
    const mockResults = [
      {
        id: '1',
        type: 'task' as const,
        title: `Task: ${query}`,
        description: 'A relevant task matching your search',
        url: `/tasks/1`,
        category: 'Tasks'
      },
      {
        id: '2',
        type: 'project' as const,
        title: `Project: ${query}`,
        description: 'A project that matches your search criteria',
        url: `/projects/1`,
        category: 'Projects'
      }
    ].filter(result =>
      type ? result.type === type : true
    )

    return NextResponse.json(mockResults)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}