import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  User,
  Crown,
  AlertTriangle,
  RefreshCw,
  Loader
} from 'lucide-react';
import { userAPI } from '../../../configs/api';
import { toast } from 'react-toastify';

const ManageTeam = () => {
  // Leader profile and team data
  const [leaderProfile, setLeaderProfile] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [showAddMember, setShowAddMember] = useState(false);
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
  const [errors, setErrors] = useState({});

  const maxTeamSize = 5; // Leader + 4 members
  const canAddMembers = (teamMembers.length + 1) < maxTeamSize; // +1 for leader

  // Fetch leader profile and team data
  const fetchLeaderData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try authenticated leader profile first
      const response = await userAPI.getLeaderProfile();
      
      if (response.data && response.data.leader) {
        setLeaderProfile(response.data.leader);
        setTeamMembers(response.data.teamMembers || []);
        
        toast.success('Team data loaded successfully!');
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
    setNewMember({
      fullName: member.fullName || '',
      email: member.email || '',
      phone: member.phone || '',
      collegeName: member.collegeName || '',
      course: member.course || '',
      collegeBranch: member.collegeBranch || '',
      collegeSemester: member.collegeSemester || '',
      GitHubProfile: member.GitHubProfile || ''
    });
    setShowAddMember(true);
  };

  const handleUpdateMember = async () => {
    if (!validateMemberForm(newMember)) return;
    
    try {
      setLoading(true);
      
      const updateData = {
        ...newMember,
        leaderId: leaderProfile?._id
      };
      
      const response = await userAPI.editMember(editingMember._id, updateData);
      
      if (response.data) {
        // Refresh team data
        await fetchLeaderData();
        resetForm();
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

  const handleRemoveMember = async (member) => {
    if (window.confirm(`Are you sure you want to remove ${member.fullName} from the team?`)) {
      try {
        setLoading(true);
        
        const removeData = {
          memberId: member._id,
          teamId: leaderProfile?.teamId?._id || leaderProfile?.teamId,
          leaderId: leaderProfile?._id
        };
        
        const response = await userAPI.removeMember(removeData);
        
        if (response.data) {
          // Refresh team data
          await fetchLeaderData();
          toast.success('Team member removed successfully!');
        }
      } catch (error) {
        console.error('Error removing member:', error);
        const errorMessage = error.response?.data?.message || 'Failed to remove team member';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
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
              Add, edit, and manage your team members. Maximum team size: {maxTeamSize} members.
            </p>
          </div>
          
          {canAddMembers && !showAddMember && (
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0d2d4f] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
          )}
        </div>
        
        {/* Team Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-800">{teamMembers.length}</div>
            <div className="text-sm text-blue-600">Current Members</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-800">
              {teamMembers.filter(m => m.status === 'confirmed').length}
            </div>
            <div className="text-sm text-green-600">Confirmed</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-800">
              {teamMembers.filter(m => m.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-800">
              {maxTeamSize - teamMembers.length}
            </div>
            <div className="text-sm text-purple-600">Slots Available</div>
          </div>
        </div>
      </div>

      {/* Add/Edit Member Form */}
      {showAddMember && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
            </h3>
            {loading && <Loader className="w-5 h-5 animate-spin text-[#0B2A4A]" />}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={newMember.fullName}
                onChange={(e) => setNewMember({...newMember, fullName: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
                disabled={loading}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
                disabled={loading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={newMember.phone}
                onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
                disabled={loading}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College Name</label>
              <input
                type="text"
                value={newMember.collegeName}
                onChange={(e) => setNewMember({...newMember, collegeName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                placeholder="Enter college name"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <input
                type="text"
                value={newMember.course}
                onChange={(e) => setNewMember({...newMember, course: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                placeholder="Enter course (e.g., B.Tech CSE)"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College Branch</label>
              <input
                type="text"
                value={newMember.collegeBranch}
                onChange={(e) => setNewMember({...newMember, collegeBranch: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                placeholder="Enter branch/department"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <input
                type="number"
                value={newMember.collegeSemester}
                onChange={(e) => setNewMember({...newMember, collegeSemester: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                placeholder="Enter current semester"
                min="1"
                max="10"
                disabled={loading}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile (Optional)</label>
              <input
                type="url"
                value={newMember.GitHubProfile}
                onChange={(e) => setNewMember({...newMember, GitHubProfile: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                placeholder="https://github.com/username"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={editingMember ? handleUpdateMember : handleAddMember}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0d2d4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {editingMember ? 'Update Member' : 'Add Member'}
            </button>
            <button
              onClick={cancelEdit}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Team Members List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
            <button 
              onClick={fetchLeaderData}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-[#0B2A4A] transition-colors disabled:opacity-50"
              title="Refresh team data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <Loader className="w-8 h-8 animate-spin text-[#0B2A4A] mx-auto mb-4" />
            <p className="text-gray-600">Loading team data...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchLeaderData}
              className="px-4 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0d2d4f] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Team Leader */}
            {leaderProfile && (
              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-yellow-400 to-orange-500">
                      <Crown className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-800">{leaderProfile.fullName}</h4>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Team Leader
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {leaderProfile.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {leaderProfile.phone}
                        </div>
                        {leaderProfile.collegeName && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {leaderProfile.collegeName}
                          </div>
                        )}
                        {leaderProfile.course && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {leaderProfile.course}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members */}
            {teamMembers.map((member) => (
              <div key={member._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-blue-400 to-blue-600">
                      {member.fullName ? member.fullName.charAt(0).toUpperCase() : 'M'}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-800">{member.fullName}</h4>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {member.role || 'Member'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {member.phone}
                        </div>
                        {member.collegeName && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {member.collegeName}
                          </div>
                        )}
                        {member.course && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {member.course}
                          </div>
                        )}
                      </div>

                      {member.GitHubProfile && (
                        <div className="mt-2">
                          <a 
                            href={member.GitHubProfile} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#0B2A4A] hover:underline text-sm"
                          >
                            GitHub Profile
                          </a>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-gray-500">
                          Joined {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditMember(member)}
                      disabled={loading}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Edit member"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveMember(member)}
                      disabled={loading}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty state for no members */}
            {teamMembers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No team members added yet</p>
                <p className="text-xs mt-1">Add team members to build your hackathon team</p>
              </div>
            )}
          </div>
        )}
      </div>

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
              <li>• One team leader and up to {maxTeamSize - 1} team members</li>
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