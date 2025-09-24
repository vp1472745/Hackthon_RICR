import React, { useState } from 'react';
import SideBar from './components/sideBar';
import Overview from './pages/Overview';
import ProjectTheme from './pages/ProjectTheme';
import ProblemStatements from './pages/ProblemStatements';
import ManageTeam from './pages/ManageTeam';
import HelpDesk from './pages/HelpDesk';
import Result from './pages/Result';

const LeaderDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

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