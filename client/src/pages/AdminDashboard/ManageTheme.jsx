import React, { useEffect, useState } from 'react';
import { AdminAPI, setGlobalPermissionModalHandler } from '../../configs/api';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiEdit, 
  FiTrash2, 
  FiUsers, 
  FiLayers,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw
} from 'react-icons/fi';

const ManageTheme = () => {
  const [themes, setThemes] = useState([]);
  const [themesLoading, setThemesLoading] = useState(false);
  const [themesError, setThemesError] = useState('');
  const [themeForm, setThemeForm] = useState({ 
    themeName: '', 
    themeShortDescription: '', 
    themeDescription: '' 
  });
  const [themeMsg, setThemeMsg] = useState('');
  const [themeFormLoading, setThemeFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [readMoreModal, setReadMoreModal] = useState({ open: false, title: '', content: '' });
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Register global permission modal handler on mount
  useEffect(() => {
    setGlobalPermissionModalHandler(() => () => setShowPermissionModal(true));
    return () => setGlobalPermissionModalHandler(null);
  }, []);

  useEffect(() => {
    fetchThemes();
    fetchTeams();
  }, [themeMsg]);

  const fetchThemes = () => {
    setThemesLoading(true);
    setThemesError('');
    AdminAPI.getAllThemes()
      .then(res => setThemes(res.data.themes || []))
      .catch(() => setThemesError('Failed to fetch themes'))
      .finally(() => setThemesLoading(false));
  };

  const fetchTeams = () => {
    AdminAPI.teamsWithMembers()
      .then(res => setAllTeams(res.data.teams || []))
      .catch(() => setAllTeams([]));
  };

  const handleThemeInput = (e) => {
    setThemeForm({ ...themeForm, [e.target.name]: e.target.value });
  };

  const handleThemeSubmit = async (e) => {
    e.preventDefault();
    setThemeFormLoading(true);
    setThemeMsg('');
    try {
      await AdminAPI.createTheme(themeForm);
      setThemeMsg('Theme created successfully!');
      setThemeForm({ themeName: '', themeShortDescription: '', themeDescription: '' });
      setShowCreateForm(false);
    } catch (err) {
      setThemeMsg(err.response?.data?.message || 'Failed to create theme');
    } finally {
      setThemeFormLoading(false);
    }
  };

  const handleDeleteTheme = async (themeId) => {
    if (window.confirm('Are you sure you want to delete this theme?')) {
      try {
        await AdminAPI.deleteTheme(themeId);
        setThemeMsg('Theme deleted successfully!');
        fetchThemes();
      } catch (err) {
        setThemeMsg('Failed to delete theme');
      }
    }
  };

  // Filtered themes by search
  const filteredThemes = themes.filter(theme => {
    const lower = searchTerm.toLowerCase();
    return (
      theme.themeName?.toLowerCase().includes(lower) ||
      theme.themeShortDescription?.toLowerCase().includes(lower) ||
      theme.themeDescription?.toLowerCase().includes(lower)
    );
  });

  // Fetch members for a theme from local teams data
  const handleShowMembers = (themeId) => {
    setShowMembersModal(true);
    // Filter teams by themeId
    const teamsForTheme = allTeams.filter(team => team.teamTheme && team.teamTheme._id === themeId);
    // Flatten all members from all teams for this theme
    const allMembers = teamsForTheme.flatMap(team =>
      (team.members || []).map(member => ({
        ...member,
        teamName: team.teamName
      }))
    );
    setMembers(allMembers);
  };

  // Stats
  const totalThemes = themes.length;
  const totalTeams = themes.reduce((acc, t) => acc + (t.teamCount || 0), 0);
  const activeThemes = themes.filter(t => t.teamCount > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
              Theme Management
            </h1>
            <p className="text-gray-600 text-lg">Create and manage hackathon themes for teams</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 text-center hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiLayers className="text-blue-600 text-xl" />
              </div>
              <div className="text-2xl font-bold text-blue-900">{totalThemes}</div>
              <div className="text-sm text-gray-600 font-medium">Total Themes</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 text-center hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUsers className="text-green-600 text-xl" />
              </div>
              <div className="text-2xl font-bold text-green-600">{totalTeams}</div>
              <div className="text-sm text-gray-600 font-medium">Teams Enrolled</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 text-center hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCheckCircle className="text-purple-600 text-xl" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{activeThemes}</div>
              <div className="text-sm text-gray-600 font-medium">Active Themes</div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search themes by name, short description, or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchThemes}
              className="px-6 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 shadow-sm"
            >
              <FiRefreshCw className={themesLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 shadow-md"
            >
              <FiPlus />
              Create Theme
            </button>
          </div>
        </div>

        {/* Create Theme Form */}
        {showCreateForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FiPlus className="text-blue-600" />
                Create New Theme
              </h3>
            </div>
            <form onSubmit={handleThemeSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Theme Name *</label>
                  <input
                    type="text"
                    name="themeName"
                    value={themeForm.themeName}
                    onChange={handleThemeInput}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter theme name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Short Description *</label>
                  <input
                    type="text"
                    name="themeShortDescription"
                    value={themeForm.themeShortDescription}
                    onChange={handleThemeInput}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Brief description"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Team Count</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                    placeholder="Auto-calculated"
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Full Description *</label>
                <textarea
                  name="themeDescription"
                  value={themeForm.themeDescription}
                  onChange={handleThemeInput}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={4}
                  placeholder="Detailed description of the theme..."
                  required
                />
              </div>

              {/* Message Display */}
              {themeMsg && (
                <div className={`flex items-center gap-3 p-4 rounded-xl ${
                  themeMsg.includes('success') 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {themeMsg.includes('success') ? <FiCheckCircle /> : <FiAlertCircle />}
                  <span className="text-sm font-medium">{themeMsg}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={themeFormLoading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {themeFormLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Theme...
                    </>
                  ) : (
                    <>
                      <FiPlus />
                      Create Theme
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Themes Grid */}
        {themesLoading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-700">Loading Themes</h3>
            <p className="text-gray-500">Please wait while we fetch your themes...</p>
          </div>
        ) : themesError ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="text-red-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-red-700 mb-2">Failed to Load Themes</h3>
            <p className="text-red-600 mb-4">{themesError}</p>
            <button
              onClick={fetchThemes}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        ) : filteredThemes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-blue-50">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎨</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No themes found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm ? 'No themes match your search criteria. Try adjusting your search terms.' : 'Get started by creating your first theme for the hackathon.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <FiPlus />
                Create Your First Theme
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredThemes.map((theme, idx) => (
              <div
                key={theme._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 hover:transform hover:-translate-y-2 group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600"></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors duration-200 line-clamp-1">
                      {theme.themeName}
                    </h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit theme"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTheme(theme._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete theme"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4 space-y-1">
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Theme Name</span>
                      <span className="text-gray-800 font-semibold text-base">{theme.themeName}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Short Description</span>
                      <span className="text-gray-700 font-medium text-sm">
                        {(theme.themeShortDescription || '').length > 60
                          ? <>
                              {(theme.themeShortDescription || '').slice(0, 60)}...{' '}
                              <button
                                className="text-blue-600 underline text-xs ml-1"
                                onClick={() => setReadMoreModal({ open: true, title: 'Short Description', content: theme.themeShortDescription || '' })}
                              >Read More</button>
                            </>
                          : (theme.themeShortDescription || '')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</span>
                      <span className="text-gray-600 text-sm leading-relaxed">
                        {(theme.themeDescription || '').length > 80
                          ? <>
                              {(theme.themeDescription || '').slice(0, 80)}...{' '}
                              <button
                                className="text-blue-600 underline text-xs ml-1"
                                onClick={() => setReadMoreModal({ open: true, title: 'Description', content: theme.themeDescription || '' })}
                              >Read More</button>
                            </>
                          : (theme.themeDescription || '')}
                      </span>
                    </div>
        {/* Read More Modal */}
        {readMoreModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn border border-blue-100">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-blue-700 text-2xl font-bold focus:outline-none"
                onClick={() => setReadMoreModal({ open: false, title: '', content: '' })}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold text-blue-900 mb-4">{readMoreModal.title}</h3>
              <div className="text-gray-700 whitespace-pre-line text-base" style={{wordBreak:'break-word'}}>
                {readMoreModal.content}
              </div>
            </div>
          </div>
        )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleShowMembers(theme._id)}>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition">
                        <FiUsers className="text-green-600 text-sm" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition">{theme.teamCount || 0}</div>
                        <div className="text-xs text-gray-500">Teams</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      (theme.teamCount || 0) > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {(theme.teamCount || 0) > 0 ? 'Active' : 'No Teams'}
                    </div>
                  </div>

                  {/* Members Modal */}
                  {showMembersModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fadeIn border border-blue-100">
                        <button
                          className="absolute top-4 right-4 text-gray-400 hover:text-blue-700 text-2xl font-bold focus:outline-none"
                          onClick={() => setShowMembersModal(false)}
                          aria-label="Close"
                        >
                          &times;
                        </button>
                        <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                          <FiUsers className="text-blue-600" /> Theme Members
                        </h3>
                        <div className="max-h-96 overflow-y-auto pr-2">
                          {members.length === 0 ? (
                            <div className="text-gray-500 text-center py-8">No members found for this theme.</div>
                          ) : (
                            <table className="min-w-full border text-sm">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border px-2 py-1">Name</th>
                                  <th className="border px-2 py-1">Role</th>
                                  <th className="border px-2 py-1">Email</th>
                                  <th className="border px-2 py-1">Phone</th>
                                  <th className="border px-2 py-1">Team</th>
                                </tr>
                              </thead>
                              <tbody>
                                {members.map((member, idx) => (
                                  <tr key={member._id || idx}>
                                    <td className="border px-2 py-1 font-semibold">{member.fullName}</td>
                                    <td className="border px-2 py-1">{member.role}</td>
                                    <td className="border px-2 py-1">{member.email}</td>
                                    <td className="border px-2 py-1">{member.phone || '-'}</td>
                                    <td className="border px-2 py-1">{member.teamName || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredThemes.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Showing {filteredThemes.length} of {themes.length} themes
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center max-w-xs">
            <h2 className="text-lg font-bold text-red-600 mb-2">Super Permission Not Allowed</h2>
            <p className="mb-4 text-gray-700">You do not have permission to perform this action. Please contact the superadmin.</p>
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold"
              onClick={() => setShowPermissionModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTheme;