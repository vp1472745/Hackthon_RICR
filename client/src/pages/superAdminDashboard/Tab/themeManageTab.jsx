import React, { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiUsers, FiX, FiAward, FiFilter, FiDownload, FiUpload } from 'react-icons/fi';
import { AdminAPI, projectThemeAPI } from '../../../configs/api.js';
import AddTheme from './addTheme.jsx';
import EditTheme from './modals/editTheme.jsx';
import DeleteTheme from './modals/deleteTheme.jsx';
import { toast } from 'react-hot-toast';

// Reusable Modal Component
const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className={`bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100 mx-2 sm:mx-4`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <div className="p-1 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg">
              <FiAward className="text-white w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </div>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 lg:p-3 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200 text-gray-500 hover:text-gray-700 transform hover:scale-110 hover:rotate-90"
          >
            <FiX size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
        <div className="p-3 sm:p-4 lg:p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};

// Enhanced Card Component
const ThemeCard = ({ theme, index, onEdit, onDelete, onViewTeams, onViewDescription }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getGradient = (index) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-blue-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div
      className="group relative bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-xl sm:hover:shadow-2xl border border-gray-100/80 transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(index)} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-r ${getGradient(index)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
        <div className="absolute inset-[1px] sm:inset-[2px] rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white"></div>
      </div>

      {/* Theme Header */}
      <div className={`relative p-3 sm:p-4 lg:p-6 bg-gradient-to-r ${getGradient(index)} text-white overflow-hidden`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 bg-white rounded-full -translate-y-4 translate-x-4 sm:-translate-y-8 sm:translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-white rounded-full translate-y-4 -translate-x-4 sm:translate-y-8 sm:-translate-x-8"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-lg border border-white/30">
              {theme.themeName.charAt(0).toUpperCase()}
            </div>
            <div className="flex gap-1 sm:gap-2 transition-all duration-300 opacity-100 translate-x-0">
              <button
                onClick={() => onEdit(theme)}
                className="p-1 sm:p-2 lg:p-3 bg-white/20 hover:bg-white/30 text-white rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm hover:scale-110 shadow-lg border border-white/30"
                title="Edit theme"
              >
                <FiEdit2 size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              </button>
              <button
                onClick={() => onDelete(theme)}
                className="p-1 sm:p-2 lg:p-3 bg-white/20 hover:bg-red-500 text-white rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm hover:scale-110 shadow-lg border border-white/30"
                title="Delete theme"
              >
                <FiTrash2 size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
          </div>

          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2 leading-tight">
            {theme.themeName}
          </h3>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
            <span className="text-white/90 text-xs sm:text-sm">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Theme Content */}
      <div className="relative p-3 sm:p-4 lg:p-6">
        {/* Short Description */}
        <div className="mb-2 sm:mb-3 lg:mb-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 lg:mb-3">
            <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiAward className="w-2 h-2 sm:w-3 sm:h-3 text-blue-600" />
            </div>
            <span className="text-gray-700 font-semibold text-xs sm:text-sm">Short Description</span>
          </div>
          <div className="flex items-start gap-1 sm:gap-2 lg:gap-3">
            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm flex-1 line-clamp-2">
              {theme.themeShortDescription}
            </p>
            <button
              onClick={() => onViewDescription({ ...theme, _descType: 'short' })}
              className="text-blue-600 hover:text-blue-700 font-medium text-xs transition-all duration-200 px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 lg:py-2 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 hover:scale-105 flex items-center gap-1 whitespace-nowrap flex-shrink-0"
            >
              Read More
            </button>
          </div>
        </div>

        {/* Full Description */}
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 lg:mb-3">
            <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiAward className="w-2 h-2 sm:w-3 sm:h-3 text-purple-600" />
            </div>
            <span className="text-gray-700 font-semibold text-xs sm:text-sm">Description</span>
          </div>
          <div className="flex items-start gap-1 sm:gap-2 lg:gap-3">
            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm flex-1 line-clamp-3">
              {theme.themeDescription}
            </p>
            <button
              onClick={() => onViewDescription(theme)}
              className="text-purple-600 hover:text-purple-700 font-medium text-xs transition-all duration-200 px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 lg:py-2 rounded-lg border border-purple-100 bg-purple-50 hover:bg-purple-100 hover:scale-105 flex items-center gap-1 whitespace-nowrap flex-shrink-0"
            >
              Read More
            </button>
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-2 sm:pt-3 lg:pt-4 border-t border-gray-100">
          <button
            onClick={() => onViewTeams(theme)}
            className="flex items-center gap-1 sm:gap-2 lg:gap-3 text-gray-700 hover:text-blue-600 transition-all duration-300 group/btn hover:scale-105"
          >
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center group-hover/btn:from-blue-200 group-hover/btn:to-blue-300 transition-all duration-300 shadow-md">
                <FiUsers className="text-blue-600 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              </div>
              {theme.teamCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg">
                  {theme.teamCount}
                </div>
              )}
            </div>
            <div className="text-left">
              <div className="font-bold text-sm sm:text-base lg:text-lg">{theme.teamCount || 0}</div>
              <div className="text-xs text-gray-500">Enrolled Teams</div>
            </div>
          </button>

          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-end sm:items-center">
            {/* Theme Status Badge */}
            <div className={`px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-4 lg:py-2 rounded-full text-xs font-semibold shadow-md transition-all duration-300 ${
              theme.status === 'active'
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 rounded-full ${theme.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {theme.status === 'active' ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            {/* Team Enrollment Badge */}
            {(theme.teamCount || 0) > 0 && (
              <div className="px-1.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200">
                {theme.teamCount} Team{theme.teamCount > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ThemeManageTab = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [descModalOpen, setDescModalOpen] = useState(false);
  const [teamsModalOpen, setTeamsModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const res = await projectThemeAPI.getAllThemesAdmin();
      setThemes(res.data.themes || []);
    } catch (err) {
      console.error('Error fetching themes:', err);
      setError(err.response?.data?.message || 'Failed to load themes');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateAll = async () => {
   
    
    setActionLoading(true);
    try {
      const response = await projectThemeAPI.activateAllThemes();
      toast.success(`Success! ${response.data.modifiedCount} themes activated.`);
      fetchThemes();
    } catch (err) {
      console.error('Error activating themes:', err);
      toast.error('Failed to activate themes. Please try again.');
    }
    setActionLoading(false);
  };

  const handleDeactivateAll = async () => {
   
    
    setActionLoading(true);
    try {
      const response = await projectThemeAPI.deactivateAllThemes();
      toast.success(`Success! ${response.data.modifiedCount} themes deactivated.`);
      fetchThemes();
    } catch (err) {
      console.error('Error deactivating themes:', err);
      toast.error('Failed to deactivate themes. Please try again.');
    }
    setActionLoading(false);
  };

  const filteredThemes = themes
    .filter(theme => {
      const matchesSearch = theme.themeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.themeDescription?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filter === 'all' ||
        (filter === 'active' && (theme.teamCount || 0) > 0) ||
        (filter === 'available' && (theme.teamCount || 0) === 0);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.themeName.localeCompare(b.themeName);
        case 'teams':
          return (b.teamCount || 0) - (a.teamCount || 0);
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const handleDeleteTheme = (theme) => {
    if (!theme || !theme._id) {
      console.error('handleDeleteTheme: theme object is missing or invalid:', theme);
    }
    setSelectedTheme(theme);
    setDeleteModalOpen(true);
  };

  const stats = {
    total: themes.length,
    active: themes.filter(t => (t.teamCount || 0) > 0).length,
    available: themes.filter(t => (t.teamCount || 0) === 0).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Loading themes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 lg:mb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Theme Management
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm lg:text-base">Create and organize project themes for teams</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-center sm:justify-start">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4 shadow-lg border border-gray-100/80 min-w-[70px] sm:min-w-[80px] lg:min-w-[100px]">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-gray-600 text-xs">Total Themes</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4 shadow-lg border border-gray-100/80 min-w-[70px] sm:min-w-[80px] lg:min-w-[100px]">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-gray-600 text-xs">Active Themes</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4 shadow-lg border border-gray-100/80 min-w-[70px] sm:min-w-[80px] lg:min-w-[100px]">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{stats.available}</div>
                <div className="text-gray-600 text-xs">Available Themes</div>
              </div>
            </div>
          </div>

          {/* Search and Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
            {/* Search Bar */}
            <div className="relative group flex-1">
              <FiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-colors group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search themes..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 lg:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 lg:py-4 border border-gray-300 rounded-lg sm:rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
              />
            </div>

            {/* Action Buttons Container */}
            <div className="flex flex-wrap gap-1 sm:gap-2 lg:gap-3">
              {/* Add Theme Button */}
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1 sm:gap-2 lg:gap-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg sm:rounded-xl lg:rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group flex-1 sm:flex-none justify-center min-w-[120px] sm:min-w-[140px]"
              >
                <FiPlus className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-xs sm:text-sm lg:text-base">Add Theme</span>
              </button>

              {/* Activate All Button */}
              <button
                onClick={handleActivateAll}
                disabled={actionLoading}
                className="flex items-center gap-1 sm:gap-2 lg:gap-3 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg sm:rounded-xl lg:rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group flex-1 sm:flex-none justify-center min-w-[120px] sm:min-w-[140px]"
              >
                <FiUpload className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-xs sm:text-sm lg:text-base whitespace-nowrap">{actionLoading ? 'Processing...' : 'Activate All'}</span>
              </button>

              {/* Deactivate All Button */}
              <button
                onClick={handleDeactivateAll}
                disabled={actionLoading}
                className="flex items-center gap-1 sm:gap-2 lg:gap-3 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg sm:rounded-xl lg:rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group flex-1 sm:flex-none justify-center min-w-[120px] sm:min-w-[140px]"
              >
                <FiDownload className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-xs sm:text-sm lg:text-base whitespace-nowrap">{actionLoading ? 'Processing...' : 'Deactivate All'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Theme Modal */}
        <Modal
          open={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="Create New Theme"
          size="lg"
        >
          <AddTheme onThemeCreated={() => { setShowAddForm(false); fetchThemes(); }} />
        </Modal>

        {/* Themes Grid */}
        {filteredThemes.length === 0 ? (
          <div className="text-center py-8 sm:py-12 lg:py-20 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 border-dashed border-gray-300 shadow-lg lg:shadow-xl">
            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 shadow-inner">
              <FiAward className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700 mb-1 sm:mb-2 lg:mb-3">No Themes Found</h3>
            <p className="text-gray-500 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 lg:mb-8 max-w-md mx-auto px-3 sm:px-4">
              {searchTerm ? 'No themes match your search. Try different keywords.' : 'Start by creating your first project theme to organize teams.'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg sm:rounded-xl lg:rounded-2xl font-bold text-xs sm:text-sm lg:text-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              Create Your First Theme
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {filteredThemes.map((theme, index) => (
                <ThemeCard
                  key={theme._id}
                  theme={theme}
                  index={index}
                  onEdit={(theme) => { setSelectedTheme(theme); setEditModalOpen(true); }}
                  onDelete={(theme) => handleDeleteTheme(theme)}
                  onViewTeams={(theme) => { setSelectedTheme(theme); setTeamsModalOpen(true); }}
                  onViewDescription={(theme) => { setSelectedTheme(theme); setDescModalOpen(true); }}
                />
              ))}
            </div>

            {/* Delete Theme Modal */}
            <Modal
              open={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              title={selectedTheme?.themeName ? `Delete Theme: ${selectedTheme.themeName}` : 'Delete Theme'}
              size="md"
            >
              {selectedTheme && (
                <DeleteTheme
                  theme={selectedTheme}
                  onClose={() => setDeleteModalOpen(false)}
                  onThemeDeleted={() => { setDeleteModalOpen(false); fetchThemes(); }}
                />
              )}
            </Modal>

            {/* Edit Theme Modal */}
            <Modal
              open={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              title={selectedTheme?.themeName ? `Edit Theme: ${selectedTheme.themeName}` : 'Edit Theme'}
              size="lg"
            >
              {selectedTheme && (
                <EditTheme
                  theme={selectedTheme}
                  onClose={() => setEditModalOpen(false)}
                  onThemeUpdated={() => { setEditModalOpen(false); fetchThemes(); }}
                />
              )}
            </Modal>

            {/* Results Count */}
            <div className="mt-4 sm:mt-6 lg:mt-8 text-center">
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                Showing <span className="font-semibold text-gray-900">{filteredThemes.length}</span> of <span className="font-semibold text-gray-900">{themes.length}</span> themes
              </p>
            </div>
          </>
        )}

        {/* Description Modal */}
        <Modal
          open={descModalOpen}
          onClose={() => setDescModalOpen(false)}
          title={selectedTheme?.themeName || 'Theme Description'}
          size="lg"
        >
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 lg:mb-3 text-sm sm:text-base lg:text-lg">
                {selectedTheme?._descType === 'short' ? 'Short Description' : 'Full Description'}
              </h4>
              <p className="text-gray-700 leading-relaxed text-xs sm:text-sm lg:text-base">
                {selectedTheme?._descType === 'short'
                  ? selectedTheme?.themeShortDescription
                  : selectedTheme?.themeDescription}
              </p>
            </div>
          </div>
        </Modal>

        {/* Teams Modal */}
        <Modal
          open={teamsModalOpen}
          onClose={() => setTeamsModalOpen(false)}
          title={`${selectedTheme?.themeName} - Enrolled Teams`}
          size="lg"
        >
          {selectedTheme?.enrolledTeams?.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700">
                  {selectedTheme.enrolledTeams.length} team{selectedTheme.enrolledTeams.length === 1 ? '' : 's'} enrolled
                </div>
                <div className="px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
                  Active Theme
                </div>
              </div>

              <div className="max-h-48 sm:max-h-64 lg:max-h-96 overflow-y-auto space-y-2 sm:space-y-3 lg:space-y-4 pr-1 sm:pr-2 custom-scrollbar">
                {selectedTheme.enrolledTeams.map((team, index) => (
                  <div
                    key={team._id}
                    className="flex items-center justify-between p-2 sm:p-3 lg:p-5 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 group hover:shadow-md lg:hover:shadow-lg"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg group-hover:scale-110 transition-transform duration-300 shadow-md lg:shadow-lg">
                        {team.teamName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate text-xs sm:text-sm lg:text-base">{team.teamName}</p>
                        <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 font-mono bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg inline-block">
                          {team.teamCode}
                        </p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 lg:py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-200">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 lg:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4 shadow-inner">
                <FiUsers className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gray-400" />
              </div>
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-700 mb-1 sm:mb-2">No Teams Enrolled</h4>
              <p className="text-gray-500 text-xs sm:text-sm lg:text-base max-w-md mx-auto px-3 sm:px-4">
                Teams will appear here once they select this theme for their project.
              </p>
            </div>
          )}
        </Modal>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ThemeManageTab;