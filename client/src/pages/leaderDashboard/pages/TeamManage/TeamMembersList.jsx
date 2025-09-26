import React from 'react';
import { 
  Users, 
  Crown, 
  Mail, 
  Phone, 
  User, 
  Edit, 
  Trash2, 
  Loader,
  Eye
} from 'lucide-react';

const TeamMembersList = ({ 
  teamMembers, 
  loading, 
  error, 
  handleEditMember, 
  handleRemoveMember,
  handleViewMember
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <Loader className="w-8 h-8 animate-spin text-[#0B2A4A] mx-auto mb-4" />
          <p className="text-gray-600">Loading team data...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
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
                    onClick={() => handleViewMember(member)}
                    disabled={loading}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                    title="View member details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
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
  );
};

export default TeamMembersList;