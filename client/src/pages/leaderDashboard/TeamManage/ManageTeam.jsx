import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { userAPI } from '../../../configs/api';
import { toast } from 'react-hot-toast';
import TeamMembersList from './TeamMembersList';

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
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);

  // maxTeamSize = total members including leader
  const maxTeamSize = 4; // 1 leader + 3 team members
  const maxMembersExcludingLeader = maxTeamSize - 1;
  const canAddMembers = teamMembers.length < maxMembersExcludingLeader;

  // Filter team members based on search
  const filteredMembers = teamMembers.filter(member =>
    (member.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.collegeName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch leader profile and team data
  const fetchLeaderData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check sessionStorage for team data first
      const storedLeader = JSON.parse(sessionStorage.getItem('leaderProfile'));
      const storedMembers = JSON.parse(sessionStorage.getItem('apiTeamMembers')) || [];
      
      //add a condition where only leader is there
      if (storedLeader && storedMembers.length === 0) {
        setLeaderProfile(storedLeader.member);
        setTeamMembers([]);
        return;
      } else if (storedLeader && Array.isArray(storedMembers)) {
        setLeaderProfile(storedLeader.member);
        setTeamMembers(storedMembers);
        return;
      }
      // Fetch from API if not in sessionStorage
      const response = await userAPI.getLeaderProfile();

      if (response?.data && response.data.leader) {
        const { leader, team } = response.data;
        setLeaderProfile(leader);
        setTeamMembers(team?.members || []);

        // Store in sessionStorage for faster future loads
        sessionStorage.setItem('leaderProfile', JSON.stringify(leader));
        sessionStorage.setItem('apiTeamMembers', JSON.stringify(team?.members || []));

        return;
      }

      // If response didn't contain expected data
      setError('No leader data found.');
    } catch (err) {
      console.error('Error fetching leader data:', err);
      setError('Failed to load team data');

    } finally {
      setLoading(false);
    }
  };

  // Load team data on component mount
  useEffect(() => {
    fetchLeaderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditMember = (member) => {

    
    // Store the member ID separately to preserve it
    const memberId = member?._id || member?.id;

    
    if (!memberId) {
      console.error('ERROR: No member ID found in member object!');
      console.error('Member object:', member);
      alert('Error: Cannot edit member - no ID found. Please refresh the page and try again.');
      return;
    }
    
    setEditingMember(member);
    setEditingMemberId(memberId);
    setShowEditMember(true);
  };

  const handleSaveEditedMember = async (updatedMemberData) => {
    try {
      setLoading(true);
      
    

      const updateData = {
        ...updatedMemberData,
        leaderId: leaderProfile?._id
      };

      // Use the stored member ID
      if (!editingMemberId) {
        throw new Error('Member ID is required for editing');
      }

      
      
      const response = await userAPI.editMember(editingMemberId, updateData);

      if (response?.data) {
        await fetchLeaderData();
        setShowEditMember(false);
        setEditingMember(null);
        setEditingMemberId(null);

      }
    } catch (err) {
      console.error('Error updating member:', err);
      
      // Show user-friendly error message
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update member';
      alert(`Error: ${errorMessage}`);

    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditMember(false);
    setEditingMember(null);
    setEditingMemberId(null);
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

      if (response?.data) {
        await fetchLeaderData();
        setShowDeleteMember(false);
        setDeletingMember(null);

      }
    } catch (err) {
      console.error('Error removing member:', err);

    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteMember(false);
    setDeletingMember(null);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Team</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Add, edit, and manage your team members. Maximum team size: {maxTeamSize} (1 leader + {maxMembersExcludingLeader} members).
              </p>
            </div>
          </div>

          {/* Search + Add info (responsive) */}
          <div className="flex items-center gap-3 w-full sm:w-auto mt-5">
            <div className="relative w-full sm:w-64 md:w-80">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search members by name, email, college..."
                className="w-full border border-blue-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
            </div>


          </div>
        </div>

        {/* Team Members Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Team Members</h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your team members and their information</p>
            </div>

            {/* visible on small screens under header, keep consistent */}
            <div className="sm:hidden">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                1 Leader + {teamMembers.length}/{maxMembersExcludingLeader} Members
              </span>
            </div>
          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* TeamMembersList should handle its own responsive rendering (cards on mobile). */}
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


        {/* Guidelines & Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              Team Guidelines
            </h3>

            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">1</div>
                <p className="text-gray-700"><strong>Team Size:</strong> Maximum {maxTeamSize} members including team leader</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">2</div>
                <p className="text-gray-700"><strong>Composition:</strong> 1 team leader + up to {maxMembersExcludingLeader} team members</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">3</div>
                <p className="text-gray-700"><strong>Registration:</strong> All members must register individually</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 sm:p-6 border border-orange-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              Important Deadlines
            </h3>

            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between py-2 border-b border-orange-100">
                <span>Team Finalization</span>
                <span className="font-semibold text-orange-600">Feb 25, 2025</span>
              </div>
              <div className="flex justify-between py-2 border-b border-orange-100">
                <span>Member Confirmation</span>
                <span className="font-semibold text-orange-600">Feb 25, 2025</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Late Additions Close</span>
                <span className="font-semibold text-orange-600">Feb 25, 11:59 PM IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Full Warning */}
        {!canAddMembers && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 sm:p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-800 mb-1">Team Full</p>
              <p className="text-yellow-700 text-sm sm:text-base">
                You have reached the maximum team size of {maxTeamSize} members. To add a new member, you'll need to remove an existing one first.
              </p>
            </div>
          </div>
        )}
      </div>

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
  );
};

export default ManageTeam;
