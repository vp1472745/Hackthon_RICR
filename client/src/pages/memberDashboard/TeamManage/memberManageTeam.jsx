import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, Mail, Phone, User, Eye } from 'lucide-react';
import { userAPI } from '../../../configs/api';
import { toast } from 'react-toastify';
import ViewMember from './memberviewMember';



const ManageTeam = () => {
  // Leader profile and team data
  const [leaderProfile, setLeaderProfile] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // UI states
  const [showViewMember, setShowViewMember] = useState(false);
  const [viewingMember, setViewingMember] = useState(null);

  const maxTeamSize = 4; // 1 Leader + 4 members

  // Filter team members based on search
  const filteredMembers = teamMembers.filter(member =>
    member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.collegeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch leader profile and team data
  const fetchLeaderData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check sessionStorage for team data
      const storedLeader = JSON.parse(sessionStorage.getItem('leaderProfile'));
      const storedMembers = JSON.parse(sessionStorage.getItem('apiTeamMembers'));

      if (storedLeader && storedMembers) {
        setLeaderProfile(storedLeader);
        setTeamMembers(storedMembers);
        toast.info('Loaded team data from session storage.');
        return;
      }

      // Fetch from API if not in sessionStorage
      const response = await userAPI.getLeaderProfile();

      if (response.data && response.data.leader) {
        const { leader, team } = response.data;
        setLeaderProfile(leader);
        setTeamMembers(team?.members || []);

        // Store in sessionStorage for future use
        sessionStorage.setItem('leaderProfile', JSON.stringify(leader));
        sessionStorage.setItem('apiTeamMembers', JSON.stringify(team?.members || []));
        toast.success('Team data loaded successfully!');
        return;
      }
    } catch (error) {
      console.error('Error fetching leader data:', error);
      setError('Failed to load team data');
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };


  // Load team data on component mount
  useEffect(() => {
    fetchLeaderData();
  }, []);

  const handleViewMember = (member) => {
    setViewingMember(member);
    setShowViewMember(true);
  };

  const handleCloseViewMember = () => {
    setShowViewMember(false);
    setViewingMember(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 ">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto ">
        <div >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">View Team</h1>
                  <p className="text-gray-600 text-sm sm:text-lg">
                    View your team information and member details. Maximum team size: {maxTeamSize} members (1 leader + 3 team members).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Member Permission Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <div>
            <p className="font-medium text-amber-800">Member View Only</p>
            <p className="text-sm text-amber-700">You can view your team information but cannot make changes. Only team leaders can manage team members.</p>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Team Members</h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  View your team members and their information
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mt-2 sm:mt-0">
                1 Leader + {teamMembers.length}/{maxTeamSize - 1} Members
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Loading team members...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">Error Loading Team Data</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Team Leader Section */}
          {!loading && !error && leaderProfile && (
            <div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Team Leader
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{leaderProfile.fullName}</h4>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          <Users className="w-3 h-3" />
                          Leader
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {leaderProfile.email}
                        </p>
                        {leaderProfile.phone && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {leaderProfile.phone}
                          </p>
                        )}

                      </div>

                    </div>
                    <div>
                      <div className="mt-3 flex items-center justify-end">
                        <button
                          onClick={() => handleViewMember(leaderProfile)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Members List */}
          {!loading && !error && (
            <div className="p-6 pt-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                Team Members ({teamMembers.length}/{maxTeamSize - 1})
              </h3>

              {teamMembers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No team members added yet</p>
                  <p className="text-gray-400 text-sm mt-1">Your team leader can add up to 3 members</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredMembers.map((member, index) => (
                    <div
                      key={member._id || index}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{member.fullName}</h4>
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                Member
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {member.email}
                              </p>
                              {member.phone && (
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {member.phone}
                                </p>
                              )}

                            </div>

                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div></div>
                            <button
                              onClick={() => handleViewMember(member)}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>


        {/* Team Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              Team Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                  ℹ️
                </div>
                <p className="text-gray-700 text-sm sm:text-base"><strong>Team Size:</strong> Maximum {maxTeamSize} members including team leader</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                  👥
                </div>
                <p className="text-gray-700 text-sm sm:text-base"><strong>Composition:</strong> 1 team leader + up to 3 team members</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                  👤
                </div>
                <p className="text-gray-700 text-sm sm:text-base"><strong>Your Role:</strong> Team Member (View Only Access)</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              Important Deadlines
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-orange-100">
                <span className="text-gray-700 text-sm sm:text-base">Team Finalization</span>
                <span className="font-semibold text-orange-600 text-sm sm:text-base">Nov 6, 2025</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-orange-100">
                <span className="text-gray-700 text-sm sm:text-base">Member Confirmation</span>
                <span className="font-semibold text-orange-600 text-sm sm:text-base">Nov 5, 2025</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700 text-sm sm:text-base">Late Additions Close</span>
                <span className="font-semibold text-orange-600 text-sm sm:text-base">Nov 6, 11:59 PM IST</span>
              </div>
            </div>
          </div>
        </div>





        <ViewMember
          isOpen={showViewMember}
          member={viewingMember}
          onClose={handleCloseViewMember}
        />

      </div>
    </div>
  );
};

export default ManageTeam;