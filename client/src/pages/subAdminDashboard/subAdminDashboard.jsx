import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/subSidebar.jsx';
import Overview from './Tab/subOverViewTab.jsx';
import TeamManageTab from './Tab/subTeamManageTab.jsx';
import ThemeManageTab from './Tab/subThemeManageTab.jsx';
import ResultManageTab from './Tab/subResultManageTab.jsx';
import PsManageTab from './Tab/subPSManageTab.jsx';
import Accomodation from './Tab/subAccomodation.jsx';
import PaymentManager from './Tab/subPaymentManagerTab.jsx';
import { usePermissions } from '../../hooks/usePermissions.js';

const Home = ({ onTabChange }) => <div><Overview onTabChange={onTabChange} /></div>;
const Team = () => <div><TeamManageTab /></div>;
const Theme = () => <div><ThemeManageTab /></div>;
const Result = () => <div><ResultManageTab /></div>;
const Ps = () => <div><PsManageTab /></div>;
const AdminAccess = () => <div>Admin Access Tab</div>;
const AccomodationTab = () => <div><Accomodation /></div>;  
const LoggedOut = () => <div className="p-8">You are logged out.</div>;

export default function AdminDashboard() {
  // initial active tab should match NAV_ITEMS keys (case-sensitive)
  const [activeTab, setActiveTab] = useState('Home');
  const { hasPermission, loading } = usePermissions();

  // Tab to permission mapping
  const TAB_PERMISSIONS = {
    'Home': 'viewOverview',
    'Team': 'manageTeams', 
    'Theme': 'manageThemes',
    'Result': 'manageResults',
    'Ps': 'manageProblemStatements',
    'Accomodation': 'manageAccomodations',
    'Payment': 'viewPayments'
  };

  // Find first available tab based on permissions
  const getDefaultTab = () => {
    const tabs = ['Home', 'Team', 'Theme', 'Result', 'Ps'];
    for (const tab of tabs) {
      if (hasPermission(TAB_PERMISSIONS[tab])) {
        return tab;
      }
    }
    return 'Home'; // fallback
  };

  // Security check: redirect to authorized tab if current tab is not permitted
  useEffect(() => {
    if (!loading && activeTab !== 'logout') {
      const requiredPermission = TAB_PERMISSIONS[activeTab];
      if (requiredPermission && !hasPermission(requiredPermission)) {
        const defaultTab = getDefaultTab();
        setActiveTab(defaultTab);
      }
    }
  }, [activeTab, hasPermission, loading]);

  // Handle tab change with permission check
  const handleTabChange = (newTab) => {
    if (newTab === 'logout') {
      setActiveTab(newTab);
      return;
    }

    const requiredPermission = TAB_PERMISSIONS[newTab];
    if (!requiredPermission || hasPermission(requiredPermission)) {
      setActiveTab(newTab);
    }
  };

  // Show loading state while permissions are being fetched
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  let content;
  if (activeTab === 'Home' && hasPermission('viewOverview')) {
    content = <Home onTabChange={handleTabChange} />;
  } else if (activeTab === 'Team' && hasPermission('manageTeams')) {
    content = <Team />;
  } else if (activeTab === 'Theme' && hasPermission('manageThemes')) {
    content = <Theme />;
  } else if (activeTab === 'Result' && hasPermission('manageResults')) {
    content = <Result />;
  } else if (activeTab === 'Ps' && hasPermission('manageProblemStatements')) {
    content = <Ps />;
  } else if (activeTab === 'Accomodation' && hasPermission('manageAccomodations')) {
    content = <AccomodationTab />;
  } else if (activeTab === 'Payment' && hasPermission('viewPayments')) {
    content = <PaymentManager />;
  } else if (activeTab === 'logout') {
    content = <LoggedOut />;
  } else {
    // No permission for current tab - show access denied
    content = (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">You don't have permission to access this section.</p>
          <button 
            onClick={() => handleTabChange(getDefaultTab())}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex'>
      <Sidebar onTabChange={handleTabChange} activeTab={activeTab} />
      {/* use CSS variable set by Sidebar to control left margin responsively */}
      <main
        className='flex-1 p-6'
        style={{ marginLeft: 'var(--sidebar-width, 16rem)', transition: 'margin-left 200ms' }}
      >
        {content}
      </main>
    </div>
  );
}