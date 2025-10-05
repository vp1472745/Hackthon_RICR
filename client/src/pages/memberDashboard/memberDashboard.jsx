import React, { useState, useEffect } from 'react';
import SideBar from '../../components/leaderSideBar.jsx';
import Overview from './overView/memberOverview.jsx';
import ProjectTheme from './memberProjectTheme.jsx';
import ProblemStatements from './memberProblemStatements.jsx';
import ManageTeam from './TeamManage/memberManageTeam.jsx';
import HelpDesk from './memberHelpDesk.jsx';
import Result from './memberResult.jsx';
import { userAPI } from '../../configs/api.js';

const LeaderDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser'));
    const userRole = hackathonUser?.user?.role;
    
    console.log('Member Dashboard - User Role:', userRole); // Debug log
    
    // Members should never see profile setup modals - only leaders need profile setup
    if (userRole === 'Member') {
      setShowModal(false); // Members don't need profile setup
      console.log('Member detected - no profile modal will be shown'); // Debug log
    } else if (hackathonUser?.user?.termsAccepted) {
      setShowModal(false); // Skip modal if terms are accepted
    } else {
      setShowModal(true); // Show modal if terms are not accepted (leaders only)
      console.log('Leader detected - profile modal might be shown'); // Debug log
    }
  }, []);

  useEffect(() => {
    const handleSectionChange = (event) => {
      setActiveSection(event.detail);
    };

    window.addEventListener('changeSection', handleSectionChange);

    return () => {
      window.removeEventListener('changeSection', handleSectionChange);
    };
  }, []);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'projectTheme':
        return <ProjectTheme />;
      case 'problemStatement':
        return <ProblemStatements />;
      case 'team':
        return <ManageTeam />;
      case 'result':
        return <Result />;
      case 'contact':
        return <HelpDesk />;
      default:
        return <Overview />;
    }
  };

  // Get current user role for safety checks
  const getCurrentUserRole = () => {
    const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
    return hackathonUser?.user?.role;
  };

  const userRole = getCurrentUserRole();

  // Safety check - if somehow this component is being accessed by a non-member, redirect
  useEffect(() => {
    if (userRole && userRole !== 'Member') {
      console.warn('Non-member trying to access member dashboard, redirecting...');
      window.location.href = '/leader-dashboard';
    }
  }, [userRole]);

  // Don't render anything if user role is not Member
  if (userRole !== 'Member') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Access Restricted</h2>
          <p className="text-gray-600 mt-2">This area is for team members only.</p>
          <p className="text-gray-500 text-sm mt-1">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Sidebar */}
      <SideBar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onSidebarToggle={handleSidebarToggle}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed 
          ? 'ml-12 sm:ml-16' 
          : 'ml-56 sm:ml-64'
      }`}>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="min-h-full">
            {renderActiveComponent()}
          </div>
        </div>
      </div>

      {/* Debug info for members - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm">
          Member Dashboard - Role: {userRole}
        </div>
      )}
    </div>
  );
};

export default LeaderDashboard;