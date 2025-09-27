import React, { useState, useEffect } from 'react';
import MultiStepModal from './pop/MultiStepModal.jsx';
import SideBar from '../../components/sideBar.jsx';
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
    const fetchUserData = async () => {
      try {
        const response = await userAPI.getLeaderProfile();
        if (response.data && response.data.leader) {
          const { termsAccepted } = response.data.leader;
          setShowModal(!termsAccepted); // Show modal if terms are not accepted
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
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
        <div className="flex-1 overflow-auto">
          <div className="min-h-full">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderDashboard;