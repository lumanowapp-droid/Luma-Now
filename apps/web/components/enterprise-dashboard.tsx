"use client"

import { useLumaStore } from "@luma/store"

export function EnterpriseDashboard() {
  const tasks = useLumaStore((state) => state.tasks)

  // Calculate metrics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const pendingTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Mock data for enterprise metrics
  const enterpriseMetrics = [
    {
      title: "Total Tasks",
      value: totalTasks.toString(),
      change: "+12%",
      trend: "up",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      change: "+5%",
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Active Projects",
      value: "8",
      change: "+2",
      trend: "up",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Team Productivity",
      value: "94%",
      change: "+3%",
      trend: "up",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  const recentActivities = [
    { id: 1, action: "Task completed", task: "Review quarterly reports", user: "John Doe", time: "2 minutes ago" },
    { id: 2, action: "New task created", task: "Update user documentation", user: "Jane Smith", time: "15 minutes ago" },
    { id: 3, action: "Team meeting scheduled", task: "Sprint planning session", user: "Mike Johnson", time: "1 hour ago" },
    { id: 4, action: "Task completed", task: "API integration testing", user: "Sarah Wilson", time: "2 hours ago" }
  ]

  const upcomingDeadlines = [
    { task: "Q4 Strategy Review", dueDate: "2024-01-15", priority: "high", assignee: "John Doe" },
    { task: "User Testing Session", dueDate: "2024-01-18", priority: "medium", assignee: "Jane Smith" },
    { task: "Marketing Campaign Launch", dueDate: "2024-01-22", priority: "high", assignee: "Mike Johnson" },
    { task: "Security Audit", dueDate: "2024-01-25", priority: "critical", assignee: "Sarah Wilson" }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your team today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Refresh Data
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {enterpriseMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                <span className={`text-2xl ${metric.color}`}>
                  {index === 0 && "📋"}
                  {index === 1 && "✅"}
                  {index === 2 && "🚀"}
                  {index === 3 && "📊"}
                </span>
              </div>
              <div className={`flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
                {metric.change}
              </div>
            </div>
            <div className="mt-4">
              <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
              <div className="text-gray-600 text-sm">{metric.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-gray-600 text-sm">Latest updates from your team</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()}
                    </p>
                    <p className="text-sm text-gray-600">{activity.task}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
            <p className="text-gray-600 text-sm">Tasks requiring attention</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{deadline.task}</p>
                    <p className="text-sm text-gray-600">Assigned to {deadline.assignee}</p>
                    <p className="text-xs text-gray-400">Due {deadline.dueDate}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    deadline.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    deadline.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {deadline.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl mb-2">🧠</span>
            <span className="text-sm font-medium text-gray-900">Brain Dump</span>
            <span className="text-xs text-gray-600">AI Task Creation</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl mb-2">📅</span>
            <span className="text-sm font-medium text-gray-900">Timeline</span>
            <span className="text-xs text-gray-600">Project Planning</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl mb-2">🎯</span>
            <span className="text-sm font-medium text-gray-900">Focus Mode</span>
            <span className="text-xs text-gray-600">Deep Work</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl mb-2">👥</span>
            <span className="text-sm font-medium text-gray-900">Team</span>
            <span className="text-xs text-gray-600">Collaboration</span>
          </button>
        </div>
      </div>
    </div>
  )
}