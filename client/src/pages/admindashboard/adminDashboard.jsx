import React, { useState } from 'react';
import AdminSidebar from './adminSidebar';
import {
  Users,
  Trophy,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock,
  TrendingUp,
  UserCheck,
  FileText,
  Activity,
  RefreshCw,
  Shield,
  Globe,
  Zap,
  Server,
  Search,
  Filter
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample admin dashboard data
  const dashboardStats = {
    totalRegistrations: 1247,
    totalTeams: 312,
    activeParticipants: 1180,
    completedSubmissions: 298,
    pendingReviews: 45,
    resultsPublished: 267
  };

  const recentActivity = [
    { id: 1, action: 'New team registration', user: 'Team Alpha', time: '2 mins ago', type: 'registration' },
    { id: 2, action: 'Submission uploaded', user: 'Team Beta', time: '5 mins ago', type: 'submission' },
    { id: 3, action: 'Review completed', user: 'Judge Smith', time: '10 mins ago', type: 'review' },
    { id: 4, action: 'Result published', user: 'System', time: '15 mins ago', type: 'result' },
    { id: 5, action: 'New registration', user: 'Ravi Kumar', time: '20 mins ago', type: 'registration' }
  ];

  const teamData = [
    {
      id: 1,
      teamName: 'FutureMaze Innovators',
      leader: 'Ravi Kumar',
      members: 4,
      college: 'RICR College',
      status: 'active',
      submitted: true,
      score: 95.5
    },
    {
      id: 2,
      teamName: 'Code Warriors',
      leader: 'Amit Sharma',
      members: 3,
      college: 'NRI Institute',
      status: 'active',
      submitted: true,
      score: 88.2
    },
    {
      id: 3,
      teamName: 'Tech Titans',
      leader: 'Priya Singh',
      members: 5,
      college: 'ABC University',
      status: 'pending',
      submitted: false,
      score: null
    }
  ];

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'participants':
        return renderParticipants();
      case 'teams':
        return renderTeams();
      case 'submissions':
        return renderSubmissions();
      case 'results':
        return renderResults();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to FutureMaze Hackathon Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-3xl font-bold text-[#0B2A4A]">{dashboardStats.totalRegistrations}</p>
            </div>
            <Users className="w-8 h-8 text-[#0B2A4A]" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Teams</p>
              <p className="text-3xl font-bold text-green-600">{dashboardStats.totalTeams}</p>
            </div>
            <Trophy className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Submissions</p>
              <p className="text-3xl font-bold text-blue-600">{dashboardStats.completedSubmissions}</p>
            </div>
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-3xl font-bold text-orange-600">{dashboardStats.pendingReviews}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Participants</p>
              <p className="text-3xl font-bold text-purple-600">{dashboardStats.activeParticipants}</p>
            </div>
            <UserCheck className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Results Published</p>
              <p className="text-3xl font-bold text-indigo-600">{dashboardStats.resultsPublished}</p>
            </div>
            <Trophy className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.user}</p>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderParticipants = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Participant Management</h3>
      <p className="text-gray-500">Participant management interface will be implemented here.</p>
    </div>
  );

  const renderTeams = () => (
    <div className="space-y-6">
      {/* Teams Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <button className="bg-[#0B2A4A] text-white px-4 py-2 rounded-lg hover:bg-[#1D5B9B] transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Team</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leader</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamData.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{team.teamName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{team.leader}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{team.members}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{team.college}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      team.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {team.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {team.score ? team.score : 'Not scored'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSubmissions = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Management</h3>
      <p className="text-gray-500">Submission management interface will be implemented here.</p>
    </div>
  );

  const renderResults = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Results Management</h3>
      <p className="text-gray-500">Results management interface will be implemented here.</p>
    </div>
  );

  const renderAnalytics = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Dashboard</h3>
      <p className="text-gray-500">Analytics dashboard will be implemented here.</p>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
      <p className="text-gray-500">Admin settings interface will be implemented here.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Sidebar */}
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-80">
        <div className="p-4 sm:p-6">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;