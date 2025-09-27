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
  Github
} from 'lucide-react';
import { userAPI } from '../../../configs/api';
import { toast } from 'react-toastify';

const TeamMembersList = ({ 
  handleEditMember, 
  handleRemoveMember,
  handleViewMember
}) => {
  const [leaderProfile, setLeaderProfile] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]); // Fixed: Consistent naming
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userAPI.getLeaderProfile();

      if (response.data && response.data.leader) {
        const { leader, team } = response.data;
        setLeaderProfile(leader);
        setTeamMembers(team?.members || []); // Fixed setter

        // Store in localStorage for offline use
        localStorage.setItem('leaderProfile', JSON.stringify(leader));
        localStorage.setItem('apiTeamMembers', JSON.stringify(team?.members || []));
      }
    } catch (error) {
      console.error('Error fetching leader profile:', error);

      // Try alternative approach - get user by ID from localStorage
      const hackathonUser = JSON.parse(localStorage.getItem('hackathonUser') || '{}');
      if (hackathonUser.user && hackathonUser.user._id) {
        try {
          // Try to fetch user by ID as a fallback
          const userResponse = await userAPI.getUserById(hackathonUser.user._id);
          if (userResponse.data && userResponse.data.user) {
            setLeaderProfile(userResponse.data.user);
            setTeamMembers(userResponse.data.user.teamInfo?.members || []); // Fixed setter

          
            return; // Exit early on success
          }
        } catch (fallbackError) {
          console.error('Fallback fetch failed:', fallbackError);
        }
      }

      // Final fallback to localStorage data
      setError('Using offline data');
      toast.warning('Using offline profile data');

      const storedProfile = localStorage.getItem('leaderProfile');
      const storedMembers = localStorage.getItem('apiTeamMembers');
      if (storedProfile) setLeaderProfile(JSON.parse(storedProfile));
      if (storedMembers) setTeamMembers(JSON.parse(storedMembers)); // Fixed setter

      // If no stored data, use hackathonUser  data
      if (!storedProfile && hackathonUser.user) {
        setLeaderProfile(hackathonUser.user);
        toast.info('Using login session data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderProfile();
  }, []);

  const handleRemoveWithConfirm = (member) => {
    if (window.confirm(`Are you sure you want to remove ${member.fullName}?`)) {
      handleRemoveMember(member);
      toast.info(`${member.fullName} removed from team.`);
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



  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           {error ? (
        <div className="p-8 text-center">
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <button
            onClick={fetchLeaderProfile}
            className="text-blue-600 hover:underline text-sm"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <InfoItem icon={Mail} label="Email" value={leaderProfile.email} />
                      <InfoItem icon={Phone} label="Phone" value={leaderProfile.phone} />
                      <InfoItem 
                        icon={User } 
                        label="College" 
                        value={leaderProfile.collegeName || leaderProfile.course} 
                      />
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
                    <p className="text-xs text-gray-500">
                      Joined on {leaderProfile.createdAt ? new Date(leaderProfile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}
                    </p>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <InfoItem icon={Mail} label="Email" value={member.email} />
                        <InfoItem icon={Phone} label="Phone" value={member.phone} />
                        <InfoItem 
                          icon={User } 
                          label="College" 
                          value={member.collegeName || member.course} 
                        />
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
                      <p className="text-xs text-gray-500">
                        Joined on {member.createdAt ? new Date(member.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}
                      </p>
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

          
        </div>
      )}
    </div>
  );
};

export default TeamMembersList;
