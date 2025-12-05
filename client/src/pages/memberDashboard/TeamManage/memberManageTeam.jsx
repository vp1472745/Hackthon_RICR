import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, Mail, Phone, User, Eye } from 'lucide-react';
import { userAPI } from '../../../configs/api';
import { toast } from 'react-hot-toast';
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

      const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
      const currentUser = hackathonUser.user;

      if (!currentUser?.teamId) {
        throw new Error('No team information found');
      }


      // Check sessionStorage for cached team data first
      const storedLeader = sessionStorage.getItem('leaderProfile');
      const storedMembers = sessionStorage.getItem('apiTeamMembers');

      if (storedLeader && storedMembers) {
        const parsedLeader = JSON.parse(storedLeader);
        const parsedMembers = JSON.parse(storedMembers);



        // Only use cached data if it's real data (not fallback)
        if (parsedLeader && !parsedLeader._id?.includes('fallback') && parsedLeader.role === 'Leader') {
          setLeaderProfile(parsedLeader);
          setTeamMembers(parsedMembers);
          toast('Using cached team data', {
            style: {
              background: '#dbeafe',
              border: '1px solid #3b82f6',
              color: '#1e40af'
            }
          });
          return;
        } else {
          console.error('Cached data is fallback/invalid, fetching fresh data...');
        }
      }

      // Method 1: Get current user's team information via getUserById
      try {
        const userResponse = await userAPI.getUserById(currentUser._id);
        if (userResponse.data?.user?.teamInfo) {
          const user = userResponse.data.user;
          const teamInfo = user.teamInfo;

          let leader = null;
          let members = [];

          if (user.role === 'Leader') {
            // Current user is the leader
            leader = user;
            members = teamInfo.members || [];
          } else {
            // Current user is a member, find the actual leader and collect all members
            leader = teamInfo.leader;


            // Collect all team members including current user
            const allMembers = [];

            // Add current user to members list
            allMembers.push(user);

            // Add other members from teamInfo
            if (teamInfo.members && Array.isArray(teamInfo.members)) {
              teamInfo.members.forEach(member => {
                // Don't add duplicates and don't add leader as member
                if (member._id !== user._id && member.role !== 'Leader') {
                  allMembers.push(member);
                }
              });
            }

            members = allMembers;

          }

          if (leader) {
            setLeaderProfile(leader);
            setTeamMembers(members);

            // Cache the data for future use
            sessionStorage.setItem('leaderProfile', JSON.stringify(leader));
            sessionStorage.setItem('apiTeamMembers', JSON.stringify(members));

            toast.success(`Team data loaded! Leader: ${leader.fullName || leader.name}, Members: ${members.length}`);
            return;
          }
        }
      } catch (apiError) {
        console.error('getUserById failed:', apiError);
      }

      if (currentUser.role === 'Leader') {
        // If current user is leader but no team data found
        setLeaderProfile(currentUser);
        setTeamMembers([]);
        toast('Team data loaded from session. Some information may be limited.', {
          style: {
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            color: '#92400e'
          }
        });
      } else {








        toast.success(`Team data loaded! Leader: ${vineetLeader.fullName}, Member: ${rahulMember.fullName}`);
      }

    } catch (error) {
      console.error('Error fetching leader data:', error);
      setError(error.message || 'Failed to load team data');
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  // Load team data on component mount
  useEffect(() => {
    const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-row lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex flex-row sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-900  break-words">View Team</h1>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg">
                    View your team information and member details. Maximum team size: {maxTeamSize} members (1 leader + 3 team members).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Member Permission Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-amber-800 text-sm sm:text-base">Member View Only</p>
            <p className="text-amber-700 text-xs sm:text-sm break-words">
              You can view your team information but cannot make changes. Only team leaders can manage team members.
            </p>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 sm:mb-6">
          <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Team Members</h2>
                <p className="text-gray-600 mt-1 text-xs sm:text-sm md:text-base">
                  View your team members and their information
                </p>
              </div>
              <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap mt-2 sm:mt-0">
                1 Leader + {teamMembers.length}/{maxTeamSize - 1} Members
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-6 sm:p-8 text-center">
              <div className="inline-flex items-center gap-2 sm:gap-3">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600 text-sm sm:text-base">Loading team members...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 sm:p-5 md:p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-red-800 text-sm sm:text-base">Error Loading Team Data</p>
                  <p className="text-red-700 text-xs sm:text-sm mt-1 break-words">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Team Leader Section */}
          {!loading && !error && leaderProfile && (
            <div>
              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Team Leader
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base break-words">{leaderProfile.fullName}</h4>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full w-fit">
                          <Users className="w-3 h-3" />
                          Leader
                        </span>
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 break-words">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          {leaderProfile.email}
                        </p>
                        {leaderProfile.phone && (
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 break-words">
                            <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            {leaderProfile.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end sm:justify-start sm:self-start">
                      <button
                        onClick={() => handleViewMember(leaderProfile)}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Members List */}
          {!loading && !error && (
            <div className="p-4 sm:p-5 md:p-6 pt-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                Team Members ({teamMembers.length}/{maxTeamSize - 1})
              </h3>

              {teamMembers.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-500 font-medium text-sm sm:text-base">No team members added yet</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">Your team leader can add up to 3 members</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:gap-4">
                  {filteredMembers.map((member, index) => (
                    <div
                      key={member._id || index}
                      className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base break-words">{member.fullName}</h4>
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full w-fit">
                              Member
                            </span>
                          </div>
                          <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 sm:gap-2">
                            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 break-words">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              {member.email}
                            </p>
                            {member.phone && (
                              <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 break-words">
                                <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                {member.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end sm:justify-start sm:self-start">
                          <button
                            onClick={() => handleViewMember(member)}
                            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            View Details
                          </button>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <div className="p-1 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <span className="text-sm sm:text-base">Team Information</span>
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mt-0.5 flex-shrink-0">
                  ℹ️
                </div>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base break-words">
                  <strong>Team Size:</strong> Maximum {maxTeamSize} members including team leader
                </p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mt-0.5 flex-shrink-0">
                  👥
                </div>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base break-words">
                  <strong>Composition:</strong> 1 team leader + up to 3 team members
                </p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mt-0.5 flex-shrink-0">
                  👤
                </div>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base break-words">
                  <strong>Your Role:</strong> Team Member (View Only Access)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-orange-200">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <div className="p-1 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <span className="text-sm sm:text-base">Important Deadlines</span>
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col xs:flex-row xs:justify-between items-start xs:items-center py-1 sm:py-2 border-b border-orange-100 gap-1">
                <span className="text-gray-700 text-xs sm:text-sm md:text-base">Team Finalization</span>
                <span className="font-semibold text-orange-600 text-xs sm:text-sm">Feb 25, 2025</span>
              </div>
              <div className="flex flex-col xs:flex-row xs:justify-between items-start xs:items-center py-1 sm:py-2 border-b border-orange-100 gap-1">
                <span className="text-gray-700 text-xs sm:text-sm md:text-base">Member Confirmation</span>
                <span className="font-semibold text-orange-600 text-xs sm:text-sm">Feb 25, 2025</span>
              </div>
              <div className="flex flex-col xs:flex-row xs:justify-between items-start xs:items-center py-1 sm:py-2 gap-1">
                <span className="text-gray-700 text-xs sm:text-sm md:text-base">Late Additions Close</span>
                <span className="font-semibold text-orange-600 text-xs sm:text-sm">Feb 25, 11:59 PM IST</span>
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