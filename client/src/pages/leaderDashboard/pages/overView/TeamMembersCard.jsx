import React from 'react';
import { 
  Users,
  Mail,
  GraduationCap,
  MapPin,
  User
} from 'lucide-react';

const TeamMembersCard = ({ apiTeamMembers, teamMembers }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[#0B2A4A]" />
          <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
        </div>
        <span className="text-sm text-gray-500">
          {(apiTeamMembers.length || teamMembers.length)}/4 Added
        </span>
      </div>

      <div className="space-y-4">
        {(apiTeamMembers.length > 0 || teamMembers.length > 0) ? (
          (apiTeamMembers.length > 0 ? apiTeamMembers : teamMembers)
            .filter(member => member.role !== 'Leader')
            .map((member, index) => (
              <div key={member._id || index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                {/* Member Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">
                    {(member.fullName || member.name || 'M').charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Member Details */}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {member.fullName || member.name || `Member ${index + 1}`}
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {member.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    {member.role && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                        {member.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No team members added yet</p>
            <p className="text-xs mt-1">Add team members to complete your team</p>
          </div>
        )}

        {/* Placeholder slots for remaining members */}
        {Array.from({ 
          length: Math.max(0, 4 - (apiTeamMembers.length || teamMembers.length)) 
        }).map((_, index) => (
          <div key={`empty-${index}`} className="flex items-center gap-4 p-3 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm">
                Member Slot {(apiTeamMembers.length || teamMembers.length) + index + 1}
              </p>
              <p className="text-xs text-gray-400">Waiting to be filled</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembersCard;