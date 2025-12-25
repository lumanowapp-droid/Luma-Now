"use client"

import { useState } from "react"

export function EnterpriseTeam() {
  const [activeTab, setActiveTab] = useState('members')

  const teamMembers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Project Manager",
      department: "Operations",
      status: "active",
      tasksCompleted: 28,
      joinDate: "2023-01-15",
      avatar: "JD"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@company.com",
      role: "Senior Developer",
      department: "Engineering",
      status: "active",
      tasksCompleted: 35,
      joinDate: "2023-02-20",
      avatar: "JS"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      role: "UX Designer",
      department: "Design",
      status: "active",
      tasksCompleted: 22,
      joinDate: "2023-03-10",
      avatar: "MJ"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      role: "QA Engineer",
      department: "Quality Assurance",
      status: "active",
      tasksCompleted: 31,
      joinDate: "2023-04-05",
      avatar: "SW"
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@company.com",
      role: "Data Analyst",
      department: "Analytics",
      status: "inactive",
      tasksCompleted: 18,
      joinDate: "2023-05-12",
      avatar: "DB"
    }
  ]

  const departments = [
    { name: "Engineering", members: 12, active: 11 },
    { name: "Design", members: 8, active: 7 },
    { name: "Operations", members: 6, active: 6 },
    { name: "Analytics", members: 4, active: 3 },
    { name: "Quality Assurance", members: 5, active: 5 }
  ]

  const pendingInvites = [
    { email: "new.user@company.com", role: "Developer", department: "Engineering", invitedBy: "Jane Smith", date: "2024-01-20" },
    { email: "another.user@company.com", role: "Designer", department: "Design", invitedBy: "Mike Johnson", date: "2024-01-19" }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">Manage your team members, roles, and permissions</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Invite Member
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {departments.map((dept, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{dept.members}</div>
              <div className="text-sm text-gray-600">{dept.name}</div>
              <div className="text-xs text-gray-500 mt-1">{dept.active} active</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('members')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'members'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Team Members
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'roles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Roles & Permissions
          </button>
          <button
            onClick={() => setActiveTab('invites')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'invites'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Invites ({pendingInvites.length})
          </button>
        </nav>
      </div>

      {/* Team Members Tab */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Team Members</h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Search members..."
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>Operations</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-700">{member.avatar}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.tasksCompleted}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles & Permissions Tab */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Roles & Permissions</h3>
            <p className="text-gray-600 text-sm">Define and manage user roles and their permissions</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: "Admin", description: "Full access to all features", members: 2, color: "bg-red-100 text-red-800" },
                { name: "Project Manager", description: "Can manage projects and team members", members: 3, color: "bg-blue-100 text-blue-800" },
                { name: "Developer", description: "Can create and edit tasks", members: 8, color: "bg-green-100 text-green-800" },
                { name: "Viewer", description: "Read-only access", members: 5, color: "bg-gray-100 text-gray-800" }
              ].map((role, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${role.color}`}>
                      {role.name}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{role.description}</div>
                      <div className="text-sm text-gray-500">{role.members} members</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">Edit</button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pending Invites Tab */}
      {activeTab === 'invites' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Pending Invitations</h3>
            <p className="text-gray-600 text-sm">Team members invited but not yet joined</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingInvites.map((invite, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-sm font-medium">⏳</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invite.email}</div>
                      <div className="text-sm text-gray-500">
                        {invite.role} • {invite.department} • Invited by {invite.invitedBy}
                      </div>
                      <div className="text-xs text-gray-400">{invite.date}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">Resend</button>
                    <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">Cancel</button>
                  </div>
                </div>
              ))}
              {pendingInvites.length === 0 && (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">🎉</span>
                  <div className="text-gray-500">No pending invitations</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}