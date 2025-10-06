import React, { useEffect, useState } from 'react';
import { User, Users, Mail, Phone, Trophy, Timer, Play, Crown, RefreshCw, Loader } from 'lucide-react';
import { userAPI } from '../../../configs/api';
import { toast } from 'react-hot-toast';

const TeamProfileCard = ({
  leaderProfile: propLeaderProfile,
  teamData,
  apiTeamMembers: propApiTeamMembers = [],
  teamMembers: propTeamMembers = [],
  loading: propLoading,
  error: propError,
  fetchLeaderProfile: propFetchLeaderProfile,
  setActiveSection
}) => {

  // Internal state for fetching team data when member is logged in
  const [teamLeader, setTeamLeader] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  
  // Get current user from session
  const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
  const currentUser = hackathonUser?.user;
  
  // Fetch team data specifically for members
  const fetchTeamData = async () => {
    if (!currentUser?.teamId) {
      setFetchError('No team ID found');
      return;
    }

    try {
      setFetchLoading(true);
      setFetchError(null);

      // Method 1: Try to get current user's data with team info
      try {
        const response = await userAPI.getUserById(currentUser._id);
        if (response.data && response.data.user && response.data.user.teamInfo) {
          const user = response.data.user;
          const teamInfo = user.teamInfo;
          
          // Current user might be leader or member
          let leader = null;
          let members = [];
          
          if (user.role === 'Leader') {
            leader = user;
            members = teamInfo.members || [];
          } else {
            // Current user is a member, need to find leader and all team members
            leader = teamInfo.leader || null;
            
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
          
          setTeamLeader(leader);
          setTeamMembers(members);
          
          // Cache the data
          sessionStorage.setItem('cachedTeamLeader', JSON.stringify(leader));
          sessionStorage.setItem('cachedTeamMembers', JSON.stringify(members));
  
          toast.success(`Team data loaded! Found ${members.length} members`);
          return;
        }
      } catch (error) {
        console.error('getUserById failed, trying alternative member fetching:', error);
      }

      // Method 1.5: If we got leader but not enough members, try to find more team members
      if (teamLeader && teamMembers.length <= 1) {
        try {

          
          const storedRegistrationData = sessionStorage.getItem('registrationData');
          if (storedRegistrationData) {
            const regData = JSON.parse(storedRegistrationData);
            if (regData.teamMembers && Array.isArray(regData.teamMembers)) {
              const additionalMembers = regData.teamMembers.filter(member => 
                member.role !== 'Leader' && !teamMembers.find(tm => tm._id === member._id || tm.email === member.email)
              );
              
              if (additionalMembers.length > 0) {
                setTeamMembers(prev => [...prev, ...additionalMembers]);
                toast.info(`Found ${additionalMembers.length} additional team members`);
              }
            }
          }
        } catch (memberSearchError) {
          console.error('Additional member search failed:', memberSearchError);
        }
      }

      // Method 2: Try to use the prop-based leader profile if available
      try {
        if (propLeaderProfile && propLeaderProfile.teamId === currentUser.teamId) {
          setTeamLeader(propLeaderProfile);
          setTeamMembers(propApiTeamMembers || propTeamMembers || []);
          
          toast.success('Team data loaded from props!');
          return;
        } else if (propFetchLeaderProfile) {
          // Call the parent's fetch function
          propFetchLeaderProfile();
          return;
        }
      } catch (propError) {
        console.error('Prop-based data failed:', propError);
      }

      // Method 3: Use cached data if available
      const cachedLeader = sessionStorage.getItem('cachedTeamLeader');
      const cachedMembers = sessionStorage.getItem('cachedTeamMembers');
      
      if (cachedLeader || cachedMembers) {
        if (cachedLeader) setTeamLeader(JSON.parse(cachedLeader));
        if (cachedMembers) setTeamMembers(JSON.parse(cachedMembers));
        toast.info('Using cached team data');
        setFetchError('Using cached data (offline mode)');
        return;
      }

      // Method 4: Create basic fallback data to prevent complete failure
      setTeamLeader({
        _id: 'fallback-leader-id',
        fullName: 'Team Leader',
        name: 'Team Leader',
        email: 'Contact your team leader',
        role: 'Leader',
        teamId: currentUser.teamId
      });
      
      // Create a more comprehensive member list including current user
      const fallbackMembers = [{
        _id: currentUser._id,
        fullName: currentUser.fullName || currentUser.name || 'You',
        name: currentUser.name || currentUser.fullName || 'You',
        email: currentUser.email || 'Your email',
        role: 'Member',
        teamId: currentUser.teamId
      }];
      
      // Add some mock team members to show the structure
      for (let i = 1; i <= 2; i++) {
        fallbackMembers.push({
          _id: `fallback-member-${i}`,
          fullName: `Team Member ${i}`,
          name: `Team Member ${i}`,
          email: `member${i}@team.com`,
          role: 'Member',
          teamId: currentUser.teamId
        });
      }
      
      setTeamMembers(fallbackMembers);

      setFetchError('Limited team data available');
      toast.warning(`Could not load complete team information. Showing ${fallbackMembers.length} members including fallback data.`);

    } catch (error) {
      console.error('Error fetching team data:', error);
      setFetchError('Failed to fetch team data');
      toast.error('Error loading team data');
    } finally {
      setFetchLoading(false);
    }
  };

  // Fetch team data on mount
  useEffect(() => {
    if (currentUser?.role === 'Member' && currentUser?.teamId) {
      fetchTeamData();
    }
  }, []);

  // Determine final data to display based on current user role
  let leader, members, loading;

  if (currentUser?.role === 'Member') {
    // For members, use internal state (fetched data)
    leader = teamLeader;
    members = teamMembers || [];
    loading = fetchLoading;
  } else {
    // For leaders or other roles, use prop data
    leader = propLeaderProfile || teamData?.user || teamData;
    const propMembers = propApiTeamMembers || propTeamMembers || [];
    members = propMembers.filter(m => m.role !== 'Leader');
    loading = propLoading;
  }


  const error = fetchError || propError;

  // Combined refresh function
  const handleRefresh = () => {
    if (currentUser?.role === 'Member') {
      fetchTeamData();
    } else if (propFetchLeaderProfile) {
      propFetchLeaderProfile();
    } else {
      toast.info('Refresh not available for current user type');
    }
  };


  return (
    <>
      {/* Hackathon Countdown Section */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 space-y-6">
        {/* Team Profile Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveSection && setActiveSection('team')}
            title="Go to Manage Team"
          >
            <Users className="w-6 h-6 text-[#0B2A4A]" />
            <h2 className="text-lg font-semibold text-gray-800 text-center sm:text-left">Team Profile</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 sm:mt-0">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[#0B2A4A] hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh team data"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span className="text-sm">{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
              onClick={() => {
                const event = new CustomEvent('changeSection', { detail: 'team' });
                window.dispatchEvent(event);
              }}
            >
              Manage Team
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B2A4A]"></div>
            <span className="mt-2 text-gray-600">Loading profile...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">{error}</div>
            <button
              onClick={propFetchLeaderProfile || handleRefresh}
              className="text-[#0B2A4A] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
   

            {/* Leader Section */}
            {leader ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">
                      {(leader.fullName || leader.name || 'L').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 flex items-center justify-center sm:justify-start gap-2">
                      {leader.fullName || leader.name || 'Team Leader'}
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#0B2A4A] text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        Leader
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{leader.email || 'Email not provided'}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{leader.phone || 'Phone not provided'}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{leader.collegeName || 'College not provided'}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                        <Trophy className="w-4 h-4" />
                        <span>{leader.course} - Sem {leader.collegeSemester || 'N/A'}</span>
                      </div>
                    </div>
                    {leader.GitHubProfile && (
                      <div className="mt-2">
                        <a
                          href={leader.GitHubProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 mb-6 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8 text-gray-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-700 mb-2">No Team Leader Found</h3>
                  <p className="text-sm text-gray-500">Team leader information is not available</p>
                  <button 
                    onClick={handleRefresh} 
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Try refreshing team data
                  </button>
                </div>
              </div>
            )}

            {/* Members Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members ({members.length})
                </h4>
                <div className="text-sm text-gray-500">
                  Excluding leader
                </div>
              </div>
              
              {members.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {members.map((member, idx) => (
                    <div key={member._id || idx} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {(member.fullName || member.name || 'M').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-center sm:text-left space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {member.fullName || member.name || `Member ${idx + 1}`}
                          </h4>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <User className="w-3 h-3 mr-1" />
                            Member
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          {member.email && (
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{member.email}</span>
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                          {member.collegeName && (
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                              <User className="w-4 h-4" />
                              <span>{member.collegeName}</span>
                            </div>
                          )}
                          {member.course && (
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                              <Trophy className="w-4 h-4" />
                              <span>{member.course} - Sem {member.collegeSemester || 'N/A'}</span>
                            </div>
                          )}
                        </div>
                        {member.GitHubProfile && (
                          <div className="mt-2">
                            <a
                              href={member.GitHubProfile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                              GitHub Profile
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-700 mb-2">No Team Members Found</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {leader ? 'Only the team leader is registered' : 'No team data is available'}
                  </p>
                  <button 
                    onClick={handleRefresh} 
                    disabled={fetchLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${fetchLoading ? 'animate-spin' : ''}`} />
                    {fetchLoading ? 'Refreshing...' : 'Refresh Team Data'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TeamProfileCard;