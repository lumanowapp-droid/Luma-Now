"use client"

import { useLumaStore } from "@luma/store"

export function EnterpriseAnalytics() {
  const tasks = useLumaStore((state) => state.tasks)

  // Calculate analytics data
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const pendingTasks = totalTasks - completedTasks

  // Mock data for charts and analytics
  const performanceData = [
    { period: "Week 1", completed: 12, created: 15 },
    { period: "Week 2", completed: 18, created: 20 },
    { period: "Week 3", completed: 25, created: 22 },
    { period: "Week 4", completed: 30, created: 28 }
  ]

  const productivityData = [
    { category: "Work", hours: 45, tasks: 28 },
    { category: "Personal", hours: 12, tasks: 15 },
    { category: "Meetings", hours: 8, tasks: 5 },
    { category: "Planning", hours: 6, tasks: 12 }
  ]

  const teamPerformance = [
    { name: "John Doe", tasksCompleted: 28, efficiency: 94, hoursLogged: 42 },
    { name: "Jane Smith", tasksCompleted: 35, efficiency: 88, hoursLogged: 38 },
    { name: "Mike Johnson", tasksCompleted: 22, efficiency: 91, hoursLogged: 35 },
    { name: "Sarah Wilson", tasksCompleted: 31, efficiency: 96, hoursLogged: 40 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-1">Comprehensive performance metrics and team analytics</p>
        </div>
        <div className="flex space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Task Completion Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">📈</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
            +12% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Tasks/Day</p>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
            +8% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Efficiency</p>
              <p className="text-2xl font-bold text-purple-600">92%</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">⚡</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
            +5% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours Logged</p>
              <p className="text-2xl font-bold text-orange-600">1,247</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-xl">⏰</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
            +15% from last month
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Task Performance Trend</h3>
            <p className="text-gray-600 text-sm">Weekly task completion vs creation</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {performanceData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{data.period}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Completed: {data.completed}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Created: {data.created}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Mock Chart Bar Visualization */}
            <div className="mt-6 space-y-3">
              {performanceData.map((data, index) => {
                const maxValue = Math.max(...performanceData.map(d => Math.max(d.completed, d.created)))
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{data.period}</span>
                      <span>{data.completed}/{data.created}</span>
                    </div>
                    <div className="flex space-x-1">
                      <div 
                        className="h-2 bg-green-500 rounded"
                        style={{ width: `${(data.completed / maxValue) * 100}%` }}
                      ></div>
                      <div 
                        className="h-2 bg-blue-500 rounded"
                        style={{ width: `${(data.created / maxValue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Productivity Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Productivity Breakdown</h3>
            <p className="text-gray-600 text-sm">Time allocation by category</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {productivityData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{data.category}</span>
                    <span className="text-sm text-gray-600">{data.hours}h • {data.tasks} tasks</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${(data.hours / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
          <p className="text-gray-600 text-sm">Individual team member metrics</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours Logged</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamPerformance.map((member, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-700">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.tasksCompleted}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">{member.efficiency}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            member.efficiency >= 95 ? 'bg-green-500' :
                            member.efficiency >= 90 ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${member.efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.hoursLogged}h</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      member.efficiency >= 95 ? 'bg-green-100 text-green-800' :
                      member.efficiency >= 90 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.efficiency >= 95 ? 'Excellent' :
                       member.efficiency >= 90 ? 'Good' : 'Average'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}