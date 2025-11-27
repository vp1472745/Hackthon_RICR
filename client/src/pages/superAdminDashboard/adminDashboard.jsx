import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/superSidebar';
import Overview from './Tab/overViewTab';
import TeamManageTab from './Tab/teamManageTab';
import ThemeManageTab from './Tab/themeManageTab';
import ResultManageTab from './Tab/resultManageTab';
import PsManageTab from './Tab/psManageTab';
import AdminAccessTab from './Tab/adminAcessTab';
import AccomodationTab from './Tab/accomodation';
import PaymentManager from './Tab/PaymentManager';
const Home = ({ onTabChange }) => <div><Overview onTabChange={onTabChange} /></div>;
const Team = () => <div><TeamManageTab /></div>;
const Theme = () => <div><ThemeManageTab /></div>;
const Result = () => <div><ResultManageTab /></div>;
const Ps = () => <div><PsManageTab /></div>;
const AdminAccess = () => <div><AdminAccessTab /></div>;
const Payment = () => <div><PaymentManager /></div>;  
const LoggedOut = () => <div className="p-8">You are logged out.</div>;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Home');
  const navigate = useNavigate ? useNavigate() : null;

  // Superadmin authentication check
  React.useEffect(() => {
    const adminUser = sessionStorage.getItem('adminUser');
    let isSuperAdmin = false;
    if (adminUser) {
      try {
        const parsed = JSON.parse(adminUser);
        isSuperAdmin = parsed.role === 'superadmin';
      } catch {}
    }
    if (!isSuperAdmin) {
      setTimeout(() => {
        toast.error('Please login to access the Super Admin dashboard.');
        setTimeout(() => {
          window.location.href = '/adminLogin';
        }, 1800);
      }, 100);
    }
  }, []);

  let content;
  if (activeTab === 'Home') content = <Home onTabChange={setActiveTab} />;
  else if (activeTab === 'Team') content = <Team />;
  else if (activeTab === 'Theme') content = <Theme />;
  else if (activeTab === 'Result') content = <Result />;
  else if (activeTab === 'Ps') content = <Ps />;
  else if (activeTab === 'Admin Access') content = <AdminAccess />;
  else if (activeTab === 'Accomodation') content = <AccomodationTab />;
  else if (activeTab === 'Payment') content = <Payment />;
  else if (activeTab === 'logout') content = <LoggedOut />;

  return (
    <div className='min-h-screen flex'>
      <Sidebar onTabChange={setActiveTab} activeTab={activeTab} />
      <main
        className='flex-1 p-6'
        style={{ marginLeft: 'var(--sidebar-width, 16rem)', transition: 'margin-left 200ms' }}
      >
        {content}
      </main>
    </div>
  );
}
