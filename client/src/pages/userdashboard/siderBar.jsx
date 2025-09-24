import React, { useState } from 'react';
import {
  Home,
  FileText,
  Target,
  Trophy,
  Phone,
  Users,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import TeamManagement from '../userdashboard/Team/TeamPage.jsx';
import Contact from './contact.jsx';

const SideBar = ({ activeSection, setActiveSection, onSidebarToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onSidebarToggle) {
      onSidebarToggle(newCollapsedState);
    }
  };

  const menuItems = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Home,
      description: 'Dashboard Overview'
    },
    {
      id: 'problemStatement',
      title: 'Problem Statement',
      icon: FileText,
      description: 'Challenge Details'
    },
    {
      id: 'team',
      title: 'Add Team Members',
      icon: Users,
      description: 'Manage Team Members'
    },
    {
      id: 'result',
      title: 'Result',
      icon: Trophy,
      description: 'Competition Results'
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: Phone,
      description: 'Support & Help'
    }
  ];

  return (
    <div className={`bg-white border-r border-gray-200 fixed left-0 top-0 ${
      isCollapsed ? 'w-12 sm:w-16' : 'w-56 sm:w-64'
    } h-full flex flex-col overflow-hidden z-10 mt-12 sm:mt-14 transition-all duration-300`}>

      {/* Team Header Section */}
      <div className="p-2 sm:p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              {/* Team Image/Avatar */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#0B2A4A] to-[#1D5B9B] rounded-full flex items-center justify-center text-white font-bold">
                <Users size={16} className="sm:w-5 sm:h-5" />
              </div>
              {/* Team Name */}
              <div className="min-w-0">
                <h3 className="font-bold text-[#0B2A4A] text-sm sm:text-base truncate">Team Alpha</h3>
                <p className="text-xs text-gray-500 truncate">FutureMaze 2025</p>
              </div>
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={handleToggle}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
          >
            {isCollapsed ? (
              <ChevronRight size={14} className="text-gray-600 sm:w-4 sm:h-4" />
            ) : (
              <ChevronDown size={14} className="text-gray-600 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>

        {/* Team Image (when expanded) - Made smaller */}
        {!isCollapsed && (
          <div className="mt-2 sm:mt-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto cursor-pointer hover:bg-gray-100 transition-colors duration-200">
              <div className="text-center">
                <Users size={16} className="text-gray-400 mx-auto mb-1 sm:w-5 sm:h-5" />
                <p className="text-xs text-gray-500 hidden sm:block">Team Photo</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 sm:p-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id} className="relative">
                <button
                  onClick={() => {
                    setActiveSection(item.id);
                    // Auto-collapse sidebar on mobile/small screens or when user wants it closed
                    if (!isCollapsed) {
                      setIsCollapsed(true);
                      if (onSidebarToggle) {
                        onSidebarToggle(true);
                      }
                    }
                  }}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#0B2A4A] text-white shadow-md'
                      : 'hover:bg-gray-50 text-gray-700 hover:text-[#0B2A4A]'
                  }`}
                >
                  <Icon
                    size={16}
                    className={`flex-shrink-0 sm:w-[18px] sm:h-[18px] ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#0B2A4A]'
                    }`}
                  />

                  {!isCollapsed && (
                    <div className="flex-1 text-left min-w-0">
                      <div className={`font-medium text-xs sm:text-sm truncate ${
                        isActive ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </div>
                      <div className={`text-xs truncate hidden sm:block ${
                        isActive ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  )}

                  {!isCollapsed && isActive && (
                    <ChevronRight size={12} className="text-white flex-shrink-0 sm:w-[14px] sm:h-[14px]" />
                  )}
                </button>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-12 sm:left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs sm:text-sm opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                    {item.title}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

    </div>
  );
};

export default SideBar;
