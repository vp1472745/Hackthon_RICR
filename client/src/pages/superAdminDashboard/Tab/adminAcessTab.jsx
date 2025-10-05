import React, { useState } from 'react';
import AdminRegister from './adminRegister.jsx';
import AdminAccess from "./adminAccess.jsx";

const AdminAcessTab = () => {
  const [activeTab, setActiveTab] = useState('adminRegister');

  return (
    <div className="w-full max-w-3xl mx-auto py-4 sm:py-6 px-3 sm:px-4 lg:px-2">
      {/* Tabs Navigation */}
      <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide">
        <button
          className={`flex-1 sm:flex-none px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-t-lg font-semibold text-sm sm:text-base border-b-2 sm:border-b-2 transition-all duration-150 focus:outline-none whitespace-nowrap ${
            activeTab === 'adminRegister' 
              ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm sm:shadow' 
              : 'border-transparent text-slate-500 bg-slate-100 hover:bg-white hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('adminRegister')}
        >
          Admin Register
        </button>
        <button
          className={`flex-1 sm:flex-none px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-t-lg font-semibold text-sm sm:text-base border-b-2 sm:border-b-2 transition-all duration-150 focus:outline-none whitespace-nowrap ${
            activeTab === 'adminAccess' 
              ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm sm:shadow' 
              : 'border-transparent text-slate-500 bg-slate-100 hover:bg-white hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('adminAccess')}
        >
          Admin Access
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow border border-gray-200 min-h-[400px]">
        {activeTab === 'adminRegister' && <AdminRegister />}
        {activeTab === 'adminAccess' && <AdminAccess />}
      </div>

      {/* Mobile Indicator */}
      <div className="sm:hidden text-center mt-4">
        <div className="flex justify-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${
            activeTab === 'adminRegister' ? 'bg-indigo-600' : 'bg-gray-300'
          }`}></div>
          <div className={`w-2 h-2 rounded-full ${
            activeTab === 'adminAccess' ? 'bg-indigo-600' : 'bg-gray-300'
          }`}></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {activeTab === 'adminRegister' ? 'Admin Register' : 'Admin Access'}
        </p>
      </div>
    </div>
  );
};

export default AdminAcessTab;