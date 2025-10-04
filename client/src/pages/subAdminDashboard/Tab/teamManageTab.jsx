import React, { useEffect, useState } from 'react';
import { subAdminAPI } from '../../../configs/api';

const getStatus = (team) => {
  if (team.PaymentID && team.PaymentID.paymentStatus === 'Completed') return 'Active';
  if (team.PaymentID && team.PaymentID.paymentStatus === 'Pending') return 'Pending';
  return 'Inactive';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'bg-gradient-to-r from-green-400 to-green-500 text-white';
    case 'Pending': return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
    default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
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
        const response = await subAdminAPI.getAllTeams();
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

  if (loading) return <div className="text-center py-16">Loading teams...</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
            Team Management
          </h2>
          <p className="text-gray-600 mt-2">Manage and monitor all registered teams</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 text-center">
            <div className="text-2xl font-bold text-blue-900">{teams.length}</div>
            <div className="text-sm text-gray-600">Total Teams</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {teams.filter(team => getStatus(team) === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-yellow-100 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {teams.filter(team => getStatus(team) === 'Pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="   p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search teams, members, or codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-blue-50">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👥</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No teams found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeams.map((team, index) => {
            const leader = team.members?.find((m) => m.role === 'Leader');
            const status = getStatus(team);

            return (
              <div
                key={team._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-blue-50 overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Status Bar */}
                <div className={`h-2 ${getStatusColor(status)}`}></div>

                <div className="p-6">
                  {/* Team Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-900 mb-1 truncate">
                        {team.teamName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {team.teamCode}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Team Details */}
                  <div className="space-y-3 mb-4">


                          <div className="">

                      <span className="text-gray-600 flex-1 text-sm">Leader:</span>
                      <span className="font-semibold text-blue-800 ml-2 text-sm">{leader?.fullName || '-'}</span>
                    </div>
                    <div className="">

                      <span className="text-gray-600 text-sm">Email:</span>
                      <span className="font-semibold text-blue-800 truncate ml-2">{leader?.email || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">

                      <span className="text-gray-600 ">Theme:</span>
                      <span className="font-semibold text-blue-800 truncate">{team.teamTheme?.themeName || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">

                      <span className="text-gray-600 ">Problem:</span>
                      <span className="font-semibold text-blue-800 truncate">{team.teamProblemStatement?.PStitle || '-'}</span>
                    </div>
              
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      setModalMembers(team.members || []);
                      setModalTeamName(team.teamName);
                      setModalOpen(true);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    
                    View Members ({team.members?.length || 0})
                  </button>
                  {/* Member Modal */}
                  {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 relative animate-fadeIn border border-blue-100">
                        <button
                          className="absolute top-4 right-4 text-gray-400 hover:text-blue-700 text-2xl font-bold focus:outline-none"
                          onClick={() => setModalOpen(false)}
                          aria-label="Close"
                        >
                          &times;
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white text-xl font-bold shadow">
                            {modalTeamName?.[0] || 'T'}
                          </div>
                          <h3 className="text-2xl font-bold text-blue-900">{modalTeamName}</h3>
                          <span className="ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            Members: {modalMembers.length}
                          </span>
                        </div>
                        <div className="max-h-80 overflow-y-auto pr-2">
                          {modalMembers.length === 0 ? (
                            <div className="text-gray-500 text-center py-8">No members found.</div>
                          ) : (
                            <ul className="space-y-4">
                              {modalMembers.map((member) => (
                                <li key={member._id} className="flex items-center gap-4 bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-blue-900 font-bold text-lg">
                                    {member.fullName?.[0] || 'M'}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-blue-900 truncate">{member.fullName}</span>
                                      <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                                        member.role === 'Leader'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-green-100 text-green-800'
                                      }`}>
                                        {member.role}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-600 flex flex-wrap gap-3">
                                      <span className="flex items-center gap-1">{member.email}</span>
                                      <span className="flex items-center gap-1">{member.phone || '-'}</span>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamManageTab;