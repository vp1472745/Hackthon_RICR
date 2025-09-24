import React, { useState, useEffect } from 'react';
import { Plus, Users, Loader2 } from 'lucide-react';
import TeamMemberCard from './TeamMemberCard';
import AddMemberModal from './AddMemberModal';
import DeleteConfirmation from './DeleteConfirmation';
import EditMemberPage from './EditMemberPage';
import api from '../../../configs/api';

const TeamPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, member: null });
  const [message, setMessage] = useState('');

  // Fetch members on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/members/getmember');
      
      console.log('API Response:', response.data); // Debug log
      
      // Handle the specific backend response structure
      if (response.data.success && response.data.data) {
        const membersData = response.data.data.members || [];
        console.log('Members data:', membersData); // Debug log
        setMembers(membersData);
      } else if (response.data.success && response.data.members) {
        // Fallback for direct members array
        console.log('Direct members:', response.data.members);
        setMembers(response.data.members);
      } else {
        setError('Failed to fetch members');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch members');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
  };

  const handleDeleteClick = (member) => {
    setDeleteModal({ show: true, member });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.member) return;

    try {
      await api.delete(`/members/deletemember/${deleteModal.member._id}`);
      setMembers(prev => prev.filter(member => member._id !== deleteModal.member._id));
      setMessage('Member deleted successfully');
      setDeleteModal({ show: false, member: null });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete member');
      console.error('Error deleting member:', err);
    }
  };

  // ✅ IMPORTANT: This function is called when modal saves successfully
  const handleMemberSave = async () => {
    try {
      // Refresh members list from backend to get latest data
      await fetchMembers();
      setMessage('Member added successfully');
      setIsModalOpen(false);
    } catch {
      setError('Failed to refresh members list');
    }
  };

  const handleEditSave = async (updatedMember) => {
    try {
      const response = await api.put(`/members/updatemember/${editingMember._id}`, updatedMember);
      
      if (response.data.success) {
        setMembers(prev => prev.map(member => 
          member._id === editingMember._id ? response.data.member : member
        ));
        setMessage('Member updated successfully');
        setEditingMember(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update member');
    }
  };

  const handleEditCancel = () => {
    setEditingMember(null);
  };

  // If in edit mode, show EditMemberPage
  if (editingMember) {
    return (
      <EditMemberPage 
        member={editingMember}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-slate-600">Loading team members...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0B2A4A] to-[#1D5B9B] rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Team Members</h1>
                <p className="text-slate-600">Manage your team members and their roles</p>
              </div>
            </div>
            <button
              onClick={handleAddMember}
              className="bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] text-white rounded-lg px-6 py-3 hover:shadow-lg transition-all font-medium flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Members Grid */}
        {members.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-200/60">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No team members yet</h3>
            <p className="text-slate-600 mb-6">Get started by adding your first team member</p>
            <button
              onClick={handleAddMember}
              className="bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] text-white rounded-lg px-6 py-3 hover:shadow-lg transition-all font-medium flex items-center space-x-2 mx-auto"
            >
              <Plus size={20} />
              <span>Add First Member</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <TeamMemberCard
                key={member._id}
                member={member}
                onEdit={() => handleEditMember(member)}
                onDelete={() => handleDeleteClick(member)}
              />
            ))}
          </div>
        )}

        {/* Add Member Modal */}
        <AddMemberModal
          showModal={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleMemberSave}
          existingMembers={members}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          showModal={deleteModal.show}
          onClose={() => setDeleteModal({ show: false, member: null })}
          onConfirm={handleDeleteConfirm}
          memberName={deleteModal.member?.fullName || ''}
        />
      </div>
    </div>
  );
};

export default TeamPage;