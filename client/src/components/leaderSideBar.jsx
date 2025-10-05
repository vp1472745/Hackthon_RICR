import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  Award,
  Headset,
  UserSquare,
  ChevronRight,
  ChevronDown,
  Users
} from 'lucide-react';
import { userAPI } from '../configs/api';


const iconMap = {
  overview: LayoutDashboard,
  projectTheme: Layers,
  problemStatement: BookOpen,
  team: UserSquare,
  result: Award,
  contact: Headset,
  // Admin dashboard custom icons (fallback to BookOpen if not found)
  manageTheme: Layers,
  viewUsers: UserSquare,
  viewTeams: Users,
  problemStatements: BookOpen,
};

const SideBar = ({ activeSection, setActiveSection, onSidebarToggle, menuItems: customMenuItems }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
        if (hackathonUser.team && hackathonUser.team.teamName) {
          setTeamName(hackathonUser.team.teamName);
        } else {
          const response = await userAPI.getTeamInfo();
          setTeamName(response.data?.team?.name || '');
        }
      } catch (error) {
        // ignore
      }
    };
    fetchTeamName();
  }, []);

  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onSidebarToggle) {
      onSidebarToggle(newCollapsedState);
    }
  };

  const menuItems = customMenuItems || [
    {
      id: 'overview',
      title: 'Overview',
      icon: LayoutDashboard,
      description: 'Dashboard Overview'
    },
    {
      id: 'projectTheme',
      title: 'Project Theme',
      icon: Layers,
      description: 'Select Challenge Theme'
    },
    {
      id: 'problemStatement',
      title: 'Problem Statement',
      icon: BookOpen,
      description: 'Challenge Details'
    },
    {
      id: 'team',
      title: 'Manage Team',
      icon: UserSquare,
      description: 'Team Members'
    },
    {
      id: 'result',
      title: 'Results',
      icon: Award,
      description: 'Competition Results'
    },
    {
      id: 'contact',
      title: 'Help Desk',
      icon: Headset,
      description: 'Support & Help'
    }
  ];

  return (
    <div className={`bg-white border-r border-gray-200 fixed left-0 top-0 ${isCollapsed ? 'w-12 sm:w-16' : 'w-56 sm:w-64'} h-full  flex flex-col overflow-hidden z-10 mt-16 sm:mt-14 transition-all duration-300`}>
      {/* Team Header Section */}
      <div className="p-2 sm:p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              {/* Team Name */}
              <div className="min-w-0">
                <p className="text-md text-black truncate font-bold text-center sm:text-left">{teamName || 'Loading...'}</p>
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
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 sm:p-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            // Use icon from iconMap if id matches, else fallback to item.icon
            const Icon = iconMap[item.id] || item.icon || BookOpen;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id} className="relative">
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all duration-200 group ${isActive
                    ? 'bg-[#0B2A4A] text-white shadow-md'
                    : 'hover:bg-gray-50 text-gray-700 hover:text-[#0B2A4A]'
                  }`}
                >
                  <Icon
                    size={16}
                    className={`flex-shrink-0 sm:w-[18px] sm:h-[18px] ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#0B2A4A]'
                      }`}
                  />
                  {!isCollapsed && (
                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <div className={`font-medium text-xs sm:text-sm truncate ${isActive ? 'text-white' : 'text-gray-900'
                        }`}>
                        {item.title}
                      </div>
                      <div className={`text-xs truncate hidden sm:block ${isActive ? 'text-blue-100' : 'text-gray-500'
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