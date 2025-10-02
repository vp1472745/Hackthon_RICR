import React, { useState } from 'react';
import AdminRegister from './adminRegister.jsx';
import AdminAccess from "./adminAccess.jsx";
const AdminAcessTab = () => {
  const [activeTab, setActiveTab] = useState('adminRegister');

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-2">
      <div className="flex gap-2 mb-6">
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold text-base border-b-2 transition-all duration-150 focus:outline-none ${activeTab === 'adminRegister' ? 'border-indigo-600 text-indigo-700 bg-white shadow' : 'border-transparent text-slate-500 bg-slate-100 hover:bg-white'}`}
          onClick={() => setActiveTab('adminRegister')}
        >
          Admin Register
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold text-base border-b-2 transition-all duration-150 focus:outline-none ${activeTab === 'adminAccess' ? 'border-indigo-600 text-indigo-700 bg-white shadow' : 'border-transparent text-slate-500 bg-slate-100 hover:bg-white'}`}
          onClick={() => setActiveTab('adminAccess')}
        >
          Admin Access
        </button>
      </div>

  {activeTab === 'adminRegister' && <AdminRegister />}

  {activeTab === 'adminAccess' && <AdminAccess />}
    </div>
  );
};

export default AdminAcessTab;