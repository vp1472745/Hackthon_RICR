import React, { useState, useEffect } from 'react';
import MultiStepModal from './pop/MultiStepModal.jsx';
import SideBar from '../../components/leaderSideBar.jsx';
import Overview from './overView/Overview.jsx';
import ProjectTheme from './ProjectTheme.jsx';
import ProblemStatements from './ProblemStatements.jsx';
import ManageTeam from './TeamManage/ManageTeam.jsx';
import HelpDesk from './HelpDesk.jsx';
import Result from './Result.jsx';
import { userAPI } from '../../configs/api';

const LeaderDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser'));
    const userRole = hackathonUser?.user?.role;
    
    // Only show modal for Leaders, never for Members or other roles
    if (userRole !== 'Leader') {
      console.log('Leader dashboard modal blocked for non-leader:', userRole);
      setShowModal(false);
      return;
    }
    
    if (hackathonUser?.user?.termsAccepted) {
      setShowModal(false); // Skip modal if terms are accepted
    } else {
      setShowModal(true); // Show modal if terms are not accepted (Leaders only)
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
        {/* Multi-step Modal */}
        {showModal && (
          <MultiStepModal isOpen={true} onClose={() => setShowModal(false)} />
        )}
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="min-h-full">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderDashboard;