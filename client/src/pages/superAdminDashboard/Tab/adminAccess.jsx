import React, { useState, useEffect } from 'react';
import { subAdminAPI } from '../../../configs/api';

const ALL_PERMISSIONS = [
  // Tab Access Permissions
  { key: 'viewOverview', label: 'View Overview Tab', category: 'Dashboard Tabs' },
  { key: 'manageTeams', label: 'Access Team Management', category: 'Dashboard Tabs' },
  { key: 'manageThemes', label: 'Access Theme Management', category: 'Dashboard Tabs' },
  { key: 'manageResults', label: 'Access Result Management', category: 'Dashboard Tabs' },
  { key: 'manageProblemStatements', label: 'Access Problem Statement Management', category: 'Dashboard Tabs' },

  // User & Team Permissions
  { key: 'viewUsers', label: 'View Users', category: 'Overview' },
  { key: 'viewTeams', label: 'View Teams', category: 'Overview' },
  { key: 'viewThemes', label: 'View Themes', category: 'Overview' },
  { key: 'viewProblemStatements', label: 'View Problem Statements', category: 'Overview' },
  // { key: 'manageTeamMembers', label: 'Manage Team Members', category: 'Users & Teams' },




  // Theme Permissions
  { key: 'createTheme', label: 'Create Theme', category: 'Themes' },
  { key: 'editTheme', label: 'Edit Theme', category: 'Themes' },
  { key: 'deleteTheme', label: 'Delete Theme', category: 'Themes' },


  // Problem Statement Permissions
  { key: 'createProblemStatement', label: 'Create Problem Statement', category: 'Problem Statements' },
  { key: 'editProblemStatement', label: 'Edit Problem Statement', category: 'Problem Statements' },
  { key: 'deleteProblemStatement', label: 'Delete Problem Statement', category: 'Problem Statements' },




  // Result Management Permissions
  // { key: 'viewResults', label: 'View Results', category: 'Results' },
  // { key: 'editResults', label: 'Edit Results', category: 'Results' },
  // { key: 'publishResults', label: 'Publish Results', category: 'Results' },
];

const AdminAccess = () => {
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('assign');

  // Group permissions by category
  const groupedPermissions = ALL_PERMISSIONS.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {});

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await subAdminAPI.getAllAdmins();
        let adminsList = [];

        if (response.data && response.data.admins) {
          adminsList = response.data.admins;
        } else if (Array.isArray(response.data)) {
          adminsList = response.data;
        }

        setAdmins(adminsList);

        // Fetch permissions for each admin
        adminsList.forEach(admin => {
          fetchAdminPermissions(admin.email);
        });
      } catch (err) {
        console.error('Error fetching admins:', err);
      }
    };
    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter(admin =>
    admin.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckbox = (perm) => {
    if (selected.includes(perm)) {
      setSelected(selected.filter(p => p !== perm));
    } else {
      setSelected([...selected, perm]);
    }
  };

  const handleSelectAll = (category) => {
    const categoryPerms = groupedPermissions[category].map(p => p.key);
    const allSelected = categoryPerms.every(perm => selected.includes(perm));

    if (allSelected) {
      setSelected(selected.filter(perm => !categoryPerms.includes(perm)));
    } else {
      const newSelected = [...selected];
      categoryPerms.forEach(perm => {
        if (!newSelected.includes(perm)) {
          newSelected.push(perm);
        }
      });
      setSelected(newSelected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');
    try {
      await subAdminAPI.setAdminPermissions(email, selected);
      setMsg('Permissions updated successfully');

      // Refresh the permissions for this admin
      await fetchAdminPermissions(email);

      setEmail('');
      setSelected([]);
    } catch (err) {
      console.error('Error setting permissions:', err);
      setError(err.response?.data?.message || 'Failed to set permissions');
    }
    setLoading(false);
  };

  const [adminPermissions, setAdminPermissions] = useState({});

  const fetchAdminPermissions = async (adminEmail) => {
    try {
      const response = await subAdminAPI.getAdminPermissions(adminEmail);
      const permissions = response.data.permissions || [];
      setAdminPermissions(prev => ({
        ...prev,
        [adminEmail]: permissions
      }));
      return permissions;
    } catch (err) {
      console.error('Error fetching admin permissions:', err);
      return [];
    }
  };

  const getAdminPermissions = (adminEmail) => {
    return adminPermissions[adminEmail] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Access Management</h1>
          <p className="text-gray-600 mt-2">Manage permissions and access levels for administrators</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('assign')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === 'assign'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Assign Permissions
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === 'view'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                View Admins
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'assign' && (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email Selection */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Administrator</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Admin Email
                      </label>
                      <input
                        type="text"
                        placeholder="Search admins..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Email
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      >
                        <option value="">Choose an administrator...</option>
                        {filteredAdmins.map((admin) => (
                          <option key={admin._id} value={admin.email}>
                            {admin.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Permissions</h3>
                  <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([category, perms]) => (
                      <div key={category} className="border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                          <h4 className="font-semibold text-gray-900">{category}</h4>
                          <button
                            type="button"
                            onClick={() => handleSelectAll(category)}
                            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                          >
                            {perms.every(p => selected.includes(p.key)) ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {perms.map((perm) => (
                            <label
                              key={perm.key}
                              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selected.includes(perm.key)}
                                onChange={() => handleCheckbox(perm.key)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <span className="ml-3 text-sm font-medium text-gray-700">
                                {perm.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving Permissions...
                      </>
                    ) : (
                      'Save Permissions'
                    )}
                  </button>
                </div>

                {/* Messages */}
                <div className="space-y-2">
                  {msg && (
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-800 font-medium">{msg}</span>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-800 font-medium">{error}</span>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            )}

            {activeTab === 'view' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Administrators</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search admins..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-1 divide-y divide-gray-200">
                    {filteredAdmins.map((admin) => (
                      <div key={admin._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold">
                                {admin.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{admin.email}</h4>
                              <p className="text-sm text-gray-500">
                                {getAdminPermissions(admin.email).length} permissions assigned
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setEmail(admin.email);
                              setSelected(getAdminPermissions(admin.email));
                              setActiveTab('assign');
                            }}
                            className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
                          >
                            Edit Permissions
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccess;