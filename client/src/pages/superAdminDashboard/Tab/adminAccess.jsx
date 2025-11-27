import React, { useState, useEffect } from 'react';
import { subAdminAPI } from '../../../configs/api';

const ALL_PERMISSIONS = [
  // Tab Access Permissions
  { key: 'viewOverview', label: 'View Overview Tab', category: 'Dashboard Tabs' },
  { key: 'manageTeams', label: 'Access Team Management', category: 'Dashboard Tabs' },
  { key: 'manageThemes', label: 'Access Theme Management', category: 'Dashboard Tabs' },
  { key: 'manageResults', label: 'Access Result Management', category: 'Dashboard Tabs' },
  { key: 'manageProblemStatements', label: 'Access Problem Statement Management', category: 'Dashboard Tabs' },
  { key: 'manageAccomodations', label: 'Access Accommodation Management', category: 'Dashboard Tabs' },

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
  { key: 'viewResults', label: 'View Results', category: 'Results' },
  { key: 'createResult', label: 'Create/Add Result', category: 'Results' },
  { key: 'editResult', label: 'Edit Result', category: 'Results' },
  { key: 'deleteResult', label: 'Delete Individual Result', category: 'Results' },
  { key: 'downloadResultTemplate', label: 'Download Result Template', category: 'Results' },
  { key: 'downloadResults', label: 'Download Results Excel', category: 'Results' },
  { key: 'uploadResults', label: 'Upload Results Excel', category: 'Results' },
  { key: 'deleteAllResults', label: 'Delete All Results (Bulk)', category: 'Results' },
  { key: 'declareAllResults', label: 'Declare All Results', category: 'Results' },
  { key: 'viewResultStatistics', label: 'View Result Statistics', category: 'Results' },
  { key: 'searchSortResults', label: 'Search & Sort Results', category: 'Results' },

//Permission for PaymentManager features
  { key: 'viewPayments', label: 'View Payments Tab', category: 'Payments' },
  { key: 'viewPaymentDetails', label: 'View Payment Details', category: 'Payments' },
  { key: 'reviewPayments', label: 'Open Review Modal', category: 'Payments' },
  { key: 'verifyPayments', label: 'Verify Payments', category: 'Payments' },
  { key: 'rejectPayments', label: 'Reject Payments', category: 'Payments' },
  { key: 'seePaymentStats', label: 'View Payment Stats', category: 'Payments' },

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
      console.log('Assigning permissions:', { email, selected });
      const setRes = await subAdminAPI.setAdminPermissions(email, selected);
      console.log('Set permissions response:', setRes.data);
      setMsg('Permissions updated successfully');

      // Refresh the permissions for this admin
      const refreshed = await fetchAdminPermissions(email);
      console.log('Refreshed permissions for', email, ':', refreshed);

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
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Access Management</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage permissions and access levels for administrators
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 mb-6 md:mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('assign')}
                className={`flex-1 sm:flex-none py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm border-b-2 transition-colors ${activeTab === 'assign'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Assign Permissions
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`flex-1 sm:flex-none py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm border-b-2 transition-colors ${activeTab === 'view'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                View Admins
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'assign' && (
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {/* Email Selection */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Select Administrator</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Admin Email
                      </label>
                      <input
                        type="text"
                        placeholder="Search admins..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Email
                      </label>
                      <select
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm sm:text-base"
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
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Assign Permissions</h3>
                  <div className="space-y-4 sm:space-y-6">
                    {Object.entries(groupedPermissions).map(([category, perms]) => (
                      <div key={category} className="border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{category}</h4>
                          <button
                            type="button"
                            onClick={() => handleSelectAll(category)}
                            className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-500 font-medium whitespace-nowrap"
                          >
                            {perms.every(p => selected.includes(p.key)) ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                        <div className="p-3 sm:p-4 grid grid-cols-1 gap-2 sm:gap-3">
                          {perms.map((perm) => (
                            <label
                              key={perm.key}
                              className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selected.includes(perm.key)}
                                onChange={() => handleCheckbox(perm.key)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded flex-shrink-0"
                              />
                              <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-700 break-words">
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
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="whitespace-nowrap">Saving Permissions...</span>
                      </>
                    ) : (
                      'Save Permissions'
                    )}
                  </button>
                </div>

                {/* Messages */}
                <div className="space-y-2">
                  {msg && (
                    <div className="p-3 sm:p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-800 font-medium text-sm sm:text-base">{msg}</span>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="p-3 sm:p-4 rounded-lg bg-red-50 border border-red-200">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-800 font-medium text-sm sm:text-base">{error}</span>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            )}

            {activeTab === 'view' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">Administrators</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search admins..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full sm:w-64 pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    />
                    <svg className="absolute left-2 sm:left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-1 divide-y divide-gray-200">
                    {filteredAdmins.map((admin) => (
                      <div key={admin._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-indigo-600 font-semibold text-sm sm:text-base">
                                {admin.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                {admin.email}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-500">
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
                            className="text-indigo-600 hover:text-indigo-500 font-medium text-xs sm:text-sm whitespace-nowrap ml-2 sm:ml-4"
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