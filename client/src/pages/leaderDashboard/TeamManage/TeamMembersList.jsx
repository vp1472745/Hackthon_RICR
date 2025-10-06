import React, { useEffect, useState } from 'react';
import {
  Users,
  Crown,
  Mail,
  Phone,
  User,
  Edit,
  Trash2,
  Loader,
  Eye,
  Github,
  UserPlus
} from 'lucide-react';
import { userAPI } from '../../../configs/api';
import { toast } from 'react-hot-toast';
import AddMember from './AddMember'; // Adjust the import path as necessary

const TeamMembersList = ({
  handleEditMember,
  handleRemoveMember,
  handleViewMember,
  setShowAddMember // Added prop
}) => {
  const [leaderProfile, setLeaderProfile] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]); // Fixed: Consistent naming
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({}); // State for form errors
  const [addMemberForms, setAddMemberForms] = useState([]); // State for multiple add member forms

  const fetchLeaderProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check sessionStorage for team data first
      const storedLeader = JSON.parse(sessionStorage.getItem('leaderProfile'));
      const storedMembers = JSON.parse(sessionStorage.getItem('apiTeamMembers')) || [];
 
      
      // TEMPORARILY DISABLED - Force fresh API call to get proper _id fields
      // TODO: Re-enable after confirming API returns proper data
      /*
      //add a condition where only leader is there
      if (storedLeader && storedMembers.length === 0) {
      setLeaderProfile(storedLeader.member);
        setTeamMembers([]);
        return;
      } else if (storedLeader && Array.isArray(storedMembers)) {
        setLeaderProfile(storedLeader.member );
        setTeamMembers(storedMembers);
        return;
      }
      */
   
      
      // Clear old cached data that might not have _id fields
      sessionStorage.removeItem('leaderProfile');
      sessionStorage.removeItem('apiTeamMembers');
      
      const response = await userAPI.getLeaderProfile();

      if (response.data && response.data.leader) {
        const { leader, team } = response.data;

        
        // Check if members have _id fields
        if (team?.members && team.members.length > 0) {
          const membersWithIds = team.members.every(member => member._id);
          
        }
        
        setLeaderProfile(leader);
        setTeamMembers(team?.members || []); // Fixed setter

        // Store in sessionStorage for session use
        sessionStorage.setItem('leaderProfile', JSON.stringify({ member: leader }));
        sessionStorage.setItem('apiTeamMembers', JSON.stringify(team?.members || []));
      }
    } catch (error) {
      console.error('Error fetching leader profile:', error);

      // Check sessionStorage for cached data first
      const storedProfile = JSON.parse(sessionStorage.getItem('leaderProfile') || 'null');
      const storedMembers = JSON.parse(sessionStorage.getItem('apiTeamMembers') || '[]');

      if (storedProfile && Array.isArray(storedMembers)) {
        setLeaderProfile(storedProfile);
        setTeamMembers(storedMembers);

        return;
      }

      // Try alternative approach - get user by ID from sessionStorage
      const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
      if (hackathonUser.user && hackathonUser.user._id) {
        try {
          // Try to fetch user by ID as a fallback
          const userResponse = await userAPI.getUserById(hackathonUser.user._id);
          if (userResponse.data && userResponse.data.user) {
            setLeaderProfile(userResponse.data.user);
            setTeamMembers(userResponse.data.user.teamInfo?.members || []);

            // Save fallback to sessionStorage as well
            sessionStorage.setItem('leaderProfile', JSON.stringify(userResponse.data.user));
            sessionStorage.setItem('apiTeamMembers', JSON.stringify(userResponse.data.user.teamInfo?.members || []));


            return; // Exit early on success
          }
        } catch (fallbackError) {
          console.error('Fallback API also failed:', fallbackError);
        }
      }

      // If no stored data, use hackathonUser data from sessionStorage as last resort
      if (hackathonUser.user) {
        setLeaderProfile(hackathonUser.user);
        // Try to get team members from hackathonUser.team.members if available
        const teamMembersFromSession = hackathonUser.team?.members || [];
        setTeamMembers(teamMembersFromSession);

      } else {
        setError('Unable to load team data. Please try refreshing the page.');

      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderProfile();
  }, []);

  const handleRemoveWithConfirm = (member) => {
    handleRemoveMember(member);

  };

  const handleAddMember = async (memberData) => {
    try {
      setLoading(true);
      setErrors({}); // Reset errors

      // Basic client-side validation
      if (!memberData.fullName || !memberData.email) {
        setErrors({
          fullName: !memberData.fullName ? 'Full name is required' : '',
          email: !memberData.email ? 'Email is required' : ''
        });
        return;
      }

      // Call the parent handler to add the member
      await userAPI.addMemberToTeam(memberData);
      toast.success(`${memberData.fullName} added to the team!`);

      // Update local state
      setTeamMembers((prev) => [...prev, memberData]);
      // also update sessionStorage copy
      try {
        const updated = [...(JSON.parse(sessionStorage.getItem('apiTeamMembers') || '[]')), memberData];
        sessionStorage.setItem('apiTeamMembers', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not update sessionStorage apiTeamMembers', e);
      }

      setShowAddMember(false); // Close the form
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Failed to add member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveAllMembers = async () => {
    try {
      setLoading(true);
      setErrors({}); // Reset errors

      // Filter out empty forms and validate
      const validMembers = addMemberForms.filter(memberData => memberData.fullName && memberData.email);
      if (validMembers.length === 0) {
        toast.warning('Please fill in at least one member\'s details');
        return;
      }

      // Call the API to add each member
      for (const memberData of validMembers) {
        await userAPI.addMember(memberData); // Fixed method name
        toast.success(`${memberData.fullName} added to the team!`);
      }

      // Update local state
      setTeamMembers((prev) => [...prev, ...validMembers]);

      // update sessionStorage copy
      try {
        const existing = JSON.parse(sessionStorage.getItem('apiTeamMembers') || '[]');
        const updated = [...existing, ...validMembers];
        sessionStorage.setItem('apiTeamMembers', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not update sessionStorage apiTeamMembers', e);
      }

      setAddMemberForms([]); // Clear forms
    } catch (error) {
      console.error('Error adding members:', error);
      toast.error('Failed to add members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Avatar = ({ name, className = '' }) => (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-blue-500 to-blue-700 ${className}`}>
      {name ? name.charAt(0).toUpperCase() : 'U'}
    </div>
  );

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="truncate">{value || label}</span>
    </div>
  );

  const memberCount = Array.isArray(teamMembers) ? teamMembers.length : 0;

  // Loading state
  if (loading && !leaderProfile && !error) {
    return (
      <div className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {error ? (
        <div className="p-8 text-center">
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <button
            onClick={fetchLeaderProfile}
            disabled={loading}
            className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm disabled:opacity-50"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {loading ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {/* Team Summary */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Team Overview</h3>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  {leaderProfile ? '1 Leader' : '0 Leaders'}
                </span>
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-green-100 text-green-800 rounded-full font-medium">
                  {memberCount} Members
                </span>
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                  Total: {(leaderProfile ? 1 : 0) + memberCount}
                </span>
              </div>
            </div>
          </div>
          {/* Leader Section */}
          {leaderProfile && (
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar name={leaderProfile.fullName} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-800 truncate">{leaderProfile.fullName}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex-shrink-0">
                        Leader
                      </span>
                    </div>
                    <div className="space-y-2 mb-2">
                      <InfoItem icon={Mail} label="Email" value={leaderProfile.email} />
                      <InfoItem icon={Phone} label="Phone" value={leaderProfile.phone} />
                    </div>
                    {leaderProfile.GitHubProfile && (
                      <a
                        href={leaderProfile.GitHubProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium mb-3"
                      >
                        <Github className="w-4 h-4" />
                        GitHub Profile
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleViewMember(leaderProfile)}
                    disabled={loading}
                    aria-label="View leader profile"
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="View leader profile"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditMember(leaderProfile)}
                    disabled={loading}
                    aria-label="Edit leader profile"
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    title="Edit leader profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* No Leader Message */}
          {!leaderProfile && (
            <div className="p-6 text-center bg-yellow-50 border-b border-yellow-200">
              <div className="flex flex-col items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-600" />
                <p className="text-yellow-800 font-medium">No team leader found</p>
                <p className="text-yellow-600 text-sm">Please ensure you're logged in as a team leader</p>
              </div>
            </div>
          )}

          {/* Team Members */}
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div key={member._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar name={member.fullName} className="bg-gradient-to-br from-green-500 to-green-700" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-800 truncate">{member.fullName}</h4>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full flex-shrink-0">
                          Member
                        </span>
                      </div>
                      <div className="space-y-2 mb-2">
                        <InfoItem icon={Mail} label="Email" value={member.email} />
                        <InfoItem icon={Phone} label="Phone" value={member.phone} />
                      </div>
                      {member.GitHubProfile && (
                        <a
                          href={member.GitHubProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium mb-3"
                        >
                          <Github className="w-4 h-4" />
                          GitHub Profile
                        </a>
                      )}

                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleViewMember(member)}
                      disabled={loading}
                      aria-label="View member details"
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="View member details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditMember(member)}
                      disabled={loading}
                      aria-label="Edit member"
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      title="Edit member"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveWithConfirm(member)}
                      disabled={loading}
                      aria-label="Remove member"
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 bg-gray-50">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <h4 className="text-sm font-medium text-gray-700 mb-1">No team members yet</h4>
              <p className="text-xs">Add members to build your hackathon team and collaborate effectively.</p>
            </div>
          )}

          {/* Add Member Button - Shown only if less than 3 members */}
          {teamMembers.length < 3 && (
            <div className="px-8 text-gray-500 bg-gray-50">

              {addMemberForms.map((form, index) => (
                <div key={index} className="pt-5">
                  <AddMember
                    showAddMember={true}
                    newMember={form}
                    setNewMember={(updatedForm) => {
                      const updatedForms = [...addMemberForms];
                      updatedForms[index] = updatedForm;
                      setAddMemberForms(updatedForms);
                    }}
                    errors={errors}
                    loading={loading}
                    handleAddMember={handleAddMember}
                    cancelEdit={() => {
                      const updatedForms = addMemberForms.filter((_, i) => i !== index);
                      setAddMemberForms(updatedForms);
                    }}
                  />
                </div>
              ))}

              <div className="py-10 flex justify-center gap-4">
                {addMemberForms.length < (3 - teamMembers.length) && (
                  <button
                    onClick={() => {
                      setAddMemberForms([...addMemberForms, {}]);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r flex-start from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <UserPlus className="w-5 h-5 inline-block mr-2" /> Add More Members
                  </button>
                )}
                {addMemberForms.length > 0 && (
                  <button
                    onClick={saveAllMembers}
                    className="px-6 py-2 flex-end bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                  >
                    Save Members
                  </button>
                )}
              </div>
            </div>
          )}


        </div>
      )}
    </div>
  );
};

export default TeamMembersList;