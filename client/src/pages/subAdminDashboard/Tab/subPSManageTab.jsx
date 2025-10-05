import React, { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter, FiEye, FiAward, FiUsers, FiX, FiDownload, FiUpload, FiClock, FiTag } from 'react-icons/fi';
import { subAdminAPI } from '../../../configs/api.js';
import DeletePS from './modals/subDeletePS.jsx';
import EditPS from './modals/subEditPS.jsx';
import AddPS from './modals/subAddPS.jsx';
import PermissionWrapper from '../../../components/PermissionWrapper';
import usePermissions from '../../../hooks/usePermissions';

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
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <div className="p-1 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl shadow-lg">
              <FiAward className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 sm:p-3 hover:bg-gray-100 cursor-pointer rounded-lg sm:rounded-xl transition-all duration-200 text-gray-500 hover:text-gray-700 transform hover:scale-110 hover:rotate-90"
          >
            <FiX size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};

// Enhanced Problem Statement Card
const ProblemStatementCard = ({ ps, index, onEdit, onDelete, onView }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getGradient = (index) => {
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-blue-500',
      'from-rose-500 to-pink-500',
      'from-amber-500 to-orange-500'
    ];
    return gradients[index % gradients.length];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'archived': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div
      className="group relative bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-xl sm:hover:shadow-2xl border border-gray-100/80 transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden"
      style={{
        animationDelay: `${index * 100}ms`,
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

      {/* Header Section */}
      <div className={`relative p-4 sm:p-5 lg:p-6 bg-gradient-to-r ${getGradient(index)} text-white overflow-hidden`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 bg-white rounded-full -translate-y-4 translate-x-4 sm:-translate-y-8 sm:translate-x-8 lg:-translate-y-16 lg:translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-white rounded-full translate-y-4 -translate-x-4 sm:translate-y-8 sm:-translate-x-8 lg:translate-y-12 lg:-translate-x-12"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-lg border border-white/30">
              {ps.PStitle?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <div className="flex gap-1 sm:gap-2 transition-all duration-300 opacity-100 translate-x-0">
              <button
                onClick={() => onView(ps)}
                className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm hover:scale-110 shadow-lg border border-white/30"
                title="View details"
              >
                <FiEye size={12} className="sm:w-4 sm:h-4" />
              </button>
              <PermissionWrapper permission="editProblemStatement">
                <button
                  onClick={() => onEdit(ps)}
                  className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm hover:scale-110 shadow-lg border border-white/30"
                  title="Edit problem statement"
                >
                  <FiEdit2 size={12} className="sm:w-4 sm:h-4" />
                </button>
              </PermissionWrapper>

              <PermissionWrapper permission="deleteProblemStatement">
                <button
                  onClick={() => onDelete(ps)}
                  className="p-1.5 sm:p-2 bg-white/20 hover:bg-red-500 text-white rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm hover:scale-110 shadow-lg border border-white/30"
                  title="Delete problem statement"
                >
                  <FiTrash2 size={12} className="sm:w-4 sm:h-4" />
                </button>
              </PermissionWrapper>
            </div>
          </div>

          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2 leading-tight">
            {ps.PStitle}
          </h3>
          <div className="flex items-center gap-1 sm:gap-2 text-white/90">
            <FiClock className="w-3 h-3" />
            <span className="text-xs sm:text-sm">Created {new Date(ps.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative p-4 sm:p-5 lg:p-6">
        {/* Theme Info */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
            <FiTag className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
            <span className="text-gray-700 font-semibold text-xs sm:text-sm">Associated Theme</span>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-purple-200">
            <p className="text-purple-800 font-medium text-xs sm:text-sm">
              {ps.PSTheme?.themeName || ps.PSTheme || 'No theme assigned'}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4 sm:mb-5 lg:mb-6">
          <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
            <FiAward className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
            <span className="text-gray-700 font-semibold text-xs sm:text-sm">Description</span>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-blue-200">
            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm line-clamp-3">
              {ps.PSdescription || 'No description provided'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PsManageTab = ({ teamId }) => {
  const [problemStatements, setProblemStatements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { hasPermission } = usePermissions();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [selectedPS, setSelectedPS] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    fetchProblemStatements();
  }, []);

  const fetchProblemStatements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await subAdminAPI.getAllProblemStatementsAdmin();
      setProblemStatements(res.data.problemStatements || []);
    } catch (err) {
      console.error('Error fetching problem statements:', err);
      setError('Failed to load problem statements. Please try again later.');
    }
    setLoading(false);
  };

  const filteredProblemStatements = problemStatements
    .filter(ps => {
      const matchesSearch = ps.PStitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ps.PSdescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ps.PSTheme?.themeName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filter === 'all' ||
        (filter === 'withTheme' && ps.PSTheme) ||
        (filter === 'withoutTheme' && !ps.PSTheme);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.PStitle?.localeCompare(b.PStitle);
        case 'theme':
          return (a.PSTheme?.themeName || '').localeCompare(b.PSTheme?.themeName || '');
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const handleDeletePS = (ps) => {
    setSelectedPS(ps);
    setDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent mb-1 sm:mb-2">
                    Problem Statement Management
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Manage and organize problem statements for teams</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            {/* Search Bar */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 transition-colors group-focus-within:text-purple-500" />
              <input
                type="text"
                placeholder="Search problem statements..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
              />
            </div>

            {/* Add Problem Statement Button */}
            <PermissionWrapper permission="createProblemStatement">
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group w-full sm:w-auto"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-sm sm:text-base whitespace-nowrap">Add New Problem</span>
              </button>
            </PermissionWrapper>
          </div>

          {/* Add Problem Statement Modal */}
          <Modal
            open={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            title="Add New Problem Statement"
            size="lg"
          >
            <AddPS
              onClose={() => setAddModalOpen(false)}
              onPSCreated={fetchProblemStatements}
            />
          </Modal>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading problem statements...</p>
          </div>
        )}

        {/* Problem Statements Grid */}
        {error ? (
          <div className="text-center py-8 sm:py-12 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg border border-red-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FiX className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-1 sm:mb-2">Error Loading Data</h3>
            <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto px-4">{error}</p>
            <button
              onClick={fetchProblemStatements}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        ) : !loading && filteredProblemStatements.length === 0 ? (
          <div className="text-center py-8 sm:py-12 lg:py-20 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 border-dashed border-gray-300 shadow-lg lg:shadow-xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 shadow-inner">
              <FiAward className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-600" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">No Problem Statements Found</h3>
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8 max-w-md mx-auto px-4">
              {searchTerm ? 'No problem statements match your search. Try different keywords.' : 'Start by creating your first problem statement.'}
            </p>
            <PermissionWrapper permission="createProblemStatement">
              <button
                onClick={() => setAddModalOpen(true)}
                className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg sm:rounded-xl lg:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                Create Your First Problem Statement
              </button>
            </PermissionWrapper>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {filteredProblemStatements.map((ps, index) => (
                <ProblemStatementCard
                  key={ps._id}
                  ps={ps}
                  index={index}
                  onEdit={(ps) => { setSelectedPS(ps); setEditModalOpen(true); }}
                  onDelete={(ps) => handleDeletePS(ps)}
                  onView={(ps) => { setSelectedPS(ps); setDetailModalOpen(true); }}
                />
              ))}
            </div>

            {/* Edit Problem Statement Modal */}
            <Modal
              open={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              title={selectedPS?.PStitle ? `Edit Problem Statement: ${selectedPS.PStitle}` : 'Edit Problem Statement'}
              size="lg"
            >
              {selectedPS && (
                <EditPS
                  problem={selectedPS}
                  onClose={() => setEditModalOpen(false)}
                  onPSUpdated={() => { setEditModalOpen(false); fetchProblemStatements(); }}
                  themes={themes}
                />
              )}
            </Modal>

            {/* Delete Problem Statement Modal */}
            <Modal
              open={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              title={selectedPS?.PStitle ? `Delete Problem Statement: ${selectedPS.PStitle}` : 'Delete Problem Statement'}
              size="md"
            >
              {selectedPS && (
                <DeletePS
                  problem={selectedPS}
                  onClose={() => setDeleteModalOpen(false)}
                  onPSDeleted={() => { setDeleteModalOpen(false); fetchProblemStatements(); }}
                />
              )}
            </Modal>

            {/* Results Count */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-gray-600 text-sm sm:text-base">
                Showing <span className="font-semibold text-gray-900">{filteredProblemStatements.length}</span> of <span className="font-semibold text-gray-900">{problemStatements.length}</span> problem statements
              </p>
            </div>
          </>
        )}

        {/* Detail Modal */}
        <Modal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={selectedPS?.PStitle || 'Problem Statement Details'}
          size="lg"
        >
          {selectedPS && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-purple-200">
                  <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-base sm:text-lg">Basic Information</h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <label className="text-xs sm:text-sm text-gray-600 font-medium">Title</label>
                      <p className="text-gray-800 font-semibold text-sm sm:text-base">{selectedPS.PStitle}</p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-gray-600 font-medium">Theme</label>
                      <p className="text-purple-700 font-medium text-sm sm:text-base">
                        {selectedPS.PSTheme?.themeName || selectedPS.PSTheme || 'No theme assigned'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-base sm:text-lg">Description</h4>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {selectedPS.PSdescription || 'No description provided'}
                  </p>
                </div>
              </div>
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

export default PsManageTab;