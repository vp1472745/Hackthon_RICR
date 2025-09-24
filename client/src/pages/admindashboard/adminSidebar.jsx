import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Trophy,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  BarChart3,
  UserCheck,
  Calendar,
  Mail,
  Download,
  Shield,
  Activity
} from 'lucide-react';

const AdminSidebar = ({ activeSection, setActiveSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
    },
    {
      id: 'participants',
      label: 'Participants',
      icon: Users,
      description: 'Manage Registrations',
      badge: '1247'
    },
    {
      id: 'teams',
      label: 'Teams',
      icon: UserCheck,
      description: 'Team Management',
      badge: '312'
    },
    {
      id: 'submissions',
      label: 'Submissions',
      icon: FileText,
      description: 'Project Submissions',
      badge: '298'
    },
    {
      id: 'judging',
      label: 'Judging',
      icon: Trophy,
      description: 'Evaluation & Scoring',
      badge: '45'
    },
    {
      id: 'results',
      label: 'Results',
      icon: BarChart3,
      description: 'Rankings & Awards'
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar,
      description: 'Event Timeline'
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: Mail,
      description: 'Notifications & Messages'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: Download,
      description: 'Data Export & Analytics'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'System Configuration'
    }
  ];

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] rounded-lg mr-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">FutureMaze 2025</p>
              </div>
            </div>
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-gray-500'
                      }`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${
                          isActive ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.label}
                        </p>
                        <p className={`text-xs truncate ${
                          isActive ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {item.badge && (
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                        isActive
                          ? 'bg-white bg-opacity-20 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* System Status */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <Activity className="w-4 h-4 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">System Status</p>
                  <p className="text-xs text-green-600">All services operational</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Online Users</p>
                <p className="text-lg font-bold text-gray-900">247</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Active Sessions</p>
                <p className="text-lg font-bold text-gray-900">892</p>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="space-y-2">
              <button className="w-full flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Notifications</span>
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">3</span>
              </button>
              <button className="w-full flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="w-4 h-4 mr-2" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-gray-700">A</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@futuremaze.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;