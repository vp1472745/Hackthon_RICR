
import React, { useState, useEffect } from 'react';
import SideBar from './sideBar';
import ManageTheme from './ManageTheme';
import ViewUsers from './ViewUsers';
import ViewTeams from './ViewTeams';
import ProblemStatementsAdmin from './ProblemStatementsAdmin';
import { subAdminAPI } from '../../configs/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('manageTheme');
  const [permissions, setPermissions] = useState([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Fetch admin email from sessionStorage on mount
  useEffect(() => {
    // Clear any localStorage data that might be interfering
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("permissions");
    localStorage.removeItem("adminUser");
    
    const adminUser = sessionStorage.getItem('adminUser');
    if (adminUser) {
      const parsed = JSON.parse(adminUser);
      setAdminEmail(parsed.email);
    }
  }, []);

  // Fetch permissions from backend on mount and poll every 10s
  useEffect(() => {
    let interval;
    const fetchPermissions = async () => {
      if (adminEmail) {
        try {
          const res = await SadminAPI.getAdminPermissions(adminEmail);
          setPermissions(res.data.permissions || []);
        } catch {
          setPermissions([]);
        }
      }
    };
    fetchPermissions();
    if (adminEmail) {
      interval = setInterval(fetchPermissions, 10000);
    }
    return () => interval && clearInterval(interval);
  }, [adminEmail]);


  // Show tabs/features if permission exists (view or create/edit/delete)
  const menuItems = [
    (permissions.includes('viewThemes') || permissions.includes('createTheme') || permissions.includes('editTheme') || permissions.includes('deleteTheme')) && {
      id: 'manageTheme',
      title: 'Manage Theme',
      description: 'Create, Edit, Delete & View Themes'
    },
    permissions.includes('viewUsers') && { id: 'viewUsers', title: 'View Users', description: 'All User Details' },
    permissions.includes('viewTeams') && { id: 'viewTeams', title: 'View Teams', description: 'All Team Details' },
    (permissions.includes('createProblemStatement') || permissions.includes('editProblemStatement') || permissions.includes('deleteProblemStatement') || permissions.includes('viewProblemStatements')) && {
      id: 'problemStatements',
      title: 'Problem Statement',
      description: 'Create, Edit, Delete & View Problems'
    },
  ].filter(Boolean);

  // If no permissions, show message
  if (menuItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2 text-red-600">No Permissions Assigned</h2>
          <p className="text-gray-600">You do not have access to any dashboard features. Please contact the superadmin.</p>
        </div>
      </div>
    );
  }


  // Permission check for each tab
  const hasTabPermission = (tab) => {
    if (tab === 'manageTheme') {
      return permissions.includes('viewThemes') || permissions.includes('createTheme') || permissions.includes('editTheme') || permissions.includes('deleteTheme');
    }
    if (tab === 'viewUsers') {
      return permissions.includes('viewUsers');
    }
    if (tab === 'viewTeams') {
      return permissions.includes('viewTeams');
    }
    if (tab === 'problemStatements') {
      return permissions.includes('createProblemStatement') || permissions.includes('editProblemStatement') || permissions.includes('deleteProblemStatement') || permissions.includes('viewProblemStatements');
    }
    return false;
  };

  // Custom tab click handler
  const handleTabClick = (tab) => {
    if (hasTabPermission(tab)) {
      setActiveTab(tab);
    } else {
      setShowPermissionModal(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar
        activeSection={activeTab}
        setActiveSection={handleTabClick}
        onSidebarToggle={() => {}}
        menuItems={menuItems}
      />
      <main className="flex-1 p-6 ml-12 sm:ml-64">
        {activeTab === 'manageTheme' && hasTabPermission('manageTheme') && <ManageTheme />}
        {activeTab === 'viewUsers' && hasTabPermission('viewUsers') && <ViewUsers />}
        {activeTab === 'viewTeams' && hasTabPermission('viewTeams') && <ViewTeams />}
        {activeTab === 'problemStatements' && hasTabPermission('problemStatements') && <ProblemStatementsAdmin />}
        {/* Permission Modal */}
        {showPermissionModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-8 rounded shadow-lg text-center max-w-xs">
              <h2 className="text-lg font-bold text-red-600 mb-2">Super Permission Not Allowed</h2>
              <p className="mb-4 text-gray-700">You do not have permission to access this feature. Please contact the superadmin.</p>
              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setShowPermissionModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;