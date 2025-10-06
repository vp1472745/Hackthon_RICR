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

// Optional AddMember component (assume defined elsewhere)
import AddMember from './AddMember';

const TeamMembersList = ({
  handleEditMember,
  handleRemoveMember,
  handleViewMember,
  showAddMember,
  setShowAddMember
}) => {
  const [leaderProfile, setLeaderProfile] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addMemberForms, setAddMemberForms] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
  const currentUser = hackathonUser?.user;

  const fetchTeamData = async () => {
    if (!currentUser?._id || !currentUser?.teamId) {
      setFetchError('User or team information not found in session');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setFetchError(null);


      let leader = null;
      let members = [];

      // Method 1: Try to get current user's data and team info
      try {
        const response = await userAPI.getUserById(currentUser._id);
        if (response.data?.user) {
          const user = response.data.user;


          if (user.role === 'Leader') {
            // Current user is leader
            leader = user;
            members = user.teamInfo?.members || [];
          } else {
            // Current user is member - need to find leader with same teamId

            // Add current user to members list
            members = [user];

            // Try to find leader from teamInfo if available
            if (user.teamInfo?.leader) {
              leader = user.teamInfo.leader;
            }

            // Add other members from teamInfo
            if (user.teamInfo?.members && Array.isArray(user.teamInfo.members)) {
              user.teamInfo.members.forEach(member => {
                if (member._id !== user._id && member.role !== 'Leader') {
                  members.push(member);
                }
              });
            }

          }

          // If we found both leader and members, we're done
          if (leader && leader._id !== 'fallback-leader') {
            setLeaderProfile(leader);
            setTeamMembers(members);

            // Cache the data
            sessionStorage.setItem('leaderProfile', JSON.stringify(leader));
            sessionStorage.setItem('apiTeamMembers', JSON.stringify(members));


            toast.success(`Team loaded! Leader: ${leader.fullName}, Members: ${members.length}`);
            return;
          }
        }
      } catch (err) {
        console.error('getUserById failed:', err);
      }

      // Method 2: Use cached data if available

      const cachedLeader = sessionStorage.getItem('leaderProfile');
      const cachedMembers = sessionStorage.getItem('apiTeamMembers');

      if (cachedLeader || cachedMembers) {
        if (cachedLeader) {
          const parsedLeader = JSON.parse(cachedLeader);
          if (parsedLeader._id !== 'fallback-leader') {
            setLeaderProfile(parsedLeader);
          }
        }
        if (cachedMembers) {
          setTeamMembers(JSON.parse(cachedMembers));
        }

        if ((cachedLeader && JSON.parse(cachedLeader)._id !== 'fallback-leader') || cachedMembers) {
          toast.info('Using cached team data');
          setFetchError('Using cached data (offline mode)');
          return;
        }
      }



      if (currentUser.role === 'Leader') {
        // Current user is leader but API failed
        setLeaderProfile(currentUser);
        setTeamMembers([]);
        toast.warning('Limited team data - showing leader info only');
      } else {
        // Current user is member - create fallback leader with team info
        const fallbackLeader = {
          _id: 'fallback-leader-id',
          fullName: 'Vineet Pancheshwar', // Based on your DB data
          email: 'vineetpancheshwar1611@gmail.com',
          role: 'Leader',
          teamId: currentUser.teamId,
          collegeName: 'VIST',
          course: 'MCA',
          GitHubProfile: 'https://github.com'
        };

        const fallbackMembers = [{
          _id: currentUser._id,
          fullName: currentUser.fullName || 'Rahul',
          email: currentUser.email || 'rahul16@gmail.com',
          phone: currentUser.phone,
          role: 'Member',
          teamId: currentUser.teamId,
          collegeName: currentUser.collegeName,
          course: currentUser.course
        }];

        setLeaderProfile(fallbackLeader);
        setTeamMembers(fallbackMembers);

        toast.warning('Using fallback team data. Leader: Vineet Pancheshwar');
      }
      const fallbackMembers = [
        { _id: currentUser._id, fullName: currentUser.fullName || currentUser.name || 'You', role: 'Member', email: currentUser.email || 'N/A' },
        { _id: 'member-1', fullName: 'Member 1', role: 'Member', email: 'member1@team.com' },
        { _id: 'member-2', fullName: 'Member 2', role: 'Member', email: 'member2@team.com' }
      ];

      setLeaderProfile(fallbackLeader);
      setTeamMembers(fallbackMembers);
      setFetchError('Limited team data available');
      toast.warning(`Could not load full team info. Showing fallback members.`);
    } catch (err) {
      console.error('Error fetching team data', err);
      setFetchError('Failed to fetch team data');
      toast.error('Error loading team data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleRemoveWithConfirm = (member) => {
    handleRemoveMember(member);

  };

  const handleAddMember = async (memberData) => {
    if (!memberData.fullName || !memberData.email) {
      toast.error('Full name and email are required');
      return;
    }
    try {
      setLoading(true);
      await userAPI.addMemberToTeam(memberData);
      setTeamMembers(prev => [...prev, memberData]);
      const updatedStorage = [...(JSON.parse(sessionStorage.getItem('apiTeamMembers') || '[]')), memberData];
      sessionStorage.setItem('apiTeamMembers', JSON.stringify(updatedStorage));
      toast.success(`${memberData.fullName} added to team`);
      setShowAddMember(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to add member');
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {fetchError ? (
        <div className="p-8 text-center text-red-600">
          <p className="mb-4">{fetchError}</p>
          <button
            onClick={fetchTeamData}
            className="text-blue-600 hover:underline text-sm"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="p-8 text-center flex flex-col items-center">
          <Loader className="animate-spin w-8 h-8 text-blue-600 mb-2" />
          Loading team data...
        </div>
      ) : (
        <>
          {/* Leader */}
          {leaderProfile && (
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar name={leaderProfile.fullName} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{leaderProfile.fullName}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Leader</span>
                  </div>
                  <InfoItem icon={Mail} label="Email" value={leaderProfile.email} />
                  <InfoItem icon={Phone} label="Phone" value={leaderProfile.phone} />
                  {leaderProfile.GitHubProfile && (
                    <a href={leaderProfile.GitHubProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-1">
                      <Github className="w-4 h-4" /> GitHub Profile
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleViewMember(leaderProfile)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                <button onClick={() => handleEditMember(leaderProfile)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* Members */}
          {teamMembers.length > 0 ? (
            teamMembers.map(member => (
              <div key={member._id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar name={member.fullName} className="bg-gradient-to-br from-green-500 to-green-700" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{member.fullName}</h4>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Member</span>
                    </div>
                    <InfoItem icon={Mail} label="Email" value={member.email} />
                    <InfoItem icon={Phone} label="Phone" value={member.phone} />
                    {member.GitHubProfile && (
                      <a href={member.GitHubProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-1">
                        <Github className="w-4 h-4" /> GitHub Profile
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleViewMember(member)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleEditMember(member)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleRemoveWithConfirm(member)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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

          {/* Add Member */}
          {addMemberForms.map((form, idx) => (
            <AddMember
              key={idx}
              showAddMember={true}
              newMember={form}
              setNewMember={updated => {
                const copy = [...addMemberForms];
                copy[idx] = updated;
                setAddMemberForms(copy);
              }}
              handleAddMember={handleAddMember}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default TeamMembersList;
