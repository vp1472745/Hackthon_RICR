import React, { useState, useEffect } from 'react';
import { Users, UserPlus, AlertTriangle, CheckCircle, Circle, Clock } from 'lucide-react';
import { userAPI } from '../../../../configs/api';
import { toast } from 'react-toastify';
import AddMember from './AddMember';
import TeamMembersList from './TeamMembersList';
import TeamStats from './TeamStats';
import EditMember from './editMember';
import ViewMember from './viewMember';
import DeleteMember from './deleteMember';

const ManageTeam = () => {
  // Leader profile and team data
  const [leaderProfile, setLeaderProfile] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState(false);
  const [showViewMember, setShowViewMember] = useState(false);
  const [showDeleteMember, setShowDeleteMember] = useState(false);
  const [newMember, setNewMember] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeName: '',
    course: '',
    collegeBranch: '',
    collegeSemester: '',
    GitHubProfile: ''
  });
  
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [errors, setErrors] = useState({});

  const maxTeamSize = 5; // 1 Leader + 4 members  
  const canAddMembers = teamMembers.length < 4; // Max 4 team members (excluding leader)

  // Fetch leader profile and team data
  const fetchLeaderData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try authenticated leader profile first
      const response = await userAPI.getLeaderProfile();

      if (response.data && response.data.leader) {
        const { leader, team } = response.data;
        setLeaderProfile(leader);
        setTeamMembers(team?.members || []);

        toast.success('Team data loaded successfully!');
        
 
        const getTeamProgress = () => {
          const apiTeamMembers = JSON.parse(localStorage.getItem('apiTeamMembers')) || [];
          const registrationData = JSON.parse(localStorage.getItem('registrationData')) || {};
          const leaderProfile = JSON.parse(localStorage.getItem('leaderProfile')) || null;
          let teamMembers = [];
          if (apiTeamMembers.length > 0) teamMembers = apiTeamMembers;
          else if (registrationData.teamMembers) teamMembers = registrationData.teamMembers;
          else if (leaderProfile?.teamInfo?.members) teamMembers = leaderProfile.teamInfo.members;
          const currentCount = teamMembers.length;
          const requiredCount = 4;
          const stepProgress = Math.min(currentCount / requiredCount, 1) * 100;
          return { current: currentCount, required: requiredCount, isComplete: currentCount >= requiredCount, stepProgress };
        };

        const getStepStatus = (isCompleted, progress) => {
          if (isCompleted) {
            return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
          } else if (progress > 0) {
            return { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
          } else {
            return { icon: Circle, color: 'text-gray-400', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
          }
        };

        const ManageTeamCard = () => {
          const teamProgress = getTeamProgress();
          const status = getStepStatus(teamProgress.isComplete, teamProgress.stepProgress);
          const StatusIcon = status.icon;
          return (
            <div className={`flex flex-col justify-between w-full bg-white rounded-lg border ${status.borderColor} shadow-sm ${status.bgColor} p-4 mb-6 transition-all`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className={`w-7 h-7 ${status.color} mr-2`} />
                  <span className="font-semibold text-base">Add 3 Team Members</span>
                </div>
                <span className={`flex items-center gap-1 text-xs ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {`${teamProgress.current}/${teamProgress.required} members`}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-2">Build your complete hackathon team (3 members + you = 4 total)</div>
            </div>
          );
        };
      }
    } catch (error) {
      console.error('Error fetching leader data:', error);
      
      // Fallback to localStorage or user by ID
      const hackathonUser = JSON.parse(localStorage.getItem('hackathonUser') || '{}');
      if (hackathonUser.user && hackathonUser.user._id) {
        try {
          const userResponse = await userAPI.getUserById(hackathonUser.user._id);
          if (userResponse.data && userResponse.data.user) {
            setLeaderProfile(userResponse.data.user);
            setTeamMembers(userResponse.data.user.teamInfo?.members || []);
            toast.success('Team data loaded from user profile!');
            return;
          }
        } catch (fallbackError) {
          console.error('Fallback fetch failed:', fallbackError);
        }
      }
      
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

  const validateMemberForm = (member) => {
    const newErrors = {};
    
    if (!member.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!member.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (teamMembers.some(m => m.email === member.email && m._id !== editingMember?._id)) {
      newErrors.email = 'Email already exists in team';
    }
    
    if (!member.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[0-9\s-()]{10,15}$/.test(member.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMember = async () => {
    if (!validateMemberForm(newMember)) return;
    
    try {
      setLoading(true);
      
      const memberData = {
        ...newMember,
        teamId: leaderProfile?.teamId?._id || leaderProfile?.teamId,
        leaderId: leaderProfile?._id
      };
      
      const response = await userAPI.addMember(memberData);
      
      if (response.data) {
        // Refresh team data
        await fetchLeaderData();
        resetForm();
        toast.success('Team member added successfully!');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add team member';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewMember({
      fullName: '',
      email: '',
      phone: '',
      collegeName: '',
      course: '',
      collegeBranch: '',
      collegeSemester: '',
      GitHubProfile: ''
    });
    setShowAddMember(false);
    setEditingMember(null);
    setErrors({});
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowEditMember(true);
  };

  const handleSaveEditedMember = async (updatedMemberData) => {
    try {
      setLoading(true);
      
      const updateData = {
        ...updatedMemberData,
        leaderId: leaderProfile?._id
      };
      
      const response = await userAPI.editMember(editingMember._id, updateData);
      
      if (response.data) {
        // Refresh team data
        await fetchLeaderData();
        setShowEditMember(false);
        setEditingMember(null);
        toast.success('Team member updated successfully!');
      }
    } catch (error) {
      console.error('Error updating member:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update team member';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditMember(false);
    setEditingMember(null);
  };

  const handleViewMember = (member) => {
    setViewingMember(member);
    setShowViewMember(true);
  };

  const handleCloseViewMember = () => {
    setShowViewMember(false);
    setViewingMember(null);
  };

  const handleRemoveMember = (member) => {
    setDeletingMember(member);
    setShowDeleteMember(true);
  };

  const handleConfirmDelete = async (member) => {
    try {
      setLoading(true);
      
      const removeData = {
        memberId: member._id,
        teamId: leaderProfile?.teamId?._id || leaderProfile?.teamId,
        leaderId: leaderProfile?._id
      };
      
      const response = await userAPI.removeMember(removeData);
      
      if (response.data) {
        await fetchLeaderData();
        setShowDeleteMember(false);
        setDeletingMember(null);
        toast.success(`${member.fullName} removed successfully!`);
      }
    } catch (error) {
      console.error('Error removing member:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove team member';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteMember(false);
    setDeletingMember(null);
  };

  const cancelEdit = () => {
    resetForm();
  };



  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-[#0B2A4A]" />
              <h1 className="text-2xl font-bold text-gray-800">Manage Team</h1>
            </div>
            <p className="text-gray-600">
              Add, edit, and manage your team members. Maximum team size: {maxTeamSize} members (1 leader + 4 team members).
            </p>
          </div>
          
          {canAddMembers && !showAddMember ? (
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0d2d4f] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
          ) : !canAddMembers ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg">
              <UserPlus className="w-4 h-4" />
              Team Full (Max 5 members)
            </div>
          ) : null}
        </div>
        
        {/* Team Stats */}
        <TeamStats teamMembers={teamMembers} />
      </div>

      {/* Add Member Form */}
      <AddMember
        showAddMember={showAddMember}
        newMember={newMember}
        setNewMember={setNewMember}
        errors={errors}
        loading={loading}
        handleAddMember={handleAddMember}
        cancelEdit={cancelEdit}
      />

      {/* Edit Member Modal */}
      <EditMember
        isOpen={showEditMember}
        member={editingMember}
        onSave={handleSaveEditedMember}
        onCancel={handleCancelEdit}
        loading={loading}
      />

      {/* View Member Modal */}
      <ViewMember
        isOpen={showViewMember}
        member={viewingMember}
        onClose={handleCloseViewMember}
      />

      {/* Delete Member Modal */}
      <DeleteMember
        isOpen={showDeleteMember}
        member={deletingMember}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={loading}
      />

      {/* Team Members List */}
      <TeamMembersList
        teamMembers={teamMembers}
        loading={loading}
        error={error}
        handleEditMember={handleEditMember}
        handleRemoveMember={handleRemoveMember}
        handleViewMember={handleViewMember}
      />

      {/* Guidelines */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Team Management Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="mb-2"><strong>Team Composition:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Maximum {maxTeamSize} members including team leader</li>
              <li>• One team leader and up to 3 team members</li>
              <li>• All members must be registered individually</li>
              <li>• Team leader has administrative privileges</li>
            </ul>
          </div>
          <div>
            <p className="mb-2"><strong>Important Deadlines:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Team finalization: November 6, 2025, 11:59 PM IST</li>
              <li>• All members must confirm participation</li>
              <li>• Late additions will not be accepted</li>
              <li>• Ensure all skills complement each other</li>
            </ul>
          </div>
        </div>
      </div>

      {!canAddMembers && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Team Full</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            You have reached the maximum team size of {maxTeamSize} members. Remove a member to add someone new.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageTeam;