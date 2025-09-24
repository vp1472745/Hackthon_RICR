import React, { useState } from 'react';
import SideBar from './siderBar.jsx';
import TeamManagement from '../userdashboard/Team/TeamPage.jsx';
import MainPages from './overView/mainPages.jsx';
import Contact from './contact.jsx';
import ProblemStatementCard from './problemStatement.jsx';
import Result from './Result/result.jsx';
const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SideBar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onSidebarToggle={handleSidebarToggle}
      />
      <div className={`fixed top-14 right-0 ${sidebarCollapsed ? 'left-10' : 'left-10'} bottom-0 overflow-y-scroll custom-scrollbar bg-gray-50`}>
        {activeSection === 'overview' && <MainPages />}
        {activeSection === 'problemStatement' && <ProblemStatementCard />}
         
        {activeSection === 'team' && <TeamManagement />}
        {activeSection === 'result' &&      <Result />  }
        {activeSection === 'contact' && <Contact />}

       
      </div>
    </div>
  );
};

export default UserDashboard;