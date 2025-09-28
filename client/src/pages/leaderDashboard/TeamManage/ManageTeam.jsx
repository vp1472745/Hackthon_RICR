import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { userAPI } from '../../../configs/api';
import { toast } from 'react-toastify';
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
  const [searchTerm, setSearchTerm] = useState('');

  // UI states
  const [showEditMember, setShowEditMember] = useState(false);
  const [showViewMember, setShowViewMember] = useState(false);
  const [showDeleteMember, setShowDeleteMember] = useState(false);

  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);

  const maxTeamSize = 4; // 1 Leader + 4 members  
  const canAddMembers = teamMembers.length < 4; // Max 4 team members (excluding leader)

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

      const response = await userAPI.getLeaderProfile();

      if (response.data && response.data.leader) {
        const { leader, team } = response.data;
        setLeaderProfile(leader);
        setTeamMembers(team?.members || []);
        toast.success('Team data loaded successfully!');
        return;
      }
    } catch (error) {
      console.error('Error fetching leader data:', error);

      const hackathonUser = JSON.parse(localStorage.getItem('hackathonUser') || '{}');
      if (hackathonUser.user && hackathonUser.user._id) {
        try {
          const userResponse = await userAPI.getUserById(hackathonUser.user._id);
          if (userResponse.data && userResponse.data.user) {
            setLeaderProfile(userResponse.data.user);
            setTeamMembers(userResponse.data.user.teamInfo?.members || []);

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
      setRefreshing(false);
    }
  };


  // Load team data on component mount
  useEffect(() => {
    fetchLeaderData();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Manage Team</h1>
                  <p className="text-gray-600 text-sm sm:text-lg">
                    Add, edit, and manage your team members. Maximum team size: {maxTeamSize} members (1 leader + 3 team members).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Team Members</h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Manage your team members and their information
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mt-2 sm:mt-0">
                1 Leader + {teamMembers.length}/{maxTeamSize - 1} Members
              </span>
            </div>
          </div>

          {/* Team Members List */}
          <TeamMembersList
            teamMembers={filteredMembers}
            loading={loading}
            error={error}
            handleEditMember={handleEditMember}
            handleRemoveMember={handleRemoveMember}
            handleViewMember={handleViewMember}
            searchTerm={searchTerm}
          />
        </div>

        {/* Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              Team Guidelines
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                  1
                </div>
                <p className="text-gray-700 text-sm sm:text-base"><strong>Team Size:</strong> Maximum {maxTeamSize} members including team leader</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                  2
                </div>
                <p className="text-gray-700 text-sm sm:text-base"><strong>Composition:</strong> 1 team leader + up to 3 team members</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                  3
                </div>
                <p className="text-gray-700 text-sm sm:text-base"><strong>Registration:</strong> All members must register individually</p>
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

        {/* Team Full Warning */}
        {!canAddMembers && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">Team Full</p>
              <p className="text-yellow-700 text-sm sm:text-base">
                You have reached the maximum team size of {maxTeamSize} members. To add a new member,
                you'll need to remove an existing one first.
              </p>
            </div>
          </div>
        )}

        {/* Modals */}
        <EditMember
          isOpen={showEditMember}
          member={editingMember}
          onSave={handleSaveEditedMember}
          onCancel={handleCancelEdit}
          loading={loading}
        />

        <ViewMember
          isOpen={showViewMember}
          member={viewingMember}
          onClose={handleCloseViewMember}
        />

        <DeleteMember
          isOpen={showDeleteMember}
          member={deletingMember}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ManageTeam;