import React, { useEffect, useState } from 'react';
import { AdminAPI } from '../../../configs/api';
import { FiSearch, FiUsers, FiX, FiMail, FiPhone, FiUser, FiAward, FiFilter } from 'react-icons/fi';

// Reusable Modal Component
const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className={`bg-white rounded-3xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <FiUsers className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 text-gray-500 hover:text-gray-700 transform hover:scale-110 hover:rotate-90"
          >
            <FiX size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

// Member Card Component
const MemberCard = ({ member }) => {
  return (
    <div className="flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl p-4 sm:p-5 border border-blue-100/50 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="relative">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
          {member.fullName?.[0]?.toUpperCase() || 'M'}
        </div>
        {member.role === 'Leader' && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg">
            <FiAward className="w-3 h-3" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-gray-900 text-sm sm:text-base truncate">
            {member.fullName}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            member.role === 'Leader'
              ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200'
              : 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200'
          }`}>
            {member.role}
          </span>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <FiMail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
            <span className="truncate">{member.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <FiPhone className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
            <span>{member.phone || 'Not provided'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatus = (team) => {
  if (team.PaymentID && team.PaymentID.paymentStatus === 'Completed') return 'Active';
  if (team.PaymentID && team.PaymentID.paymentStatus === 'Pending') return 'Pending';
  return 'Inactive';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': 
      return 'bg-gradient-to-r from-green-400 to-green-500 text-white';
    case 'Pending': 
      return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
    default: 
      return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'Active': 
      return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
    case 'Pending': 
      return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200';
    default: 
      return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200';
  }
};

const TeamManageTab = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMembers, setModalMembers] = useState([]);
  const [modalTeamName, setModalTeamName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await AdminAPI.teamsWithMembers();
        setTeams(response.data.teams || []);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  // Filter teams based on search and status
  const filteredTeams = teams.filter(team => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      team.teamName?.toLowerCase().includes(lowerSearch) ||
      team.teamCode?.toLowerCase().includes(lowerSearch) ||
      (team.teamTheme?.themeName?.toLowerCase().includes(lowerSearch)) ||
      (team.teamProblemStatement?.PStitle?.toLowerCase().includes(lowerSearch)) ||
      team.members?.some(member =>
        member.fullName?.toLowerCase().includes(lowerSearch) ||
        member.email?.toLowerCase().includes(lowerSearch)
      );

    const matchesStatus = statusFilter === 'All' || getStatus(team) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: teams.length,
    active: teams.filter(team => getStatus(team) === 'Active').length,
    pending: teams.filter(team => getStatus(team) === 'Pending').length,
    inactive: teams.filter(team => getStatus(team) === 'Inactive').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-base sm:text-lg">Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Teams</h3>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
                  Team Management
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Manage and monitor all registered teams</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-100/80 text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-900">{stats.total}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Total Teams</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-green-100/80 text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Active</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-yellow-100/80 text-center">
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Pending</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-100/80 text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-600">{stats.inactive}</div>
              <div className="text-gray-600 text-xs sm:text-sm">Inactive</div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 shadow-lg border border-gray-100/80">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative group">
                <FiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 transition-colors group-focus-within:text-blue-500" />
                <input
                  type="text"
                  placeholder="Search teams, members, themes, or codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-3 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="relative group">
              <FiFilter className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 transition-colors group-focus-within:text-blue-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-48 pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-3 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-300 shadow-xl">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner">
              <FiUsers className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">No Teams Found</h3>
            <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto px-4">
              {searchTerm || statusFilter !== 'All' 
                ? 'No teams match your search criteria. Try adjusting your filters.' 
                : 'No teams have been registered yet.'}
            </p>
            {(searchTerm || statusFilter !== 'All') && (
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredTeams.map((team, index) => {
                const leader = team.members?.find((m) => m.role === 'Leader');
                const status = getStatus(team);

                return (
                  <div
                    key={team._id}
                    className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100/80 transition-all duration-500 transform hover:-translate-y-2 sm:hover:-translate-y-3 overflow-hidden"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    {/* Status Bar */}
                    <div className={`h-2 ${getStatusColor(status)}`}></div>

                    <div className="p-4 sm:p-6">
                      {/* Team Header */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 truncate">
                            {team.teamName}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200">
                              {team.teamCode}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(status)}`}>
                              {status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Team Details */}
                      <div className="space-y-3 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                            <FiUser className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-gray-600 text-xs">Leader:</span>
                            <span className="font-semibold text-gray-800 ml-2 text-sm truncate block">
                              {leader?.fullName || 'Not assigned'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                            <FiMail className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-gray-600 text-xs">Email:</span>
                            <span className="font-semibold text-gray-800 ml-2 text-sm truncate block">
                              {leader?.email || 'Not provided'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                            <FiAward className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-gray-600 text-xs">Theme:</span>
                            <span className="font-semibold text-gray-800 ml-2 text-sm truncate block">
                              {team.teamTheme?.themeName || 'Not selected'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                            <FiAward className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-gray-600 text-xs">Problem:</span>
                            <span className="font-semibold text-gray-800 ml-2 text-sm truncate block">
                              {team.teamProblemStatement?.PStitle || 'Not selected'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          setModalMembers(team.members || []);
                          setModalTeamName(team.teamName);
                          setModalOpen(true);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-xl"
                      >
                        <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                        View Members ({team.members?.length || 0})
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Results Count */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-gray-600 text-sm sm:text-base">
                Showing <span className="font-semibold text-gray-900">{filteredTeams.length}</span> of <span className="font-semibold text-gray-900">{teams.length}</span> teams
              </p>
            </div>
          </>
        )}

        {/* Members Modal */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`${modalTeamName} - Team Members`}
          size="lg"
        >
          <div className="space-y-4 sm:space-y-6">
            {/* Team Info Header */}
            <div className="flex items-center gap-3 sm:gap-4 p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl border border-blue-100/50">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg">
                {modalTeamName?.[0]?.toUpperCase() || 'T'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg sm:text-xl truncate">
                  {modalTeamName}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {modalMembers.length} member{modalMembers.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200">
                  {modalMembers.filter(m => m.role === 'Leader').length} Leader
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200">
                  {modalMembers.filter(m => m.role === 'Member').length} Members
                </span>
              </div>
            </div>

            {/* Members List */}
            <div className="max-h-96 overflow-y-auto space-y-3 sm:space-y-4 pr-2 custom-scrollbar">
              {modalMembers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiUsers className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">No Members</h4>
                  <p className="text-gray-500 text-sm">This team doesn't have any members yet.</p>
                </div>
              ) : (
                modalMembers.map((member, index) => (
                  <MemberCard key={member._id || index} member={member} />
                ))
              )}
            </div>
          </div>
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
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default TeamManageTab;