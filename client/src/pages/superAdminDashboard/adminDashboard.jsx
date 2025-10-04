import React, { useState } from 'react';
import Sidebar from './superSidebar';
import Overview from './Tab/overViewTab';
import TeamManageTab from './Tab/teamManageTab';
import ThemeManageTab from './Tab/themeManageTab';
import ResultManageTab from './Tab/resultManageTab';
import PsManageTab from './Tab/psManageTab';
import AdminAccessTab from './Tab/adminAcessTab';

const Home = ({ onTabChange }) => <div><Overview onTabChange={onTabChange} /></div>;
const Team = () => <div><TeamManageTab /></div>;
const Theme = () => <div><ThemeManageTab /></div>;
const Result = () => <div><ResultManageTab /></div>;
const Ps = () => <div><PsManageTab /></div>;
const AdminAccess = () => <div><AdminAccessTab /></div>;
const LoggedOut = () => <div className="p-8">You are logged out.</div>;

export default function AdminDashboard() {
  // initial active tab should match NAV_ITEMS keys (case-sensitive)
  const [activeTab, setActiveTab] = useState('Home');

  let content;
  if (activeTab === 'Home') content = <Home onTabChange={setActiveTab} />;
  else if (activeTab === 'Team') content = <Team />;
  else if (activeTab === 'Theme') content = <Theme />;
  else if (activeTab === 'Result') content = <Result />;
  else if (activeTab === 'Ps') content = <Ps />;
  else if (activeTab === 'Admin Access') content = <AdminAccess />;
  else if (activeTab === 'logout') content = <LoggedOut />;

  return (
    <div className='min-h-screen flex'>
      <Sidebar onTabChange={setActiveTab} activeTab={activeTab} />
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
