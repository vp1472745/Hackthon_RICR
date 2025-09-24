import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  User,
  Crown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

const ManageTeam = () => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      role: 'Team Leader',
      skills: ['React', 'Node.js', 'Python'],
      status: 'confirmed',
      joinedDate: '2025-09-20',
      avatar: 'JD'
    }
  ]);
  
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    skills: ''
  });
  
  const [editingMember, setEditingMember] = useState(null);
  const [errors, setErrors] = useState({});

  const maxTeamSize = 4;
  const canAddMembers = teamMembers.length < maxTeamSize;

  const validateMemberForm = (member) => {
    const newErrors = {};
    
    if (!member.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!member.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (teamMembers.some(m => m.email === member.email && m.id !== editingMember?.id)) {
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

  const handleAddMember = () => {
    if (!validateMemberForm(newMember)) return;
    
    const member = {
      id: Date.now(),
      ...newMember,
      role: 'Team Member',
      skills: newMember.skills.split(',').map(s => s.trim()).filter(s => s),
      status: 'pending',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: newMember.name.split(' ').map(n => n[0]).join('').toUpperCase()
    };
    
    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: '', email: '', phone: '', skills: '' });
    setShowAddMember(false);
    setErrors({});
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setNewMember({
      name: member.name,
      email: member.email,
      phone: member.phone,
      skills: member.skills.join(', ')
    });
    setShowAddMember(true);
  };

  const handleUpdateMember = () => {
    if (!validateMemberForm(newMember)) return;
    
    setTeamMembers(teamMembers.map(member =>
      member.id === editingMember.id
        ? {
            ...member,
            ...newMember,
            skills: newMember.skills.split(',').map(s => s.trim()).filter(s => s),
            avatar: newMember.name.split(' ').map(n => n[0]).join('').toUpperCase()
          }
        : member
    ));
    
    setEditingMember(null);
    setNewMember({ name: '', email: '', phone: '', skills: '' });
    setShowAddMember(false);
    setErrors({});
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    }
  };

  const cancelEdit = () => {
    setEditingMember(null);
    setNewMember({ name: '', email: '', phone: '', skills: '' });
    setShowAddMember(false);
    setErrors({});
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'declined': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Invitation Pending';
      case 'declined': return 'Declined';
      default: return 'Unknown';
    }
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={newMember.phone}
                onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
              <input
                type="text"
                value={newMember.skills}
                onChange={(e) => setNewMember({...newMember, skills: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                placeholder="e.g., React, Python, UI/UX Design"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={editingMember ? handleUpdateMember : handleAddMember}
              className="px-6 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0d2d4f] transition-colors"
            >
              {editingMember ? 'Update Member' : 'Add Member'}
            </button>
            <button
              onClick={cancelEdit}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Team Members List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    member.role === 'Team Leader' 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                      : 'bg-gradient-to-br from-blue-400 to-blue-600'
                  }`}>
                    {member.role === 'Team Leader' ? (
                      <Crown className="w-6 h-6" />
                    ) : (
                      member.avatar
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-800">{member.name}</h4>
                      {member.role === 'Team Leader' && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Leader
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {member.phone}
                      </div>
                    </div>
                    
                    {member.skills && member.skills.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(member.status)}
                        <span className="text-sm text-gray-600">{getStatusText(member.status)}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Joined {new Date(member.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {member.role !== 'Team Leader' && (
                    <>
                      <button
                        onClick={() => handleEditMember(member)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit member"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Send message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {teamMembers.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No team members yet</h3>
              <p className="text-gray-500">Add team members to get started</p>
            </div>
          )}
        </div>
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